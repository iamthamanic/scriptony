/**
 * Custom Supabase Client Compatibility Layer
 * 
 * This file provides a compatibility layer for code that still imports from @/integrations/supabase/customClient.
 * It redirects all calls to the new API client.
 * 
 * @deprecated Use @/api instead
 */

import { authApi, storageApi } from "@/api";
import type { User, Session } from "@/api";
import { isDevelopmentMode } from "@/utils/devMode";

// Re-export types for compatibility
export type { User, Session };

// Mock Database type for compatibility
export type Database = Record<string, unknown>;

/**
 * Mock custom Supabase client that redirects to API client
 * @deprecated Use authApi or storageApi from @/api instead
 */
export const customSupabase = {
  auth: {
    onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
      console.warn("customSupabase.auth.onAuthStateChange is deprecated. Use authApi directly.");
      
      // In development mode, trigger callback immediately with mock data
      if (isDevelopmentMode()) {
        const mockUser = {
          id: "dev-user-id",
          email: "dev@example.com",
          username: "devuser",
          createdAt: new Date().toISOString(),
        } as User;
        
        const mockSession = {
          id: "dev-session-id",
          userId: mockUser.id,
          expiresAt: new Date(Date.now() + 3600000).toISOString(),
        } as Session;
        
        setTimeout(() => callback('SIGNED_IN', mockSession), 0);
      }
      
      // Return a mock subscription
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              console.log("Unsubscribed from auth state changes");
            }
          }
        }
      };
    },
    getSession: async () => {
      console.warn("customSupabase.auth.getSession is deprecated. Use authApi.getSession() instead.");
      
      // In development mode, return mock session
      if (isDevelopmentMode()) {
        const mockUser = {
          id: "dev-user-id",
          email: "dev@example.com",
          username: "devuser",
          createdAt: new Date().toISOString(),
        } as User;
        
        const mockSession = {
          id: "dev-session-id",
          userId: mockUser.id,
          expiresAt: new Date(Date.now() + 3600000).toISOString(),
        } as Session;
        
        return { data: { session: mockSession }, error: null };
      }
      
      const { data, error } = await authApi.getSession();
      return { data: { session: data?.session ?? null }, error };
    },
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      console.warn("customSupabase.auth.signInWithPassword is deprecated. Use authApi.signIn() instead.");
      return authApi.signIn(email, password);
    },
    signUp: async ({ email, password }: { email: string; password: string }) => {
      console.warn("customSupabase.auth.signUp is deprecated. Use authApi.signUp() instead.");
      return authApi.signUp(email, password, email.split('@')[0]);
    },
    signOut: async () => {
      console.warn("customSupabase.auth.signOut is deprecated. Use authApi.signOut() instead.");
      return authApi.signOut();
    }
  },
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => {
        console.warn("customSupabase.storage is deprecated. Use storageApi.uploadFile() instead.");
        return storageApi.uploadFile(bucket, file, path);
      },
      getPublicUrl: (path: string) => {
        console.warn("customSupabase.storage is deprecated. Use storageApi.getPublicUrl() instead.");
        const url = storageApi.getPublicUrl(bucket, path);
        return { data: { publicUrl: url } };
      },
      remove: async (paths: string[]) => {
        console.warn("customSupabase.storage is deprecated. Use storageApi.deleteFile() instead.");
        for (const path of paths) {
          await storageApi.deleteFile(bucket, path);
        }
        return { error: null };
      }
    })
  }
};

/**
 * Get development mode client
 * @deprecated Use authApi directly instead
 */
export const getDevModeClient = () => {
  console.warn("getDevModeClient is deprecated. Use authApi directly.");
  return customSupabase;
};

// Keep the default export for compatibility
export default customSupabase;
