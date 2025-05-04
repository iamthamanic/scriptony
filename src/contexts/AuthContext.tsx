
import React, { createContext, useContext } from "react";
import type { Session, User, AuthError } from "@supabase/supabase-js";
import { useAuthListener } from "@/hooks/useAuthListener";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useErrorContext } from '@/contexts/ErrorContext';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  authError: AuthError | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  authError: null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use our custom hooks to manage auth state and actions
  const { user, session, loading, authError } = useAuthListener();
  const { signOut } = useAuthActions();
  const { addError } = useErrorContext();
  
  // Log auth error to error context if present
  React.useEffect(() => {
    if (authError) {
      addError({
        message: "Authentication Error",
        details: `Failed to retrieve session: ${authError.message}`,
        code: authError.code,
        severity: 'warning'
      });
    }
  }, [authError, addError]);

  const value = {
    user,
    session,
    loading,
    signOut,
    authError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
