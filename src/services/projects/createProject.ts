
import { customSupabase } from "@/integrations/supabase/customClient";
import { Project, NewProjectFormData } from "@/types";
import { handleApiError, convertDbProjectToApp } from "../utils";

export const createProject = async (projectData: NewProjectFormData): Promise<Project | null> => {
  try {
    // If there's a cover image, upload it first
    let coverImageUrl = undefined;
    
    if (projectData.coverImage) {
      const fileName = `${Date.now()}_${projectData.coverImage.name}`;
      const { data: uploadData, error: uploadError } = await customSupabase.storage
        .from('project_assets')
        .upload(`project-covers/${fileName}`, projectData.coverImage);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = customSupabase.storage
        .from('project_assets')
        .getPublicUrl(`project-covers/${fileName}`);
        
      coverImageUrl = urlData.publicUrl;
    }
    
    // Get the current user
    const { data: { user } } = await customSupabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    // Insert project into database with new fields
    const { data, error } = await customSupabase
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
