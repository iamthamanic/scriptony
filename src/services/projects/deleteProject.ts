
import { customSupabase } from "@/integrations/supabase/customClient";
import { handleApiError } from "../utils";

export const deleteProject = async (projectId: string): Promise<boolean> => {
  try {
    const { error } = await customSupabase
      .from('projects')
      .delete()
      .eq('id', projectId);
      
    if (error) throw error;
    
    return true;
    
  } catch (error) {
    return handleApiError(error) ?? false;
  }
};
