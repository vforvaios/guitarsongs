import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface User {
  id: number;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const STORAGE_KEY = "songbook_auth";

const getStoredAuth = () => {
  try {
    const storedAuth = localStorage.getItem(STORAGE_KEY);

    return storedAuth ? JSON.parse(storedAuth) : null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState(() => getStoredAuth());

  const login = (token: string, user: User) => {
    const authData = { token, user };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    setAuth(authData);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token: auth?.token ?? null,
        user: auth?.user ?? null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
