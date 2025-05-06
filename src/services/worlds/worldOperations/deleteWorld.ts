
import { customSupabase } from "@/integrations/supabase/customClient";
import { isDevelopmentMode } from "@/utils/devMode";

/**
 * Creates a timeout Promise with proper cleanup to prevent memory leaks
 * Using a shorter timeout to prevent long-hanging operations
 */
export const createTimeout = (timeoutMs: number = 30000): { promise: Promise<never>, cancel: () => void } => {
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
  
  // Set a shorter timeout to prevent indefinite hanging (30 seconds)
  const { promise: timeoutPromise, cancel: cancelTimeout } = createTimeout(30000);
  
  // Flag to track operation completion for cleanup purposes
  let operationCompleted = false;

  try {
    // First, verify the world exists
    console.log('Checking if world exists:', worldId);
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
      return;
    }
    
    console.log('World found:', worldCheck);
    
    // Clear any world_id references in projects with optimized retry mechanism
    const updateProjects = async (attempt = 1): Promise<void> => {
      try {
        console.log(`Updating project references to world (attempt ${attempt}):`, worldId);
        const { error: projectError } = await customSupabase
          .from('projects')
          .update({ world_id: null })
          .eq('world_id', worldId)
          .select('id');
          
        if (projectError) {
          if (attempt < 2) { // Reduced retry attempts to 2
            console.log(`Project update attempt ${attempt} failed, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 300 * attempt)); // Reduced delay
            return updateProjects(attempt + 1);
          }
          throw new Error(`Failed to update project references: ${projectError.message}`);
        }
        
        console.log('Successfully updated project references');
      } catch (error) {
        if (attempt < 2) { // Reduced retry attempts to 2
          console.log(`Project update attempt ${attempt} failed with exception, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 300 * attempt)); // Reduced delay
          return updateProjects(attempt + 1);
        }
        throw error;
      }
    };
    
    // Delete categories with optimized retry mechanism
    const deleteCategories = async (attempt = 1): Promise<void> => {
      try {
        console.log(`Deleting categories for world (attempt ${attempt}):`, worldId);
        const { data: deletedCategories, error: catError } = await customSupabase
          .from('world_categories')
          .delete()
          .eq('world_id', worldId)
          .select('id');
          
        if (catError) {
          if (attempt < 2) { // Reduced retry attempts to 2
            console.log(`Category deletion attempt ${attempt} failed, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 300 * attempt)); // Reduced delay
            return deleteCategories(attempt + 1);
          }
          throw new Error(`Failed to delete world categories: ${catError.message}`);
        }
        
        console.log('Categories deleted:', deletedCategories?.length || 0);
      } catch (error) {
        if (attempt < 2) { // Reduced retry attempts to 2
          console.log(`Category deletion attempt ${attempt} failed with exception, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 300 * attempt)); // Reduced delay
          return deleteCategories(attempt + 1);
        }
        throw error;
      }
    };
    
    // Run these operations sequentially
    await updateProjects();
    await deleteCategories();
    
    console.log('Now deleting world itself');
    
    // Now delete the world itself with an optimized retry mechanism
    const executeWorldDeletion = async (attempt = 1): Promise<any> => {
      try {
        const { data, error } = await customSupabase
          .from('worlds')
          .delete()
          .eq('id', worldId)
          .select();
          
        if (error) {
          if (attempt < 3) { // Reduced max attempts for world deletion
            console.log(`World delete attempt ${attempt} failed, retrying in ${attempt * 300}ms...`);
            await new Promise(resolve => setTimeout(resolve, attempt * 300)); // Reduced delay
            return executeWorldDeletion(attempt + 1);
          }
          throw error;
        }
        
        return { data, error: null };
      } catch (error) {
        if (attempt < 3) { // Reduced max attempts
          console.log(`World delete attempt ${attempt} failed with exception, retrying...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 300)); // Reduced delay
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
    await new Promise(resolve => setTimeout(resolve, 300)); // Reduced delay
    
  } catch (error) {
    console.error('Error in delete world process:', error);
    throw error;
  } finally {
    // Always cancel the timeout to prevent memory leaks
    cancelTimeout();
    console.log('Timeout canceled, cleanup complete. Operation successful:', operationCompleted);
  }
};
