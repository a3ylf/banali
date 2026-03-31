import { createContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";

interface User {
  id_usuario: string;
  nome: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (access_token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await api.get("/core/users/me");
      setUser(response.data);
    } catch (error) {
      setUser(null);
      localStorage.removeItem("access_token");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }

    const handleUnauthorized = () => {
      setUser(null);
      localStorage.removeItem("access_token");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const login = async (access_token: string) => {
    localStorage.setItem("access_token", access_token);
    api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    await fetchUser();
  };

  const logout = async () => {
    try {
      await api.post("/authentication/logout");
    } catch (error) {
      console.error("Logout falhou ou sessão já expirada no servidor", error);
    } finally {
      setUser(null);
      localStorage.removeItem("access_token");
      delete api.defaults.headers.common.Authorization;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
