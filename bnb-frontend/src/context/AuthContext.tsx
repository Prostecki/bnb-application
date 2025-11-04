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

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      if (data.session?.access_token) {
        localStorage.setItem("token", data.session.access_token);
        // Fetch user profile first, then set authenticated
        await checkAuthStatus();
        // checkAuthStatus already sets isAuthenticated and user if token is valid
      } else {
        throw new Error(
          "Registration successful, but failed to log in automatically."
        );
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during registration";
      setError(errorMessage);
      // Ensure user is not authenticated if registration fails
      setIsAuthenticated(false);
      setUser(null);
      throw err; // Re-throw so the component can handle it
    } finally {
      setLoading(false);
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
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
        loading,
        error,
        setError,
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
