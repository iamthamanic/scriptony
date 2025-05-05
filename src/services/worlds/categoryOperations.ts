
import { customSupabase } from "@/integrations/supabase/customClient";
import { WorldCategory, WorldCategoryFormData } from "@/types/worlds";
import { mapDbCategoryToAppCategory } from "./utils";

// Create a new world category
export const createWorldCategory = async (worldId: string, data: WorldCategoryFormData): Promise<WorldCategory> => {
  const { name, type, icon, content } = data;
  
  // Get the highest order_index for this world
  const { data: existingCategories, error: fetchError } = await customSupabase
    .from('world_categories')
    .select('order_index')
    .eq('world_id', worldId)
    .order('order_index', { ascending: false })
    .limit(1);
    
  if (fetchError) throw fetchError;
  
  const nextOrderIndex = existingCategories.length > 0 ? existingCategories[0].order_index + 1 : 0;
  
  // Initialize content structure based on type
  let processedContent = content;
  if (type === 'geography' && (!content || Object.keys(content).length === 0)) {
    processedContent = { countries: [] };
  }
  
  // Create the new category
  const { data: category, error } = await customSupabase
    .from('world_categories')
    .insert({
      world_id: worldId,
      name,
      type,
      icon,
      content: processedContent,
      order_index: nextOrderIndex
    })
    .select()
    .single();
    
  if (error) throw error;
  
  return mapDbCategoryToAppCategory(category);
};

// Update a world category
export const updateWorldCategory = async (categoryId: string, data: WorldCategoryFormData): Promise<WorldCategory> => {
  const { name, type, icon, content } = data;
  
  const { data: category, error } = await customSupabase
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
  
  return mapDbCategoryToAppCategory(category);
};

// Delete a world category
export const deleteWorldCategory = async (categoryId: string): Promise<void> => {
  const { error } = await customSupabase
    .from('world_categories')
    .delete()
    .eq('id', categoryId);
    
  if (error) throw error;
};

// Update world category order
export const updateCategoryOrder = async (categories: Partial<WorldCategory>[]): Promise<void> => {
  const updatePromises = categories.map(cat => {
    return customSupabase
      .from('world_categories')
      .update({ order_index: cat.order_index })
      .eq('id', cat.id);
  });
  
  await Promise.all(updatePromises);
};

// Upload an image for a country or location
export const uploadGeographyImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `geography-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  
  const { error } = await customSupabase.storage
    .from('covers')
    .upload(fileName, file);
    
  if (error) throw error;
  
  const { data } = customSupabase.storage
    .from('covers')
    .getPublicUrl(fileName);
    
  return data.publicUrl;
};
