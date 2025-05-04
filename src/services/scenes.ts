
import { supabase } from "@/integrations/supabase/client";
import { Scene, NewSceneFormData } from "../types";
import { handleApiError } from "./utils";

export const createScene = async (projectId: string, sceneData: NewSceneFormData, editingScene: Scene | null): Promise<Scene | null> => {
  try {
    // If there's a keyframe image, upload it first
    let keyframeUrl = undefined;
    
    if (sceneData.keyframeImage) {
      const fileName = `${Date.now()}_${sceneData.keyframeImage.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project_assets')
        .upload(`scene-keyframes/${fileName}`, sceneData.keyframeImage);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('project_assets')
        .getPublicUrl(`scene-keyframes/${fileName}`);
        
      keyframeUrl = urlData.publicUrl;
    }
    
    if (editingScene) {
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
          keyframe_image_url: keyframeUrl || editingScene.keyframeImage,
          description: sceneData.description,
          dialog: sceneData.dialog,
          transitions: sceneData.transitions,
          production_notes: sceneData.productionNotes,
          emotional_significance: sceneData.emotionalSignificance,
          emotional_notes: sceneData.emotionalNotes,
          character_ids: sceneData.characterIds || [],
          updated_at: new Date().toISOString()
        })
        .eq('id', editingScene.id)
        .select()
        .single();
        
      if (error) throw error;
      
      // Convert to our application type
      return {
        id: data.id,
        projectId: data.project_id,
        episodeId: data.episode_id || undefined,
        episodeTitle: data.episode_title || undefined,
        sceneNumber: data.scene_number,
        location: data.location,
        timeOfDay: data.time_of_day,
        timecodeStart: data.timecode_start,
        timecodeEnd: data.timecode_end,
        visualComposition: data.visual_composition || '',
        lighting: data.lighting || '',
        colorGrading: data.color_grading || '',
        soundDesign: data.sound_design || '',
        specialEffects: data.special_effects || '',
        keyframeImage: data.keyframe_image_url,
        description: data.description,
        dialog: data.dialog || '',
        transitions: data.transitions || '',
        productionNotes: data.production_notes || '',
        emotionalSignificance: data.emotional_significance || 'other',
        emotionalNotes: data.emotional_notes || '',
        characterIds: data.character_ids || [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
      
    } else {
      // Create new scene
      const { data, error } = await supabase
        .from('scenes')
        .insert({
          project_id: projectId,
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
      
      // Convert to our application type
      return {
        id: data.id,
        projectId: data.project_id,
        episodeId: data.episode_id || undefined,
        episodeTitle: data.episode_title || undefined,
        sceneNumber: data.scene_number,
        location: data.location,
        timeOfDay: data.time_of_day,
        timecodeStart: data.timecode_start,
        timecodeEnd: data.timecode_end,
        visualComposition: data.visual_composition || '',
        lighting: data.lighting || '',
        colorGrading: data.color_grading || '',
        soundDesign: data.sound_design || '',
        specialEffects: data.special_effects || '',
        keyframeImage: data.keyframe_image_url,
        description: data.description,
        dialog: data.dialog || '',
        transitions: data.transitions || '',
        productionNotes: data.production_notes || '',
        emotionalSignificance: data.emotional_significance || 'other',
        emotionalNotes: data.emotional_notes || '',
        characterIds: data.character_ids || [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    }
    
  } catch (error) {
    handleApiError(error, { 
      defaultMessage: "Failed to save scene",
      showToast: true
    });
    return null;
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
    handleApiError(error, { 
      defaultMessage: "Failed to delete scene",
      showToast: true
    });
    return false;
  }
};
