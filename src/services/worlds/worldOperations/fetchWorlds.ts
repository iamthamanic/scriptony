
import { customSupabase } from "@/integrations/supabase/customClient";
import { World } from "@/types/worlds";
import { mapDbWorldToAppWorld } from "../utils";
import { getCurrentUser } from "./utils";

/**
 * Fetch all worlds for the current user
 */
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

/**
 * Fetch a single world by ID
 */
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
