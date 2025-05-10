
import { Json } from "@/integrations/supabase/types";

// Define WorldCategoryType as a union type for strict type checking
export type WorldCategoryType = 'geography' | 'politics' | 'economy' | 'society' | 'culture' | 'custom';

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
