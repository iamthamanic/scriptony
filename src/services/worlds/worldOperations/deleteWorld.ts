
import { customSupabase } from "@/integrations/supabase/customClient";
import { isDevelopmentMode } from "@/utils/devMode";

/**
 * Creates a timeout Promise with proper cleanup to prevent memory leaks
 */
export const createTimeout = (timeoutMs: number = 60000): { promise: Promise<never>, cancel: () => void } => {
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
 * Delete a world and all its associated data with enhanced error handling and retries
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
  
  // Set a longer timeout to prevent indefinite hanging (60 seconds instead of 45)
  const { promise: timeoutPromise, cancel: cancelTimeout } = createTimeout(60000);
  
  // Flag to track operation completion for cleanup purposes
  let operationCompleted = false;

  try {
    // First, verify the world exists
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
    
    // Clear any world_id references in projects with retry mechanism
    const updateProjects = async (attempt = 1): Promise<void> => {
      try {
        console.log(`Updating project references to world (attempt ${attempt}):`, worldId);
        const { error: projectError } = await customSupabase
          .from('projects')
          .update({ world_id: null })
          .eq('world_id', worldId)
          .select('id');
          
        if (projectError) {
          if (attempt < 3) {
            console.log(`Project update attempt ${attempt} failed, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 500));
            return updateProjects(attempt + 1);
          }
          throw new Error(`Failed to update project references: ${projectError.message}`);
        }
        
        console.log('Successfully updated project references');
      } catch (error) {
        if (attempt < 3) {
          console.log(`Project update attempt ${attempt} failed with exception, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 500));
          return updateProjects(attempt + 1);
        }
        throw error;
      }
    };
    
    // Delete categories with retry mechanism
    const deleteCategories = async (attempt = 1): Promise<void> => {
      try {
        console.log(`Deleting categories for world (attempt ${attempt}):`, worldId);
        const { data: deletedCategories, error: catError } = await customSupabase
          .from('world_categories')
          .delete()
          .eq('world_id', worldId)
          .select('id');
          
        if (catError) {
          if (attempt < 3) {
            console.log(`Category deletion attempt ${attempt} failed, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 500));
            return deleteCategories(attempt + 1);
          }
          throw new Error(`Failed to delete world categories: ${catError.message}`);
        }
        
        console.log('Categories deleted:', deletedCategories?.length || 0);
      } catch (error) {
        if (attempt < 3) {
          console.log(`Category deletion attempt ${attempt} failed with exception, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 500));
          return deleteCategories(attempt + 1);
        }
        throw error;
      }
    };
    
    // First update projects (less critical)
    await updateProjects();
    
    // Then delete categories (more critical for referential integrity)
    await deleteCategories();
    
    console.log('Now deleting world itself');
    
    // Now delete the world itself with a retry mechanism
    const executeWorldDeletion = async (attempt = 1): Promise<any> => {
      try {
        const { data, error } = await customSupabase
          .from('worlds')
          .delete()
          .eq('id', worldId)
          .select();
          
        if (error) {
          if (attempt < 4) { // Increased max attempts for world deletion
            console.log(`World delete attempt ${attempt} failed, retrying in ${attempt * 300}ms...`);
            await new Promise(resolve => setTimeout(resolve, attempt * 300));
            return executeWorldDeletion(attempt + 1);
          }
          throw error;
        }
        
        return { data, error: null };
      } catch (error) {
        if (attempt < 4) { // Increased max attempts
          console.log(`World delete attempt ${attempt} failed with exception, retrying...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 300));
          return executeWorldDeletion(attempt + 1);
        }
        throw error;
      }
    };
    
    // Execute world deletion with improved retries
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
    
    // Add a small delay before resolving to ensure all state updates have time to propagate
    await new Promise(resolve => setTimeout(resolve, 300));
    
  } catch (error) {
    console.error('Error in delete world process:', error);
    throw error;
  } finally {
    // Always cancel the timeout to prevent memory leaks
    cancelTimeout();
    console.log('Timeout canceled, cleanup complete. Operation successful:', operationCompleted);
  }
};
