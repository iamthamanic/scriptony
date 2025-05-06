
import { supabase } from "@/integrations/supabase/client";
import { Character, NewCharacterFormData } from "../types";
import { handleApiError } from "./utils";

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
    return handleApiError(error);
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
    return handleApiError(error) ?? false;
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
    return handleApiError(error) ?? false;
  }
};
