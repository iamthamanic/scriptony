
import { customSupabase } from "@/integrations/supabase/customClient";
import { isDevelopmentMode, getDevModeUser } from "@/utils/devMode";

/**
 * Gets the current user, returning a mock user if in development mode
 */
export const getCurrentUser = async () => {
  // Use mock user in development mode
  if (isDevelopmentMode()) {
    return { data: { user: getDevModeUser() } };
  }
  
  // Use actual authentication in production
  return await customSupabase.auth.getUser();
};

/**
 * Sets a timeout to prevent indefinite hanging
 * @param timeoutMs Timeout in milliseconds
 * @returns A promise that rejects after the timeout
 */
export const createTimeout = (timeoutMs: number = 30000): Promise<never> => {
  return new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms. Please try again later.`));
    }, timeoutMs);
  });
};
