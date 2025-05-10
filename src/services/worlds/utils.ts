
import { supabase } from "@/integrations/supabase/client";
import { World, WorldCategory, WorldCategoryType } from "@/types/worlds";

// Helper to convert database world category to application type
export const mapDbCategoryToAppCategory = (category: any): WorldCategory => ({
  id: category.id,
  name: category.name,
  type: category.type as WorldCategoryType, // Ensure this is cast to the correct enum type
  content: category.content,
  icon: category.icon || undefined,
  order_index: category.order_index,
  world_id: category.world_id,
  created_at: new Date(category.created_at),
  updated_at: new Date(category.updated_at)
});

// Helper to convert database world to application type
export const mapDbWorldToAppWorld = (world: any, categories: any[] = []): World => ({
  id: world.id,
  name: world.name,
  description: world.description || undefined,
  cover_image_url: world.cover_image_url || undefined,
  user_id: world.user_id,
  created_at: new Date(world.created_at),
  updated_at: new Date(world.updated_at),
  categories: categories.map(mapDbCategoryToAppCategory)
});
