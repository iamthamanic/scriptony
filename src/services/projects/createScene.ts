
import { v4 as uuidv4 } from "uuid";
import { customSupabase } from "@/integrations/supabase/customClient";
import { NewSceneFormData, Scene } from "@/types";
import { handleApiError, convertDbSceneToApp } from "../utils";
import { isDevelopmentMode, getDevModeUser } from "@/utils/devMode";

export const createScene = async (data: NewSceneFormData): Promise<Scene | null> => {
  try {
    const user = isDevelopmentMode() ? getDevModeUser() : (await customSupabase.auth.getUser()).data.user;
    if (!user) {
      throw new Error("User not authenticated");
    }

    let keyframeImageUrl: string | undefined;
    
    // Handle keyframe image upload if provided
    if (data.keyframeImage) {
      const file = data.keyframeImage;
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${user.id}/scenes/${fileName}`;
      
      const { error: uploadError } = await customSupabase
        .storage
        .from('scene_images')
        .upload(filePath, file);
        
      if (uploadError) {
        console.error('Error uploading keyframe image:', uploadError);
      } else {
        const { data: publicUrl } = customSupabase
          .storage
          .from('scene_images')
          .getPublicUrl(filePath);
          
        keyframeImageUrl = publicUrl.publicUrl;
      }
    }

    // Format scene data for database
    const sceneData = {
      id: data.id || uuidv4(),
      project_id: data.projectId,
      episode_id: data.episodeId,
      episode_title: data.episodeTitle,
      scene_number: data.sceneNumber,
      location: data.location,
      time_of_day: data.timeOfDay,
      timecode_start: data.timecodeStart,
      timecode_end: data.timecodeEnd,
      visual_composition: data.visualComposition,
      lighting: data.lighting,
      color_grading: data.colorGrading,
      sound_design: data.soundDesign,
      special_effects: data.specialEffects,
      keyframe_image: keyframeImageUrl || undefined,
      description: data.description,
      dialog: data.dialog,
      character_dialogs: data.characterDialogs || [],
      transitions: data.transitions,
      production_notes: data.productionNotes,
      emotional_significance: data.emotionalSignificance,
      emotional_notes: data.emotionalNotes,
      character_ids: data.characterIds || [],
      color_references: data.colorReferences || [],
      audio_references: data.audioReferences || [],
      visual_references: data.visualReferences || [],
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert or update scene in database
    const { data: dbScene, error } = await customSupabase
      .from('scenes')
      .upsert(sceneData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Convert database scene to app model
    return convertDbSceneToApp(dbScene);
  } catch (error) {
    return handleApiError(error);
  }
};
