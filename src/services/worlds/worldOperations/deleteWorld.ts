
import { customSupabase } from "@/integrations/supabase/customClient";
import { isDevelopmentMode } from "@/utils/devMode";

/**
 * Creates a timeout Promise with proper cleanup to prevent memory leaks
 */
export const createTimeout = (timeoutMs: number = 45000): { promise: Promise<never>, cancel: () => void } => {
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
 * Delete a world and all its associated data
 */
export const deleteWorld = async (worldId: string): Promise<void> => {
  console.log('Starting world deletion process for world:', worldId);
  
  // Explicitly check for development mode at the function level
  const devMode = isDevelopmentMode();
  if (devMode) {
    console.log('Development mode detected for world deletion');
  }
  
  // Configure headers for all requests in this function
  const headers: Record<string, string> = {};
  if (devMode) {
    headers['x-dev-mode'] = 'true';
    console.log('Added dev mode headers for all deletion requests');
  }
  
  // Set a longer timeout to prevent indefinite hanging (45 seconds instead of 30)
  const { promise: timeoutPromise, cancel: cancelTimeout } = createTimeout(45000);
  let operationCompleted = false;

  try {
    // First, check if the world exists
    console.log('Checking if world exists:', worldId);
    const { data: worldCheck, error: worldCheckError } = await customSupabase
      .from('worlds')
      .select('id, name')
      .eq('id', worldId)
      .single();
      
    if (worldCheckError) {
      console.error('Error checking world existence:', worldCheckError);
      throw new Error(`World not found or access denied: ${worldCheckError.message}`);
    }
    
    console.log('World found:', worldCheck);
    
    // First, clear any world_id references in projects
    console.log('Updating project references to world:', worldId);
    const { error: projectError } = await customSupabase
      .from('projects')
      .update({ world_id: null })
      .eq('world_id', worldId)
      .select('id');
      
    if (projectError) {
      console.error('Error updating project references:', projectError);
      // Continue with deletion even if this fails
    } else {
      console.log('Successfully updated project references');
    }
    
    // Then, delete all categories associated with this world
    console.log('Deleting categories for world:', worldId);
    const { data: deletedCategories, error: catError } = await customSupabase
      .from('world_categories')
      .delete()
      .eq('world_id', worldId)
      .select('id');
      
    if (catError) {
      console.error('Error deleting world categories:', catError);
      throw new Error(`Failed to delete world categories: ${catError.message}`);
    }
    
    console.log('Categories deleted:', deletedCategories?.length || 0, 'now deleting world');
    
    // Now delete the world itself with a retry mechanism
    const executeWorldDeletion = async (attempt = 1): Promise<any> => {
      try {
        const { data, error } = await customSupabase
          .from('worlds')
          .delete()
          .eq('id', worldId)
          .select();
          
        if (error) {
          if (attempt < 3) {
            console.log(`Delete attempt ${attempt} failed, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 500));
            return executeWorldDeletion(attempt + 1);
          }
          throw error;
        }
        
        return { data, error: null };
      } catch (error) {
        if (attempt < 3) {
          console.log(`Delete attempt ${attempt} failed with exception, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 500));
          return executeWorldDeletion(attempt + 1);
        }
        throw error;
      }
    };
    
    // Execute world deletion with retries
    const deletePromise = executeWorldDeletion();
    
    // Race against the timeout
    const { data: deletedWorld, error } = await Promise.race([deletePromise, timeoutPromise]);
      
    // Mark operation as completed successfully to ensure proper cleanup
    operationCompleted = true;
    
    if (error) {
      console.error('Error deleting world:', error);
      throw new Error(`Failed to delete world: ${error.message}`);
    }
    
    console.log('World deleted successfully:', deletedWorld);
  } catch (error) {
    console.error('Error in delete world process:', error);
    throw error;
  } finally {
    // Always cancel the timeout to prevent memory leaks
    cancelTimeout();
    console.log('Timeout canceled, cleanup complete');
  }
};
