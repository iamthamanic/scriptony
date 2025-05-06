
import { customSupabase } from "@/integrations/supabase/customClient";
import { Project } from "@/types";
import { handleApiError } from "../utils";

// Helper function to normalize inspirations to ensure they're always in array format
export const normalizeInspirations = (inspirations: string[] | string | undefined): string[] => {
  if (!inspirations) return [];
  
  if (Array.isArray(inspirations)) {
    return inspirations;
  }
  
  return inspirations.split(',').filter(Boolean);
};

export const updateProject = async (projectId: string, projectData: Partial<Project>): Promise<boolean> => {
  try {
    // If there's a new cover image (File object), upload it first
    let coverImageUrl = undefined;
    
    if (projectData.coverImage && typeof projectData.coverImage !== 'string') {
      const file = projectData.coverImage as File;
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await customSupabase.storage
        .from('project_assets')
        .upload(`project-covers/${fileName}`, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = customSupabase.storage
        .from('project_assets')
        .getPublicUrl(`project-covers/${fileName}`);
        
      coverImageUrl = urlData.publicUrl;
    } else if (typeof projectData.coverImage === 'string') {
      // If it's a URL string, use it directly
      coverImageUrl = projectData.coverImage;
    }

    // Ensure inspirations is properly formatted - convert to string for DB storage
    let inspirationsForDB = '';
    if (Array.isArray(projectData.inspirations) && projectData.inspirations.length > 0) {
      inspirationsForDB = projectData.inspirations.join(',');
    } else if (typeof projectData.inspirations === 'string') {
      inspirationsForDB = projectData.inspirations;
    }
    
    // Update project in database with new fields
    const { error } = await customSupabase
      .from('projects')
      .update({
        title: projectData.title,
        type: projectData.type,
        video_format: projectData.videoFormat,
        logline: projectData.logline,
        genres: projectData.genres,
        duration: projectData.duration?.toString(),
        inspirations: inspirationsForDB,
        cover_image_url: coverImageUrl,
        narrative_structure: projectData.narrativeStructure,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId);
      
    if (error) throw error;
    
    return true;
    
  } catch (error) {
    handleApiError(error);
    return false;
  }
};
