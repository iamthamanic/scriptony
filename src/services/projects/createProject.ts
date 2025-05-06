
import { customSupabase } from "@/integrations/supabase/customClient";
import { Project, NewProjectFormData } from "@/types";
import { handleApiError, convertDbProjectToApp } from "../utils";
import { isDevelopmentMode, getDevModeUser } from "@/utils/devMode";

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
    
    // Get the current user, using development mode if enabled
    let user;
    if (isDevelopmentMode()) {
      console.log("Using development mode user for project creation");
      user = getDevModeUser();
      
      // In development mode, use supabase.rpc() to bypass RLS
      // This allows us to insert projects as the development user
      const { data, error } = await customSupabase
        .rpc('create_project_dev_mode', {
          p_title: projectData.title,
          p_type: projectData.type,
          p_video_format: projectData.videoFormat,
          p_logline: projectData.logline,
          p_genres: projectData.genres,
          p_duration: projectData.duration.toString(),
          p_inspirations: projectData.inspirations.join(','),
          p_cover_image_url: coverImageUrl,
          p_narrative_structure: projectData.narrativeStructure || 'none',
          p_user_id: user.id,
          p_world_id: projectData.world_id
        });
        
      if (error) throw error;
      
      // Fetch the created project
      const { data: projectData, error: projectError } = await customSupabase
        .from('projects')
        .select('*')
        .eq('id', data)
        .single();
        
      if (projectError) throw projectError;
      
      return convertDbProjectToApp(projectData);
    } else {
      // In production mode, use standard flow with authenticated user
      const { data, error } = await customSupabase.auth.getUser();
      if (error || !data.user) throw new Error("User not authenticated");
      user = data.user;
      
      // Insert project into database with new fields
      const { data: insertData, error: insertError } = await customSupabase
        .from('projects')
        .insert({
          title: projectData.title,
          type: projectData.type,
          video_format: projectData.videoFormat,
          logline: projectData.logline,
          genres: projectData.genres,
          duration: projectData.duration.toString(),
          inspirations: projectData.inspirations.join(','),
          cover_image_url: coverImageUrl,
          narrative_structure: projectData.narrativeStructure || 'none',
          user_id: user.id,
          world_id: projectData.world_id
        })
        .select()
        .single();
        
      if (insertError) throw insertError;
      
      return convertDbProjectToApp(insertData);
    }
    
  } catch (error) {
    handleApiError(error, { 
      defaultMessage: "Failed to create project",
      showToast: true
    });
    return null;
  }
};
