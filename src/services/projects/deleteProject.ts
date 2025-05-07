
import { customSupabase } from "@/integrations/supabase/customClient";
import { handleApiError } from "../utils";

export const deleteProject = async (projectId: string): Promise<boolean> => {
  try {
    console.log("Service: Deleting project with ID:", projectId);
    
    // First delete dependent data if needed (optional - RLS cascading might handle this)
    // Uncommenting these could help if you have orphaned data issues:
    /*
    await customSupabase.from('scenes').delete().eq('project_id', projectId);
    await customSupabase.from('characters').delete().eq('project_id', projectId);
    await customSupabase.from('episodes').delete().eq('project_id', projectId);
    */
    
    // Then delete the project itself
    const { error } = await customSupabase
      .from('projects')
      .delete()
      .eq('id', projectId);
      
    if (error) {
      console.error("Service: Error deleting project:", error);
      throw error;
    }
    
    console.log("Service: Project deleted successfully");
    return true;
    
  } catch (error) {
    console.error("Service: Exception in deleteProject:", error);
    return handleApiError(error) ?? false;
  }
};
