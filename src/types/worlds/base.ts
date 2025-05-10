
import { Json } from "@/integrations/supabase/types";

// Basic World and Category Types
export interface World {
  id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  categories: WorldCategory[];
}

export interface WorldCategory {
  id: string;
  world_id: string;
  type: WorldCategoryType;
  name: string;
  content: Json | null;
  icon: string | null;
  order_index: number;
  created_at: Date;
  updated_at: Date;
}

export type WorldCategoryType = 
  | 'text'
  | 'geography' 
  | 'politics' 
  | 'economy' 
  | 'society'
  | 'religion' 
  | 'history' 
  | 'technology' 
  | 'nature' 
  | 'language' 
  | 'culture' 
  | 'list'
  | 'map'
  | 'timeline'
  | 'characters'
  | 'gallery'
  | 'table'
  | 'custom';

export interface NewWorldFormData {
  name: string;
  description?: string;
  cover_image?: File;
}

export interface EditWorldFormData {
  name: string;
  description?: string;
  cover_image?: File | string;
}

export interface WorldCategoryFormData {
  id?: string;
  name: string;
  type: WorldCategoryType;
  icon?: string;
  content?: Json;
}

export const DEFAULT_WORLD_CATEGORIES: Array<Partial<WorldCategory>> = [
  { type: 'geography', name: 'Geografie', icon: 'map', order_index: 0 },
  { type: 'politics', name: 'Politik', icon: 'landmark', order_index: 1 },
  { type: 'economy', name: 'Wirtschaft', icon: 'coins', order_index: 2 },
  { type: 'society', name: 'Gesellschaft', icon: 'users', order_index: 3 },
  { type: 'religion', name: 'Religion', icon: 'cross', order_index: 4 },
  { type: 'history', name: 'Geschichte', icon: 'scroll-text', order_index: 5 },
  { type: 'technology', name: 'Technologie', icon: 'atom', order_index: 6 },
  { type: 'nature', name: 'Natur & Tiere', icon: 'tree', order_index: 7 },
  { type: 'language', name: 'Sprache & Schrift', icon: 'language', order_index: 8 },
  { type: 'culture', name: 'Kultur & Kunst', icon: 'palette', order_index: 9 }
];

export interface WorldWithCoverImageFile extends Omit<World, 'cover_image_url'> {
  cover_image?: string | File | null;
}
