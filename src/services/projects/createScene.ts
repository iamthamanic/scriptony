
import { customSupabase } from "@/integrations/supabase/customClient";
import { Scene } from "@/types";
import { handleApiError } from "../utils";

export const createSceneService = async (sceneData: Partial<Scene>): Promise<Scene> => {
  try {
    console.log("Creating scene with data:", sceneData);
    
    // Convert character_ids to proper format if needed
    const dataToInsert = {
      ...sceneData,
      character_ids: Array.isArray(sceneData.character_ids) 
        ? sceneData.character_ids 
        : sceneData.character_ids 
          ? [sceneData.character_ids]
          : []
    };
    
    const { data, error } = await customSupabase
      .from('scenes')
      .insert(dataToInsert)
      .select('*')
      .single();
      
    if (error) {
      console.error("Error creating scene:", error);
      throw error;
    }
    
    console.log("Scene created successfully:", data);
    return data as Scene;
    
  } catch (error) {
    console.error("Failed to create scene:", error);
    return handleApiError(error);
  }
};
