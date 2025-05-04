import { supabase } from "@/integrations/supabase/client";
import { Project, NewProjectFormData, ProjectType, Genre, VideoFormat } from "../types";
import { handleApiError, convertDbProjectToApp } from "./utils";

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
      videoFormat: dbProject.video_format as VideoFormat | undefined,
      logline: dbProject.logline || '',
      genres: (dbProject.genres || []) as Genre[],
      duration: parseInt(dbProject.duration),
      inspirations: dbProject.inspirations ? JSON.parse(dbProject.inspirations) : [],
      coverImage: dbProject.cover_image_url || null,
      scenes: [],  // We'll fetch scenes separately
      characters: [],  // We'll fetch characters separately
      episodes: [],  // We'll fetch episodes separately
      narrativeStructure: dbProject.narrative_structure,
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
  characters: any[],
  episodes: any[],
  scenes: any[]
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
    
    return convertDbProjectToApp(data);
    
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
