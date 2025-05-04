
import { supabase } from "@/integrations/supabase/client";
import { Episode, NewEpisodeFormData } from "../types";
import { handleApiError } from "./utils";

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
