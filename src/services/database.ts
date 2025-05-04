
import { supabase } from "@/integrations/supabase/client";
import { Project, Character, Episode, Scene, NewProjectFormData, NewCharacterFormData, NewEpisodeFormData, NewSceneFormData, ProjectType, Genre, TimeOfDay, EmotionalSignificance, NarrativeStructureType } from "../types";
import { toast } from "@/hooks/use-toast";
import { handleApiError } from "@/utils/apiUtils";

// *** Project Services ***

export const fetchUserProjects = async (): Promise<Project[]> => {
  try {
    const { data: projectsData, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });
      
    if (error) throw error;
    
    // Convert the database projects to the application Project type
    return projectsData.map(dbProject => ({
      id: dbProject.id,
      title: dbProject.title,
      type: dbProject.type as ProjectType,
      logline: dbProject.logline || '',
      genres: (dbProject.genres || []) as Genre[],
      duration: Number(dbProject.duration) || 0,
      inspirations: dbProject.inspirations ? dbProject.inspirations.split(',') : [],
      coverImage: dbProject.cover_image_url,
      narrativeStructure: (dbProject.narrative_structure || 'none') as NarrativeStructureType,
      scenes: [],  // We'll fetch scenes separately
      characters: [],  // We'll fetch characters separately
      episodes: [],  // We'll fetch episodes separately
      createdAt: new Date(dbProject.created_at),
      updatedAt: new Date(dbProject.updated_at)
    }));
    
  } catch (error) {
    handleApiError(error, { 
      defaultMessage: "Failed to fetch projects",
      showToast: true
    });
    return [];
  }
};

export const fetchProjectDetails = async (projectId: string): Promise<{
  characters: Character[],
  episodes: Episode[],
  scenes: Scene[]
}> => {
  try {
    // Fetch characters
    const { data: charactersData, error: charactersError } = await supabase
      .from('characters')
      .select('*')
      .eq('project_id', projectId);
      
    if (charactersError) throw charactersError;
    
    // Fetch episodes
    const { data: episodesData, error: episodesError } = await supabase
      .from('episodes')
      .select('*')
      .eq('project_id', projectId)
      .order('number', { ascending: true });
      
    if (episodesError) throw episodesError;
    
    // Fetch scenes
    const { data: scenesData, error: scenesError } = await supabase
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
      timeOfDay: dbScene.time_of_day as TimeOfDay,
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
      emotionalSignificance: dbScene.emotional_significance as EmotionalSignificance || 'other',
      emotionalNotes: dbScene.emotional_notes || '',
      characterIds: dbScene.character_ids || [],
      createdAt: new Date(dbScene.created_at),
      updatedAt: new Date(dbScene.updated_at)
    }));
    
    return { characters, episodes, scenes };
    
  } catch (error) {
    handleApiError(error, { 
      defaultMessage: "Failed to fetch project details",
      showToast: true
    });
    return { characters: [], episodes: [], scenes: [] };
  }
};

