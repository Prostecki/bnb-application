"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User } from "../models/user.model";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData?: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check token when application loads
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Check token validity and get user data
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
              // Token is invalid
              localStorage.removeItem("token");
              setIsAuthenticated(false);
              setUser(null);
            }
          } catch (apiError) {
            console.error("Error verifying token:", apiError);
            // If the API is unavailable, the token cannot be verified, so log out.
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
    };

    checkAuthStatus();
  }, []);

  const login = (userData?: User) => {
    setIsAuthenticated(true);
    if (userData) {
      setUser(userData);
    }
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
      value={{ isAuthenticated, user, login, logout, loading }}
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
