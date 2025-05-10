
import { customSupabase } from "@/integrations/supabase/customClient";
import { Scene } from "@/types";
import { handleApiError } from "../utils";

export const createScene = async (sceneData: Partial<Scene>): Promise<Scene> => {
  try {
    console.log("Creating scene with data:", sceneData);
    
    // Transform application model to database schema format
    const dataToInsert = {
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
      keyframe_image_url: sceneData.keyframeImage, // Already a string URL from previous upload step
      description: sceneData.description,
      dialog: sceneData.dialog,
      transitions: sceneData.transitions,
      production_notes: sceneData.productionNotes,
      emotional_significance: sceneData.emotionalSignificance,
      emotional_notes: sceneData.emotionalNotes,
      character_ids: sceneData.characterIds || []
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
    
    // Transform database response back to application model
    return {
      id: data.id,
      projectId: data.project_id,
      episodeId: data.episode_id,
      episodeTitle: data.episode_title,
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
    } as Scene;
    
  } catch (error) {
    console.error("Failed to create scene:", error);
    return handleApiError(error);
  }
};
