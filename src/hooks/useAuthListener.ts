
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { AuthChangeEvent, Session, User, AuthError } from "@supabase/supabase-js";
import { toast } from "sonner";

/**
 * Custom hook to listen for authentication state changes
 */
export const useAuthListener = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<AuthError | null>(null);

  useEffect(() => {
    console.log("AuthListener initializing...");
    let isMounted = true;
    
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
  }, []);

  return { user, session, loading, authError };
};
