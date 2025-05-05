
import { customSupabase } from "@/integrations/supabase/customClient";
import { Project, ProjectType, Genre, VideoFormat, NarrativeStructureType } from "@/types";
import { handleApiError } from "../utils";

export const fetchUserProjects = async (): Promise<Project[]> => {
  try {
    const { data: projectsData, error } = await customSupabase
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
      narrativeStructure: dbProject.narrative_structure as NarrativeStructureType,
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
