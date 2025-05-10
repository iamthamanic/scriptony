import { supabase } from "@/integrations/supabase/client";
import { Scene, NewSceneFormData, TimeOfDay, EmotionalSignificance } from "../types";
import { handleApiError, convertDbSceneToApp } from "./utils";

export const createScene = async (sceneData: any): Promise<Scene | null> => {
  try {
    // If there's a keyframe image, upload it first if it's a File object
    let keyframeUrl = sceneData.keyframeImage;
    
    // The keyframeImage should already be a URL string at this point from the useScenes hook
    // We don't need to upload it again here
    
    // Determine if this is an update or create
    const isUpdate = !!sceneData.id;
    
    if (isUpdate) {
      // Update existing scene
      const { data, error } = await supabase
        .from('scenes')
        .update({
          episode_id: sceneData.episodeId,
          episode_title: sceneData.episodeTitle,
          scene_number: sceneData.sceneNumber,
          location: sceneData.location,
          time_of_day: sceneData.timeOfDay,
          timecode_start: sceneData.timecodeStart,
          timecode_end: sceneData.timecodeEnd,
          visual_composition: sceneData.visualComposition,
          lighting: sceneData.lighting,
          color_grading: sceneData.colorGrading,
          sound_design: sceneData.soundDesign,
          special_effects: sceneData.specialEffects,
          keyframe_image_url: keyframeUrl || undefined,
          description: sceneData.description,
          dialog: sceneData.dialog,
          transitions: sceneData.transitions,
          production_notes: sceneData.productionNotes,
          emotional_significance: sceneData.emotionalSignificance,
          emotional_notes: sceneData.emotionalNotes,
          character_ids: sceneData.characterIds || [],
          updated_at: new Date().toISOString()
        })
        .eq('id', sceneData.id)
        .select()
        .single();
        
      if (error) throw error;
      
      return convertDbSceneToApp(data);
      
    } else {
      // Create new scene
      const { data, error } = await supabase
        .from('scenes')
        .insert({
          project_id: sceneData.projectId,
          episode_id: sceneData.episodeId,
          episode_title: sceneData.episodeTitle,
          scene_number: sceneData.sceneNumber,
          location: sceneData.location,
          time_of_day: sceneData.timeOfDay,
          timecode_start: sceneData.timecodeStart,
          timecode_end: sceneData.timecodeEnd,
          visual_composition: sceneData.visualComposition,
          lighting: sceneData.lighting,
          color_grading: sceneData.colorGrading,
          sound_design: sceneData.soundDesign,
          special_effects: sceneData.specialEffects,
          keyframe_image_url: keyframeUrl,
          description: sceneData.description,
          dialog: sceneData.dialog,
          transitions: sceneData.transitions,
          production_notes: sceneData.productionNotes,
          emotional_significance: sceneData.emotionalSignificance,
          emotional_notes: sceneData.emotionalNotes,
          character_ids: sceneData.characterIds || []
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return convertDbSceneToApp(data);
    }
    
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteScene = async (sceneId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('scenes')
      .delete()
      .eq('id', sceneId);
      
    if (error) throw error;
    
    return true;
    
  } catch (error) {
    return handleApiError(error) ?? false;
  }
};
