
import { customSupabase } from "@/integrations/supabase/customClient";
import { isDevelopmentMode } from "@/utils/devMode";

/**
 * Creates a timeout Promise with proper cleanup to prevent memory leaks
 * Using a shorter timeout to prevent long-hanging operations
 */
export const createTimeout = (timeoutMs: number = 10000): { promise: Promise<never>, cancel: () => void } => {
  let timeoutId: number;
  
  const promise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms. Please try again later.`));
    }, timeoutMs) as unknown as number;
  });
  
  return {
    promise,
    cancel: () => clearTimeout(timeoutId)
  };
};

/**
 * Delete a world and all its associated data with optimized error handling and fewer retries
 */
export const deleteWorld = async (worldId: string): Promise<void> => {
  console.log('Starting world deletion process for world:', worldId);
  
  // Check for development mode at the function level
  const devMode = isDevelopmentMode();
  if (devMode) {
    console.log('Development mode detected for world deletion');
  }
  
  // Set a shorter timeout to prevent indefinite hanging (10 seconds)
  const { promise: timeoutPromise, cancel: cancelTimeout } = createTimeout(10000);
  
  // Flag to track operation completion for cleanup purposes
  let operationCompleted = false;

  try {
    // First, verify the world exists
    const { data: worldCheck, error: worldCheckError } = await customSupabase
      .from('worlds')
      .select('id, name')
      .eq('id', worldId)
      .maybeSingle();
      
    if (worldCheckError) {
      console.error('Error checking world existence:', worldCheckError);
      throw new Error(`World not found or access denied: ${worldCheckError.message}`);
    }
    
    if (!worldCheck) {
      console.log('World not found in database, may already be deleted');
      // Still consider this a success since the end goal (world not in DB) is achieved
      operationCompleted = true;
      return;
    }
    
    // Clear any world_id references in projects
    console.log('Updating project references to world:', worldId);
    const { error: projectError } = await customSupabase
      .from('projects')
      .update({ world_id: null })
      .eq('world_id', worldId);
      
    if (projectError) {
      console.warn(`Failed to update project references: ${projectError.message}`);
      // Continue with deletion even if this fails
    }
    
    // Delete categories first - this is important
    console.log('Deleting categories for world:', worldId);
    const { error: catError } = await customSupabase
      .from('world_categories')
      .delete()
      .eq('world_id', worldId);
      
    if (catError) {
      console.error(`Failed to delete world categories: ${catError.message}`);
      throw new Error(`Failed to delete world categories: ${catError.message}`);
    }
    
    // Short delay to ensure categories are fully deleted before deleting world
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Delete the world itself
    console.log('Now deleting world itself');
    const { error } = await customSupabase
      .from('worlds')
      .delete()
      .eq('id', worldId);
      
    if (error) {
      throw new Error(`Failed to delete world: ${error.message}`);
    }
    
    console.log('World deleted successfully');
    
    // Mark operation as completed successfully to ensure proper cleanup
    operationCompleted = true;
    
    // Add a small delay before resolving to ensure all state updates have time to propagate
    await new Promise(resolve => setTimeout(resolve, 200));
    
  } catch (error) {
    console.error('Error in delete world process:', error);
    throw error;
  } finally {
    // Always cancel the timeout to prevent memory leaks
    cancelTimeout();
    console.log('Timeout canceled, cleanup complete. Operation successful:', operationCompleted);
  }
};
