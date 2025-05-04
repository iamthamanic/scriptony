
import { supabase } from "@/integrations/supabase/client";
import { World, WorldCategory } from "@/types/worlds";

// Helper to convert database world category to application type
export const mapDbCategoryToAppCategory = (category: any): WorldCategory => ({
  ...category,
  created_at: new Date(category.created_at),
  updated_at: new Date(category.updated_at),
  type: category.type as WorldCategory['type']
});

// Helper to convert database world to application type
export const mapDbWorldToAppWorld = (world: any, categories: any[] = []): World => ({
  ...world,
  created_at: new Date(world.created_at),
  updated_at: new Date(world.updated_at),
  categories: categories.map(mapDbCategoryToAppCategory)
});
