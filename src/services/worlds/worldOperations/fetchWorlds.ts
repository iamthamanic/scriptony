
import { customSupabase } from "@/integrations/supabase/customClient";
import { World } from "@/types/worlds/base";
import { mapDbWorldToAppWorld } from "../utils";

export const fetchWorlds = async (userId: string): Promise<World[]> => {
  if (!userId) {
    throw new Error('User ID is required to fetch worlds');
  }

  // Fetch worlds
  const { data: worldsData, error: worldsError } = await customSupabase
    .from('worlds')
    .select('*')
    .eq('user_id', userId);

  if (worldsError) {
    console.error('Error fetching worlds:', worldsError);
    throw worldsError;
  }

  // Fetch categories for all worlds
  const { data: categoriesData, error: categoriesError } = await customSupabase
    .from('world_categories')
    .select('*');

  if (categoriesError) {
    console.error('Error fetching world categories:', categoriesError);
    throw categoriesError;
  }

  // Map DB data to application models
  return worldsData.map(world => {
    const worldCategories = categoriesData.filter(cat => cat.world_id === world.id)
      .sort((a, b) => a.order_index - b.order_index);
    return mapDbWorldToAppWorld(world, worldCategories);
  });
};
