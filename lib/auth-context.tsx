"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "./types";
import { authenticate, getCurrentUser, setCurrentUser, logout as logoutStore } from "./store";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getCurrentUser();
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const authenticatedUser = authenticate(username, password);
    if (authenticatedUser) {
      setUser(authenticatedUser);
      setCurrentUser(authenticatedUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    logoutStore();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
