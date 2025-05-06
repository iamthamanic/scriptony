
import { customSupabase } from "@/integrations/supabase/customClient";
import { handleApiError } from "../utils";

export const fetchProjectDetails = async (projectId: string): Promise<{
  characters: any[],
  episodes: any[],
  scenes: any[]
}> => {
  try {
    // Fetch characters
    const { data: charactersData, error: charactersError } = await customSupabase
      .from('characters')
      .select('*')
      .eq('project_id', projectId);
      
    if (charactersError) throw charactersError;
    
    // Fetch episodes
    const { data: episodesData, error: episodesError } = await customSupabase
      .from('episodes')
      .select('*')
      .eq('project_id', projectId)
      .order('number', { ascending: true });
      
    if (episodesError) throw episodesError;
    
    // Fetch scenes
    const { data: scenesData, error: scenesError } = await customSupabase
      .from('scenes')
      .select('*')
      .eq('project_id', projectId)
      .order('scene_number', { ascending: true });
      
    if (scenesError) throw scenesError;
    
    // Convert database objects to application types
    const characters = charactersData.map(dbChar => ({
      id: dbChar.id,
      name: dbChar.name,
      role: dbChar.role || '',
      description: dbChar.description || '',
      projectId: dbChar.project_id,
      avatar: dbChar.image_url,
      createdAt: new Date(dbChar.created_at),
      updatedAt: new Date(dbChar.updated_at)
    }));
    
    const episodes = episodesData.map(dbEp => ({
      id: dbEp.id,
      projectId: dbEp.project_id,
      title: dbEp.title,
      number: dbEp.number,
      description: dbEp.description || '',
      coverImage: dbEp.image_url,
      createdAt: new Date(dbEp.created_at),
      updatedAt: new Date(dbEp.updated_at)
    }));
    
    const scenes = scenesData.map(dbScene => ({
      id: dbScene.id,
      projectId: dbScene.project_id,
      episodeId: dbScene.episode_id || undefined,
      episodeTitle: dbScene.episode_title || undefined,
      sceneNumber: dbScene.scene_number,
      location: dbScene.location,
      timeOfDay: dbScene.time_of_day,
      timecodeStart: dbScene.timecode_start,
      timecodeEnd: dbScene.timecode_end,
      visualComposition: dbScene.visual_composition || '',
      lighting: dbScene.lighting || '',
      colorGrading: dbScene.color_grading || '',
      soundDesign: dbScene.sound_design || '',
      specialEffects: dbScene.special_effects || '',
      keyframeImage: dbScene.keyframe_image_url,
      description: dbScene.description,
      dialog: dbScene.dialog || '',
      transitions: dbScene.transitions || '',
      productionNotes: dbScene.production_notes || '',
      emotionalSignificance: dbScene.emotional_significance || 'other',
      emotionalNotes: dbScene.emotional_notes || '',
      characterIds: dbScene.character_ids || [],
      createdAt: new Date(dbScene.created_at),
      updatedAt: new Date(dbScene.updated_at)
    }));
    
    return { characters, episodes, scenes };
    
  } catch (error) {
    handleApiError(error);
    return { characters: [], episodes: [], scenes: [] };
  }
};
