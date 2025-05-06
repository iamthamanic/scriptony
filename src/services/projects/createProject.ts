
import { v4 as uuidv4 } from "uuid";
import { customSupabase } from "@/integrations/supabase/customClient";
import { NewProjectFormData, Project } from "@/types";
import { handleApiError, convertDbProjectToApp } from "../utils";
import { isDevelopmentMode, getDevModeUser } from "@/utils/devMode";

export const createProject = async (data: NewProjectFormData): Promise<Project | null> => {
  try {
    const user = isDevelopmentMode() ? getDevModeUser() : (await customSupabase.auth.getUser()).data.user;
    if (!user) {
      throw new Error("User not authenticated");
    }

    let coverImageUrl: string | undefined;
    
    // Handle cover image upload if provided
    if (data.coverImage) {
      const file = data.coverImage;
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${user.id}/projects/${fileName}`;
      
      const { error: uploadError } = await customSupabase
        .storage
        .from('project_assets')
        .upload(filePath, file);
        
      if (uploadError) {
        console.error('Error uploading cover image:', uploadError);
      } else {
        const { data: publicUrl } = customSupabase
          .storage
          .from('project_assets')
          .getPublicUrl(filePath);
          
        coverImageUrl = publicUrl.publicUrl;
      }
    }

    // Format inspirations for database
    const inspirationsStr = Array.isArray(data.inspirations) 
      ? data.inspirations.join(',')
      : (data.inspirations || '');

    // Format project data for database
    const projectData = {
      id: uuidv4(),
      title: data.title,
      type: data.type,
      user_id: user.id,
      video_format: data.videoFormat,
      logline: data.logline || '',
      genres: data.genres || [],
      duration: data.duration?.toString() || '0',
      inspirations: inspirationsStr,
      cover_image_url: coverImageUrl,
      narrative_structure: data.narrativeStructure || 'none',
      world_id: data.world_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert project in database
    const { data: dbProject, error } = await customSupabase
      .from('projects')
      .insert(projectData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Convert database project to app model
    const appProject = convertDbProjectToApp(dbProject);
    
    // Initialize with empty arrays for collections
    return {
      ...appProject,
      scenes: [],
      characters: [],
      episodes: []
    };
  } catch (error) {
    return handleApiError(error);
  }
};
