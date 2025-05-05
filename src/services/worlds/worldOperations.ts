
import { customSupabase } from "@/integrations/supabase/customClient";
import { World, NewWorldFormData } from "@/types/worlds";
import { mapDbWorldToAppWorld } from "./utils";
import { isDevelopmentMode, getDevModeUser } from "@/utils/devMode";

/**
 * Gets the current user, returning a mock user if in development mode
 */
const getCurrentUser = async () => {
  // Use mock user in development mode
  if (isDevelopmentMode()) {
    return { data: { user: getDevModeUser() } };
  }
  
  // Use actual authentication in production
  return await customSupabase.auth.getUser();
};

// Fetch all worlds for the current user
export const fetchUserWorlds = async (): Promise<World[]> => {
  // Get the current user
  const { data: { user } } = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data: worlds, error } = await customSupabase
    .from('worlds')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  const worldsWithCategories = await Promise.all(worlds.map(async (world) => {
    const { data: categories, error: catError } = await customSupabase
      .from('world_categories')
      .select('*')
      .eq('world_id', world.id)
      .order('order_index', { ascending: true });
      
    if (catError) throw catError;
    
    return mapDbWorldToAppWorld(world, categories);
  }));
  
  return worldsWithCategories;
};

// Fetch a single world by ID
export const fetchWorld = async (worldId: string): Promise<World> => {
  const { data: world, error } = await customSupabase
    .from('worlds')
    .select('*')
    .eq('id', worldId)
    .single();
    
  if (error) throw error;
  
  const { data: categories, error: catError } = await customSupabase
    .from('world_categories')
    .select('*')
    .eq('world_id', worldId)
    .order('order_index', { ascending: true });
    
  if (catError) throw catError;
  
  return mapDbWorldToAppWorld(world, categories);
};

// Create a new world
export const createWorld = async (data: NewWorldFormData): Promise<World> => {
  const { name, description, cover_image } = data;
  
  // Get the current user
  const { data: { user } } = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  
  // Upload cover image if provided
  let cover_image_url = null;
  if (cover_image) {
    const fileName = `world-${Date.now()}-${cover_image.name}`;
    const { error: uploadError, data: uploadData } = await customSupabase.storage
      .from('covers')
      .upload(fileName, cover_image);
      
    if (uploadError) {
      console.error('Error uploading cover image:', uploadError);
      throw uploadError;
    }
    
    const { data: urlData } = customSupabase.storage
      .from('covers')
      .getPublicUrl(fileName);
      
    cover_image_url = urlData.publicUrl;
  }
  
  // Insert the world
  const { data: world, error } = await customSupabase
    .from('worlds')
    .insert({
      name,
      description,
      cover_image_url,
      user_id: user.id
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating world:', error);
    throw error;
  }
  
  // Create default world categories
  const { DEFAULT_WORLD_CATEGORIES } = await import("@/types/worlds");
  const defaultCategories = DEFAULT_WORLD_CATEGORIES.map(cat => ({
    world_id: world.id,
    type: cat.type,
    name: cat.name,
    icon: cat.icon,
    order_index: cat.order_index,
    content: {}
  }));
  
  const { data: categories, error: catError } = await customSupabase
    .from('world_categories')
    .insert(defaultCategories)
    .select();
    
  if (catError) throw catError;
  
  return mapDbWorldToAppWorld(world, categories);
};

// Update a world
export const updateWorld = async (worldId: string, data: NewWorldFormData): Promise<World> => {
  const { name, description, cover_image } = data;
  
  const updateData: any = { name, description };
  
  // Upload cover image if provided
  if (cover_image instanceof File) {
    const fileName = `world-${Date.now()}-${cover_image.name}`;
    const { error: uploadError, data: uploadData } = await customSupabase.storage
      .from('covers')
      .upload(fileName, cover_image);
      
    if (uploadError) throw uploadError;
    
    const { data: urlData } = customSupabase.storage
      .from('covers')
      .getPublicUrl(fileName);
      
    updateData.cover_image_url = urlData.publicUrl;
  }
  
  // Update the world
  const { data: world, error } = await customSupabase
    .from('worlds')
    .update(updateData)
    .eq('id', worldId)
    .select()
    .single();
    
  if (error) throw error;
  
  const { data: categories, error: catError } = await customSupabase
    .from('world_categories')
    .select('*')
    .eq('world_id', worldId)
    .order('order_index', { ascending: true });
    
  if (catError) throw catError;
  
  return mapDbWorldToAppWorld(world, categories);
};

// Delete a world
export const deleteWorld = async (worldId: string): Promise<void> => {
  const { error } = await customSupabase
    .from('worlds')
    .delete()
    .eq('id', worldId);
    
  if (error) throw error;
};
