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

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Call the signin API
      const response = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign in");
      }

      // Store the token in localStorage
      if (data.session?.access_token) {
        localStorage.setItem("token", data.session.access_token);

        // Update auth state and fetch user profile
        setIsAuthenticated(true);
        await checkAuthStatus();
      } else {
        throw new Error("No access token received from server");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred during login";
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      throw err; // Re-throw so the component can handle it if needed
    } finally {
      setLoading(false);
    }
  };

  // Helper function for when token is already stored (e.g., after registration)
  const setAuthFromToken = async () => {
    setIsAuthenticated(true);
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
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        loading,
        error,
        setError,
        setAuthFromToken,
      }}
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
