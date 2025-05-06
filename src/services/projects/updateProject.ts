
import { customSupabase } from "@/integrations/supabase/customClient";
import { Project } from "@/types";
import { handleApiError, normalizeInspirations } from "../utils";

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

    // Ensure inspirations is properly formatted
    const inspirations = Array.isArray(projectData.inspirations) 
      ? projectData.inspirations.join(',')
      : (projectData.inspirations || '');
    
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
        inspirations: inspirations,
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
