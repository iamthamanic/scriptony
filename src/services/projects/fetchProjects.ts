
import { customSupabase } from "@/integrations/supabase/customClient";
import { Project, ProjectType, Genre, VideoFormat, NarrativeStructureType } from "@/types";
import { handleApiError } from "../utils";

export const fetchUserProjects = async (): Promise<Project[]> => {
  try {
    console.log("Fetching projects from Supabase");
    const { data: projectsData, error } = await customSupabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
    
    console.log("Projects fetched successfully:", projectsData?.length || 0);
    
    // Convert the database projects to the application Project type
    return projectsData.map(dbProject => ({
      id: dbProject.id,
      title: dbProject.title,
      type: dbProject.type as ProjectType,
      videoFormat: dbProject.video_format as VideoFormat | undefined,
      logline: dbProject.logline || '',
      genres: (dbProject.genres || []) as Genre[],
      duration: parseInt(dbProject.duration || '0'),
      inspirations: dbProject.inspirations ? dbProject.inspirations.split(',').filter(Boolean) : [],
      coverImage: dbProject.cover_image_url || null,
      scenes: [],  // We'll fetch scenes separately
      characters: [],  // We'll fetch characters separately
      episodes: [],  // We'll fetch episodes separately
      narrativeStructure: dbProject.narrative_structure as NarrativeStructureType,
      createdAt: new Date(dbProject.created_at),
      updatedAt: new Date(dbProject.updated_at)
    }));
    
  } catch (error) {
    console.error("Error in fetchUserProjects:", error);
    return handleApiError(error) ?? [];
  }
};
