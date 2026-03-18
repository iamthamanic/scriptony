import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, apiClient, User, Session } from "@/api";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const { data, error } = await authApi.getSession();
      if (error) {
        console.error("Session check failed:", error);
        setUser(null);
        setSession(null);
        apiClient.setToken(null);
      } else {
        setUser(data?.user || null);
        setSession(data?.session || null);
        // Token storage is handled by the API client
        if (data?.user) {
          apiClient.setToken(localStorage.getItem("token"));
        }
      }
    } catch (error) {
      console.error("Session check error:", error);
      setUser(null);
      setSession(null);
      apiClient.setToken(null);
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email: string, password: string, username: string) {
    const { data, error } = await authApi.signUp(email, password, username);
    if (error) {
      throw new Error(error.message);
    }
    if (data) {
      setUser(data.user);
      setSession(data.session);
      localStorage.setItem("token", data.token);
      apiClient.setToken(data.token);
    }
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await authApi.signIn(email, password);
    if (error) {
      throw new Error(error.message);
    }
    if (data) {
      setUser(data.user);
      setSession(data.session);
      localStorage.setItem("token", data.token);
      apiClient.setToken(data.token);
    }
  }

  async function signOut() {
    await authApi.signOut();
    setUser(null);
    setSession(null);
    localStorage.removeItem("token");
    apiClient.setToken(null);
  }

  async function signInWithGoogle() {
    await authApi.signInWithGoogle();
    // Redirect happens in authApi
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        signInWithGoogle,
      }}
    >
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
