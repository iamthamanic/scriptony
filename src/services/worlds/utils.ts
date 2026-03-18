
import { World, WorldCategory, WorldCategoryType } from "@/types/worlds";

// Helper to convert database world category to application type
export const mapDbCategoryToAppCategory = (category: Record<string, unknown>): WorldCategory => ({
  id: category.id as string,
  name: category.name as string,
  type: category.type as WorldCategoryType, // Ensure this is cast to the correct enum type
  content: category.content,
  icon: category.icon as string || undefined,
  order_index: category.order_index as number,
  world_id: category.world_id as string,
  created_at: new Date(category.created_at as string),
  updated_at: new Date(category.updated_at as string)
});

// Helper to convert database world to application type
export const mapDbWorldToAppWorld = (world: Record<string, unknown>, categories: Record<string, unknown>[] = []): World => ({
  id: world.id as string,
  name: world.name as string,
  description: world.description as string || undefined,
  cover_image_url: world.cover_image_url as string || undefined,
  user_id: world.user_id as string,
  created_at: new Date(world.created_at as string),
  updated_at: new Date(world.updated_at as string),
  categories: categories.map(mapDbCategoryToAppCategory)
});
