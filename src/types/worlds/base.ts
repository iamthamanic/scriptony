
import { Json } from "@/integrations/supabase/types";

// Define WorldCategoryType as a union type for strict type checking
export type WorldCategoryType = 'geography' | 'politics' | 'economy' | 'society' | 'culture' | 'custom';

// Define TimeOfDay as a union type
export type TimeOfDay = 'day' | 'night' | 'morning' | 'evening' | 'afternoon' | 'dawn' | 'dusk';

// Define the base interfaces for categories
export interface WorldCategory {
  id: string;
  name: string;
  type: WorldCategoryType;
  content: Json;
  icon?: string;
  order_index: number;
  world_id: string;
  created_at: Date;
  updated_at: Date;
}

// Form data for category operations
export interface WorldCategoryFormData {
  id?: string; 
  name: string;
  type: WorldCategoryType;
  icon?: string;
  content: any;
}

// Define the base World interface
export interface World {
  id: string;
  name: string;
  description?: string;
  cover_image_url?: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  categories: WorldCategory[];
}

// Form data for world operations
export interface WorldFormData {
  id?: string;
  name: string;
  description?: string;
  cover_image?: File;
  cover_image_url?: string;
}

// Alias WorldFormData as NewWorldFormData for backward compatibility
export type NewWorldFormData = WorldFormData;

// Define default world categories
export const DEFAULT_WORLD_CATEGORIES = [
  { type: 'geography' as WorldCategoryType, name: 'Geography', icon: 'map', order_index: 0 },
  { type: 'politics' as WorldCategoryType, name: 'Politics', icon: 'landmark', order_index: 1 },
  { type: 'economy' as WorldCategoryType, name: 'Economy', icon: 'coins', order_index: 2 },
  { type: 'society' as WorldCategoryType, name: 'Society', icon: 'users', order_index: 3 },
  { type: 'culture' as WorldCategoryType, name: 'Culture', icon: 'book', order_index: 4 }
];
