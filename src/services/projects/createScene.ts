
import { customSupabase } from "@/integrations/supabase/customClient";
import { NewSceneFormData, Scene, TimeOfDay } from "@/types";
import { handleApiError, convertDbSceneToApp } from "../utils";
import { isDevelopmentMode, getDevModeUser } from "@/utils/devMode";

export const createScene = async (sceneData: NewSceneFormData): Promise<Scene | null> => {
  try {
    // Upload keyframe image if provided
    let keyframeImageUrl = undefined;
    
    if (sceneData.keyframeImage) {
      const fileName = `${Date.now()}_${sceneData.keyframeImage.name}`;
      const { data: uploadData, error: uploadError } = await customSupabase.storage
        .from('project_assets')
        .upload(`scene-keyframes/${fileName}`, sceneData.keyframeImage);
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = customSupabase.storage
        .from('project_assets')
        .getPublicUrl(`scene-keyframes/${fileName}`);
        
      keyframeImageUrl = urlData.publicUrl;
    }
    
    // Get the current user, using development mode if enabled
    let user;
    if (isDevelopmentMode()) {
      user = getDevModeUser();
      
      // Insert scene with project_id
      const { data: insertData, error: insertError } = await customSupabase
        .from('scenes')
        .insert({
          project_id: sceneData.projectId,
          episode_id: sceneData.episodeId || null,
          episode_title: sceneData.episodeTitle || null,
          scene_number: sceneData.sceneNumber,
          location: sceneData.location,
          time_of_day: sceneData.timeOfDay,
          timecode_start: sceneData.timecodeStart,
          timecode_end: sceneData.timecodeEnd,
          visual_composition: sceneData.visualComposition || "",
          lighting: sceneData.lighting || "",
          color_grading: sceneData.colorGrading || "",
          sound_design: sceneData.soundDesign || "",
          special_effects: sceneData.specialEffects || "",
          keyframe_image_url: keyframeImageUrl,
          description: sceneData.description,
          dialog: sceneData.dialog || "",
          transitions: sceneData.transitions || "",
          production_notes: sceneData.productionNotes || "",
          emotional_significance: sceneData.emotionalSignificance,
          emotional_notes: sceneData.emotionalNotes || "",
          character_ids: sceneData.characterIds || []
        })
        .select()
        .single();
        
      if (insertError) throw insertError;
      
      return convertDbSceneToApp(insertData);
      
    } else {
      // In production mode, use standard flow with authenticated user
      const { data, error } = await customSupabase.auth.getUser();
      if (error || !data.user) throw new Error("User not authenticated");
      user = data.user;
      
      // Insert scene with project_id
      const { data: insertData, error: insertError } = await customSupabase
        .from('scenes')
        .insert({
          project_id: sceneData.projectId,
          episode_id: sceneData.episodeId || null,
          episode_title: sceneData.episodeTitle || null,
          scene_number: sceneData.sceneNumber,
          location: sceneData.location,
          time_of_day: sceneData.timeOfDay,
          timecode_start: sceneData.timecodeStart,
          timecode_end: sceneData.timecodeEnd,
          visual_composition: sceneData.visualComposition || "",
          lighting: sceneData.lighting || "",
          color_grading: sceneData.colorGrading || "",
          sound_design: sceneData.soundDesign || "",
          special_effects: sceneData.specialEffects || "",
          keyframe_image_url: keyframeImageUrl,
          description: sceneData.description,
          dialog: sceneData.dialog || "",
          transitions: sceneData.transitions || "",
          production_notes: sceneData.productionNotes || "",
          emotional_significance: sceneData.emotionalSignificance,
          emotional_notes: sceneData.emotionalNotes || "",
          character_ids: sceneData.characterIds || []
        })
        .select()
        .single();
        
      if (insertError) throw insertError;
      
      return convertDbSceneToApp(insertData);
    }
    
  } catch (error) {
    handleApiError(error, { 
      defaultMessage: "Failed to create scene",
      showToast: true
    });
    return null;
  }
};
