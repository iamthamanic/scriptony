import { useState, useEffect } from "react";
import { authApi, User, Session } from "@/api";
import { toast } from "sonner";
import { isDevelopmentMode, getDevModeUser } from "@/utils/devMode";

/**
 * Custom hook to listen for authentication state changes
 * Replaces Supabase auth listener with API client
 */
export const useAuthListener = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<Error | null>(null);

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
        id: "mock-session-id",
        userId: mockUser.id,
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      } as Session;
      
      // Set the mock user and session
      setUser(mockUser);
      setSession(mockSession);
      setLoading(false);
      
      // In development mode, show a toast to indicate we're using a mock user
      toast.info("Development Mode: Using mock user");
      
      return () => { isMounted = false; };
    }
    
    // If not in dev mode, proceed with API client
    const checkSession = async () => {
      try {
        const { data, error } = await authApi.getSession();
        
        if (!isMounted) return;
        
        if (error) {
          console.error("Session retrieval error:", error);
          setAuthError(new Error(error.message));
        } else {
          console.log("Initial session check:", data?.session ? "Session found" : "No session");
          setSession(data?.session ?? null);
          setUser(data?.user ?? null);
        }
      } catch (err) {
        console.error("Session check failed:", err);
        if (isMounted) {
          setAuthError(err instanceof Error ? err : new Error("Unknown error"));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    checkSession();
    
    // Set up polling for session changes (since API doesn't have real-time like Supabase)
    const intervalId = setInterval(async () => {
      if (!isMounted) return;
      
      try {
        const { data, error } = await authApi.getSession();
        if (!error && data) {
          setSession(data.session);
          setUser(data.user);
        }
      } catch (err) {
        console.error("Session poll error:", err);
      }
    }, 60000); // Check every minute

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return { user, session, loading, authError };
};
