
import { supabase } from "@/integrations/supabase/client";
import { World, WorldCategory, NewWorldFormData, WorldCategoryFormData, DEFAULT_WORLD_CATEGORIES } from "../types/worlds";

// Fetch all worlds for the current user
export const fetchUserWorlds = async (): Promise<World[]> => {
  const { data: worlds, error } = await supabase
    .from('worlds')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  const worldsWithCategories = await Promise.all(worlds.map(async (world) => {
    const { data: categories, error: catError } = await supabase
      .from('world_categories')
      .select('*')
      .eq('world_id', world.id)
      .order('order_index', { ascending: true });
      
    if (catError) throw catError;
    
    return {
      ...world,
      created_at: new Date(world.created_at),
      updated_at: new Date(world.updated_at),
      categories: categories.map(cat => ({
        ...cat,
        created_at: new Date(cat.created_at),
        updated_at: new Date(cat.updated_at),
        type: cat.type as WorldCategory['type']
      }))
    } as World;
  }));
  
  return worldsWithCategories;
};

// Fetch a single world by ID
export const fetchWorld = async (worldId: string): Promise<World> => {
  const { data: world, error } = await supabase
    .from('worlds')
    .select('*')
    .eq('id', worldId)
    .single();
    
  if (error) throw error;
  
  const { data: categories, error: catError } = await supabase
    .from('world_categories')
    .select('*')
    .eq('world_id', worldId)
    .order('order_index', { ascending: true });
    
  if (catError) throw catError;
  
  return {
    ...world,
    created_at: new Date(world.created_at),
    updated_at: new Date(world.updated_at),
    categories: categories.map(cat => ({
      ...cat,
      created_at: new Date(cat.created_at),
      updated_at: new Date(cat.updated_at),
      type: cat.type as WorldCategory['type']
    }))
  } as World;
};

// Create a new world
export const createWorld = async (data: NewWorldFormData): Promise<World> => {
  const { name, description, cover_image } = data;
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  // Upload cover image if provided
  let cover_image_url = null;
  if (cover_image) {
    const fileName = `world-${Date.now()}-${cover_image.name}`;
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('covers')
      .upload(fileName, cover_image);
      
    if (uploadError) throw uploadError;
    
    const { data: urlData } = supabase.storage
      .from('covers')
      .getPublicUrl(fileName);
      
    cover_image_url = urlData.publicUrl;
  }
  
  // Insert the world
  const { data: world, error } = await supabase
    .from('worlds')
    .insert({
      name,
      description,
      cover_image_url,
      user_id: user.id
    })
    .select()
    .single();
    
  if (error) throw error;
  
  // Create default world categories
  const defaultCategories = DEFAULT_WORLD_CATEGORIES.map(cat => ({
    world_id: world.id,
    type: cat.type,
    name: cat.name,
    icon: cat.icon,
    order_index: cat.order_index,
    content: {}
  }));
  
  const { data: categories, error: catError } = await supabase
    .from('world_categories')
    .insert(defaultCategories)
    .select();
    
  if (catError) throw catError;
  
  return {
    ...world,
    created_at: new Date(world.created_at),
    updated_at: new Date(world.updated_at),
    categories: categories.map(cat => ({
      ...cat,
      created_at: new Date(cat.created_at),
      updated_at: new Date(cat.updated_at),
      type: cat.type as WorldCategory['type']
    }))
  } as World;
};

// Update a world
export const updateWorld = async (worldId: string, data: NewWorldFormData): Promise<World> => {
  const { name, description, cover_image } = data;
  
  const updateData: any = { name, description };
  
  // Upload cover image if provided
  if (cover_image instanceof File) {
    const fileName = `world-${Date.now()}-${cover_image.name}`;
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('covers')
      .upload(fileName, cover_image);
      
    if (uploadError) throw uploadError;
    
    const { data: urlData } = supabase.storage
      .from('covers')
      .getPublicUrl(fileName);
      
    updateData.cover_image_url = urlData.publicUrl;
  }
  
  // Update the world
  const { data: world, error } = await supabase
    .from('worlds')
    .update(updateData)
    .eq('id', worldId)
    .select()
    .single();
    
  if (error) throw error;
  
  const { data: categories, error: catError } = await supabase
    .from('world_categories')
    .select('*')
    .eq('world_id', worldId)
    .order('order_index', { ascending: true });
    
  if (catError) throw catError;
  
  return {
    ...world,
    created_at: new Date(world.created_at),
    updated_at: new Date(world.updated_at),
    categories: categories.map(cat => ({
      ...cat,
      created_at: new Date(cat.created_at),
      updated_at: new Date(cat.updated_at),
      type: cat.type as WorldCategory['type']
    }))
  } as World;
};

// Delete a world
export const deleteWorld = async (worldId: string): Promise<void> => {
  const { error } = await supabase
    .from('worlds')
    .delete()
    .eq('id', worldId);
    
  if (error) throw error;
};

// Create a new world category
export const createWorldCategory = async (worldId: string, data: WorldCategoryFormData): Promise<WorldCategory> => {
  const { name, type, icon, content } = data;
  
  // Get the highest order_index for this world
  const { data: existingCategories, error: fetchError } = await supabase
    .from('world_categories')
    .select('order_index')
    .eq('world_id', worldId)
    .order('order_index', { ascending: false })
    .limit(1);
    
  if (fetchError) throw fetchError;
  
  const nextOrderIndex = existingCategories.length > 0 ? existingCategories[0].order_index + 1 : 0;
  
  // Create the new category
  const { data: category, error } = await supabase
    .from('world_categories')
    .insert({
      world_id: worldId,
      name,
      type,
      icon,
      content,
      order_index: nextOrderIndex
    })
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    ...category,
    created_at: new Date(category.created_at),
    updated_at: new Date(category.updated_at),
    type: category.type as WorldCategory['type']
  } as WorldCategory;
};

// Update a world category
export const updateWorldCategory = async (categoryId: string, data: WorldCategoryFormData): Promise<WorldCategory> => {
  const { name, type, icon, content } = data;
  
  const { data: category, error } = await supabase
    .from('world_categories')
    .update({
      name,
      type,
      icon,
      content
    })
    .eq('id', categoryId)
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    ...category,
    created_at: new Date(category.created_at),
    updated_at: new Date(category.updated_at),
    type: category.type as WorldCategory['type']
  } as WorldCategory;
};

// Delete a world category
export const deleteWorldCategory = async (categoryId: string): Promise<void> => {
  const { error } = await supabase
    .from('world_categories')
    .delete()
    .eq('id', categoryId);
    
  if (error) throw error;
};

// Update world category order
export const updateCategoryOrder = async (categories: Partial<WorldCategory>[]): Promise<void> => {
  const updatePromises = categories.map(cat => {
    return supabase
      .from('world_categories')
      .update({ order_index: cat.order_index })
      .eq('id', cat.id);
  });
  
  await Promise.all(updatePromises);
};
