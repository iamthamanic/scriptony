
import { useState, useEffect } from "react";
import { customSupabase } from "@/integrations/supabase/customClient";
import type { AuthChangeEvent, Session, User, AuthError } from "@supabase/supabase-js";
import { toast } from "sonner";
import { isDevelopmentMode, getDevModeUser } from "@/utils/devMode";

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
    
    // Check if we're in development mode first
    const devMode = isDevelopmentMode();
    if (devMode) {
      console.log("Development mode detected in useAuthListener, using mock user");
      
      // Create a mock session and user for development mode
      const mockUser = getDevModeUser() as User;
      
      // Create a simplified mock session
      const mockSession = {
        access_token: "mock-token",
        refresh_token: "mock-refresh-token",
        expires_in: 3600,
        expires_at: new Date().getTime() + 3600000,
        token_type: "bearer",
        user: mockUser
      } as Session;
      
      // Set the mock user and session
      setUser(mockUser);
      setSession(mockSession);
      setLoading(false);
      
      return () => { isMounted = false; };
    }
    
    // If not in dev mode, proceed with normal auth listener
    // Set up auth state listener first
    const { data: { subscription } } = customSupabase.auth.onAuthStateChange(
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

    // Only fetch session if not in dev mode
    // Then get current session
    customSupabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
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
