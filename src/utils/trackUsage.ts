
import { customSupabase } from "@/integrations/supabase/customClient";
import { isDevelopmentMode, getDevModeUser } from "@/utils/devMode";
import { toast } from "sonner";

/**
 * Tracks a user action/feature usage and saves it to the database
 * @param feature The feature being used (e.g., "creative_gym")
 * @param action The action being performed (e.g., "challenge_started")
 * @param context Additional contextual data as an object (will be stored as JSONB)
 */
export const trackUsage = async (
  feature: string, 
  action: string, 
  context?: Record<string, any>
): Promise<void> => {
  try {
    // Get the current user
    const user = isDevelopmentMode() 
      ? getDevModeUser() 
      : (await customSupabase.auth.getUser()).data.user;
    
    if (!user) {
      console.warn("Cannot track usage: No authenticated user");
      return;
    }

    // Prepare the usage data
    const usageData = {
      user_id: user.id,
      feature,
      action,
      context: context || {},
    };

    // Insert into feature_usage table
    const { error } = await customSupabase
      .from('feature_usage')
      .insert(usageData);

    if (error) {
      console.error("Error tracking usage:", error);
    }
  } catch (err) {
    console.error("Failed to track usage:", err);
    // Don't show errors to end users - tracking should be silent
  }
};

/**
 * Log page view and track as a feature usage
 * @param pageName Name of the page being viewed
 * @param context Additional context data
 */
export const trackPageView = (pageName: string, context?: Record<string, any>) => {
  trackUsage(pageName, 'page_viewed', context);
  console.log(`Page viewed: ${pageName}`);
};

/**
 * Check if the current user has admin privileges
 */
export const checkIsAdmin = async (): Promise<boolean> => {
  try {
    // In development mode, we can use mock data
    if (isDevelopmentMode()) {
      return true;
    }

    // Get projects with admin flag
    const { data, error } = await customSupabase
      .from('projects')
      .select('is_admin')
      .eq('user_id', (await customSupabase.auth.getUser()).data.user?.id)
      .eq('is_admin', true)
      .limit(1);
    
    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (err) {
    console.error("Failed to check admin status:", err);
    return false;
  }
};
