"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (userData?: any) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Проверяем токен при загрузке приложения
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Проверяем валидность токена и получаем данные пользователя
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
              // Токен недействителен
              localStorage.removeItem("token");
              setIsAuthenticated(false);
              setUser(null);
            }
          } catch (apiError) {
            console.error("Error verifying token:", apiError);
            // Если API недоступен, но токен есть, считаем пользователя авторизованным
            setIsAuthenticated(true);
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

  const login = (userData?: any) => {
    setIsAuthenticated(true);
    if (userData) {
      setUser(userData);
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("token");

    // Вызываем API для инвалидации сессии на сервере
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

    // Очищаем локальное состояние
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");

    // Перенаправляем на страницу входа
    window.location.href = "/login";
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
