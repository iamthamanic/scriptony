/**
 * Supabase Client Compatibility Layer
 * 
 * This file provides a compatibility layer for code that still imports from @/integrations/supabase/client.
 * It redirects all calls to the new API client.
 * 
 * @deprecated Use @/api instead
 */

import { authApi, storageApi } from "@/api";
import type { User, Session } from "@/api";

// Re-export types for compatibility
export type { User, Session };

// Mock Database type for compatibility
export type Database = Record<string, unknown>;

/**
 * Mock Supabase client that redirects to API client
 * @deprecated Use authApi or storageApi from @/api instead
 */
export const supabase = {
  auth: {
    onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
      console.warn("supabase.auth.onAuthStateChange is deprecated. Use authApi directly.");
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
      console.warn("supabase.auth.getSession is deprecated. Use authApi.getSession() instead.");
      const { data, error } = await authApi.getSession();
      return { data: { session: data?.session ?? null }, error };
    },
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      console.warn("supabase.auth.signInWithPassword is deprecated. Use authApi.signIn() instead.");
      return authApi.signIn(email, password);
    },
    signUp: async ({ email, password }: { email: string; password: string }) => {
      console.warn("supabase.auth.signUp is deprecated. Use authApi.signUp() instead.");
      // Note: username is required in new API
      return authApi.signUp(email, password, email.split('@')[0]);
    },
    signOut: async () => {
      console.warn("supabase.auth.signOut is deprecated. Use authApi.signOut() instead.");
      return authApi.signOut();
    }
  },
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => {
        console.warn("supabase.storage is deprecated. Use storageApi.uploadFile() instead.");
        return storageApi.uploadFile(bucket, file, path);
      },
      getPublicUrl: (path: string) => {
        console.warn("supabase.storage is deprecated. Use storageApi.getPublicUrl() instead.");
        const url = storageApi.getPublicUrl(bucket, path);
        return { data: { publicUrl: url } };
      },
      remove: async (paths: string[]) => {
        console.warn("supabase.storage is deprecated. Use storageApi.deleteFile() instead.");
        for (const path of paths) {
          await storageApi.deleteFile(bucket, path);
        }
        return { error: null };
      }
    })
  }
};

// Keep the default export for compatibility
export default supabase;
