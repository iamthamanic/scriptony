
import { customSupabase } from "@/integrations/supabase/customClient";
import { World } from "@/types/worlds";
import { mapDbWorldToAppWorld } from "../utils";
import { getCurrentUser } from "./utils";

/**
 * Duplicates an existing world, along with its categories
 */
export const duplicateWorld = async (worldId: string): Promise<World> => {
  // Get the current user
  const { data: { user } } = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  
  // Fetch the original world
  const { data: originalWorld, error: worldError } = await customSupabase
    .from('worlds')
    .select('*')
    .eq('id', worldId)
    .single();
    
  if (worldError) throw worldError;
  
  // Fetch the original world's categories
  const { data: originalCategories, error: catError } = await customSupabase
    .from('world_categories')
    .select('*')
    .eq('world_id', worldId)
    .order('order_index', { ascending: true });
    
  if (catError) throw catError;
  
  // Create a new world based on the original
  const { data: newWorld, error: createError } = await customSupabase
    .from('worlds')
    .insert({
      name: `${originalWorld.name} (Kopie)`,
      description: originalWorld.description,
      cover_image_url: originalWorld.cover_image_url,
      user_id: user.id
    })
    .select()
    .single();
    
  if (createError) throw createError;
  
  // Create categories for the new world
  const newCategories = originalCategories.map(cat => ({
    world_id: newWorld.id,
    type: cat.type,
    name: cat.name,
    icon: cat.icon,
    order_index: cat.order_index,
    content: cat.content
  }));
  
  const { data: categories, error: newCatError } = await customSupabase
    .from('world_categories')
    .insert(newCategories)
    .select();
    
  if (newCatError) throw newCatError;
  
  return mapDbWorldToAppWorld(newWorld, categories);
};
