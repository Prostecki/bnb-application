"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type { AuthContextType } from "@/types/authContext.types";
import type { User } from "@/models/user.model";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("http://localhost:3000/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (apiError) {
          console.error("Error verifying token:", apiError);
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setIsAuthenticated, setUser, setLoading]);

  // Check token when application loads
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (userData?: User) => {
    setIsAuthenticated(true);
    // After login, re-check auth status to fetch the full user profile from the backend
    // This ensures the user object in context has the latest permissions (e.g., isAdmin)
    await checkAuthStatus();
  };

  const logout = async () => {
    const token = localStorage.getItem("token");

    // Call API to invalidate session on server
    if (token) {
      try {
        await fetch("http://localhost:3000/api/auth/signout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }

    // Clear local state
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");

    // Redirect to login page
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading, error, setError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
