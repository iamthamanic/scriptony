
import { customSupabase } from "@/integrations/supabase/customClient";
import { createTimeout } from "./utils";
import { isDevelopmentMode } from "@/utils/devMode";

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
  
  // Set a timeout to prevent indefinite hanging (30 seconds)
  const timeoutPromise = createTimeout(30000);

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
    
    // Now delete the world itself
    const deletePromise = customSupabase
      .from('worlds')
      .delete()
      .eq('id', worldId)
      .select();
    
    // Race against the timeout
    const { data: deletedWorld, error } = await Promise.race([deletePromise, timeoutPromise]);
      
    if (error) {
      console.error('Error deleting world:', error);
      throw new Error(`Failed to delete world: ${error.message}`);
    }
    
    console.log('World deleted successfully:', deletedWorld);
  } catch (error) {
    console.error('Error in delete world process:', error);
    throw error;
  }
};
