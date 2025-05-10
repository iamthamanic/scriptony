
export interface World {
  id: string;
  name: string;
  description?: string;
  cover_image_url?: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  categories: WorldCategory[];
}

export interface WorldCategory {
  id: string;
  name: string;
  type: WorldCategoryType;
  world_id: string;
  content?: any;
  order_index: number;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export type WorldCategoryType = 
  | 'text'
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

export interface WorldCategoryFormData {
  name: string;
  type: WorldCategoryType;
  icon?: string;
  content?: any;
}
