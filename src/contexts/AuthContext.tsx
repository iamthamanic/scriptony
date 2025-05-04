
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { AuthChangeEvent, Session, User, AuthError } from "@supabase/supabase-js";
import { toast } from "sonner";
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const { addError } = useErrorContext();

  useEffect(() => {
    console.log("AuthProvider initializing...");
    let isMounted = true;
    
    // Log important auth-related browser information
    console.log("======== AUTH CONTEXT DEBUGGING INFO ========");
    console.log("Window location:", window.location.href);
    console.log("Has hash fragment:", !!window.location.hash);
    console.log("Has auth query params:", 
      window.location.search.includes('access_token') || 
      window.location.search.includes('error') ||
      window.location.search.includes('code')
    );
    console.log("==========================================");
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, currentSession: Session | null) => {
        console.log("Auth state changed:", event);
        if (!isMounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
        
        // Handle specific auth events
        if (event === 'PASSWORD_RECOVERY') {
          toast.info("Please update your password.");
        } else if (event === 'SIGNED_IN') {
          // Don't do heavy operations in this callback
          // Use setTimeout to prevent potential deadlocks
          setTimeout(() => {
            console.log("User signed in:", currentSession?.user?.email);
            toast.success("Successfully signed in");
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setTimeout(() => {
            console.log("User signed out");
            toast.info("Successfully signed out");
          }, 0);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log("Auth token refreshed");
        } else if (event === 'USER_UPDATED') {
          console.log("User profile updated");
        // Fix the type error by using a type guard
        } else if (
          // Use type assertion to handle the case where 'USER_DELETED' might be a valid event in runtime
          // but not recognized in the TypeScript definition
          event === 'USER_DELETED' as AuthChangeEvent
        ) {
          console.log("User account deleted");
          toast.info("Account deleted");
        }
      }
    );

    // Then get current session
    supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      if (isMounted) {
        console.log("Initial session check:", currentSession ? "Session found" : "No session");
        
        if (error) {
          console.error("Session retrieval error:", error);
          setAuthError(error);
          addError({
            message: "Authentication Error",
            details: `Failed to retrieve session: ${error.message}`,
            code: error.code,
            severity: 'warning'
          });
        } else {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
        
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [addError]);

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      toast.success("Successfully signed out");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
      addError({
        message: "Sign Out Error",
        details: `Failed to sign out: ${error.message}`,
        severity: 'warning'
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    authError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