export const createProject = async (projectData: NewProjectFormData): Promise<Project | null> => {
  try {
    // If there's a cover image, upload it first
    let coverImageUrl = undefined;
    
    if (projectData.coverImage) {
      const fileName = `${Date.now()}_${projectData.coverImage.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project_assets')
        .upload(`project-covers/${fileName}`, projectData.coverImage);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('project_assets')
        .getPublicUrl(`project-covers/${fileName}`);
        
      coverImageUrl = urlData.publicUrl;
    }
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    // Insert project into database with new fields
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: projectData.title,
        type: projectData.type,
        video_format: projectData.videoFormat, // New field
        logline: projectData.logline,
        genres: projectData.genres,
        duration: projectData.duration.toString(),
        inspirations: projectData.inspirations.join(','),
        cover_image_url: coverImageUrl,
        narrative_structure: projectData.narrativeStructure || 'none',
        user_id: user.id
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Convert to our application type
    return {
      id: data.id,
      title: data.title,
      type: data.type as ProjectType,
      videoFormat: data.video_format as VideoFormat,
      logline: data.logline || '',
      genres: (data.genres || []) as Genre[],
      duration: Number(data.duration) || 0,
      inspirations: data.inspirations ? data.inspirations.split(',') : [],
      coverImage: data.cover_image_url,
      narrativeStructure: data.narrative_structure as NarrativeStructureType || 'none',
      scenes: [],
      characters: [],
      episodes: [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
    
  } catch (error) {
    handleApiError(error, { 
      defaultMessage: "Failed to create project",
      showToast: true
    });
    return null;
  }
};

export const updateProject = async (projectId: string, projectData: Partial<Project>): Promise<boolean> => {
  try {
    // If there's a new cover image (File object), upload it first
    let coverImageUrl = undefined;
    
    if (projectData.coverImage && typeof projectData.coverImage !== 'string') {
      const file = projectData.coverImage as File;
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project_assets')
        .upload(`project-covers/${fileName}`, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('project_assets')
        .getPublicUrl(`project-covers/${fileName}`);
        
      coverImageUrl = urlData.publicUrl;
    } else if (typeof projectData.coverImage === 'string') {
      // If it's a URL string, use it directly
      coverImageUrl = projectData.coverImage;
    }
    
    // Update project in database with new fields
    const { error } = await supabase
      .from('projects')
      .update({
        title: projectData.title,
        type: projectData.type,
        video_format: projectData.videoFormat, // New field
        logline: projectData.logline,
        genres: projectData.genres,
        duration: projectData.duration?.toString(),
        inspirations: Array.isArray(projectData.inspirations) ? projectData.inspirations.join(',') : projectData.inspirations,
        cover_image_url: coverImageUrl,
        narrative_structure: projectData.narrativeStructure,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId);
      
    if (error) throw error;
    
    return true;
    
  } catch (error) {
    handleApiError(error, { 
      defaultMessage: "Failed to update project",
      showToast: true
    });
    return false;
  }
};

export const deleteProject = async (projectId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
      
    if (error) throw error;
    
    return true;
    
  } catch (error) {
    handleApiError(error, { 
      defaultMessage: "Failed to delete project",
      showToast: true
    });
    return false;
  }
};

// *** Character Services ***

export const createCharacter = async (projectId: string, characterData: NewCharacterFormData): Promise<Character | null> => {
  try {
    // If there's an avatar, upload it first
    let avatarUrl = undefined;
    
    if (characterData.avatar) {
      const file = characterData.avatar as File;
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project_assets')
        .upload(`character-avatars/${fileName}`, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('project_assets')
        .getPublicUrl(`character-avatars/${fileName}`);
        
      avatarUrl = urlData.publicUrl;
    }
    
    // Insert character into database
    const { data, error } = await supabase
      .from('characters')
      .insert({
        project_id: projectId,
        name: characterData.name,
        role: characterData.role,
        description: characterData.description,
        image_url: avatarUrl
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Convert to our application type
    return {
      id: data.id,
      projectId: data.project_id,
      name: data.name,
      role: data.role || '',
      description: data.description || '',
      avatar: data.image_url,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
    
  } catch (error) {
    handleApiError(error, { 
      defaultMessage: "Failed to create character",
      showToast: true
    });
    return null;
  }
};

export const updateCharacter = async (characterId: string, characterData: Partial<Character>): Promise<boolean> => {
  try {
    // If there's a new avatar (File object), upload it first
    let avatarUrl = undefined;
    
    if (characterData.avatar && typeof characterData.avatar !== 'string') {
      const file = characterData.avatar as File;
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project_assets')
        .upload(`character-avatars/${fileName}`, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('project_assets')
        .getPublicUrl(`character-avatars/${fileName}`);
        
      avatarUrl = urlData.publicUrl;
    } else if (typeof characterData.avatar === 'string') {
      // If it's a URL string, use it directly
      avatarUrl = characterData.avatar;
    }
    
    // Update character in database
    const { error } = await supabase
      .from('characters')
      .update({
        name: characterData.name,
        role: characterData.role,
        description: characterData.description,
        image_url: avatarUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', characterId);
      
    if (error) throw error;
    
    return true;
    
  } catch (error) {
    handleApiError(error, { 
      defaultMessage: "Failed to update character",
      showToast: true
    });
    return false;
  }
};

export const deleteCharacter = async (characterId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', characterId);
      
    if (error) throw error;
    
    return true;
    
  } catch (error) {
    handleApiError(error, { 
      defaultMessage: "Failed to delete character",
      showToast: true
    });
    return false;
  }
};

// *** Episode Services ***

export const createEpisode = async (projectId: string, episodeData: NewEpisodeFormData): Promise<Episode | null> => {
  try {
    // If there's a cover image, upload it first
    let coverImageUrl = undefined;
    
    if (episodeData.coverImage) {
      const file = episodeData.coverImage as File;
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project_assets')
        .upload(`episode-covers/${fileName}`, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('project_assets')
        .getPublicUrl(`episode-covers/${fileName}`);
        
      coverImageUrl = urlData.publicUrl;
    }
    
    // Insert episode into database
    const { data, error } = await supabase
      .from('episodes')
      .insert({
        project_id: projectId,
        title: episodeData.title,
        number: episodeData.number,
        description: episodeData.description,
        image_url: coverImageUrl
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Convert to our application type
    return {
      id: data.id,
      projectId: data.project_id,
      title: data.title,
      number: data.number,
      description: data.description || '',
      coverImage: data.image_url,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
    
  } catch (error) {
    handleApiError(error, { 
      defaultMessage: "Failed to create episode",
      showToast: true
    });
    return null;
  }
};

export const updateEpisode = async (episodeId: string, episodeData: Partial<Episode>): Promise<boolean> => {
  try {
    // If there's a new cover image (File object), upload it first
    let coverImageUrl = undefined;
    
    if (episodeData.coverImage && typeof episodeData.coverImage !== 'string') {
      const file = episodeData.coverImage as File;
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project_assets')
        .upload(`episode-covers/${fileName}`, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('project_assets')
        .getPublicUrl(`episode-covers/${fileName}`);
        
      coverImageUrl = urlData.publicUrl;
    } else if (typeof episodeData.coverImage === 'string') {
      // If it's a URL string, use it directly
      coverImageUrl = episodeData.coverImage;
    }
    
    // Update episode in database
    const { error } = await supabase
      .from('episodes')
      .update({
        title: episodeData.title,
        number: episodeData.number,
        description: episodeData.description,
        image_url: coverImageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', episodeId);
      
    if (error) throw error;
    
    return true;
    
  } catch (error) {
    handleApiError(error, { 
      defaultMessage: "Failed to update episode",
      showToast: true
    });
    return false;
  }
};

export const deleteEpisode = async (episodeId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('episodes')
      .delete()
      .eq('id', episodeId);
      
    if (error) throw error;
    
    return true;
    
  } catch (error) {
    handleApiError(error, { 
      defaultMessage: "Failed to delete episode",
      showToast: true
    });
    return false;
  }
};

// *** Scene Services ***

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
        timeOfDay: data.time_of_day as TimeOfDay,
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
        emotionalSignificance: data.emotional_significance as EmotionalSignificance || 'other',
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
        timeOfDay: data.time_of_day as TimeOfDay,
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
        emotionalSignificance: data.emotional_significance as EmotionalSignificance || 'other',
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
