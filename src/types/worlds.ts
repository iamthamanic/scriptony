
import { Json } from "@/integrations/supabase/types";

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

// Base interfaces for category items
export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
  cover_image_url?: string;
  symbol_image_url?: string;
  customFields: CustomField[];
}

// Field type definitions
export enum FieldType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  DROPDOWN = 'dropdown'
}

// Extended CustomField interface with field type support
export interface CustomField {
  id: string;
  name: string;
  type: FieldType;
  value: string;
  options?: FieldOption[]; // For dropdown fields
}

// Options for dropdown fields
export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

// Geography category content with countries and locations
export interface GeographyContent {
  countries: Country[];
  [key: string]: Json; // Add index signature to satisfy Json type
}

// Politics category content with political systems
export interface PoliticsContent {
  systems: PoliticalSystem[];
  [key: string]: Json; // Add index signature to satisfy Json type
}

// Economy category content with economic entities
export interface EconomyContent {
  entities: EconomicEntity[];
  [key: string]: Json; // Add index signature to satisfy Json type
}

// Society category content with social groups
export interface SocietyContent {
  groups: SocialGroup[];
  [key: string]: Json; // Add index signature to satisfy Json type
}

// Culture category content with cultural elements
export interface CultureContent {
  elements: CultureElement[];
  [key: string]: Json; // Add index signature to satisfy Json type
}

// Country extends CategoryItem
export interface Country extends CategoryItem {
  flag_url?: string;
  locations: Location[];
}

// Location extends CategoryItem
export interface Location extends CategoryItem {
  coordinates?: { x: number; y: number }; // For map positioning
}

// Political system extends CategoryItem
export interface PoliticalSystem extends CategoryItem {
  government_type?: string;
  leaders?: Leader[];
  laws?: Law[];
}

export interface Leader {
  id: string;
  name: string;
  title: string;
  portrait_url?: string;
  description?: string;
}

export interface Law {
  id: string;
  name: string;
  description: string;
}

// Economic entity extends CategoryItem
export interface EconomicEntity extends CategoryItem {
  entity_type?: 'currency' | 'resource' | 'organization' | 'system';
  value?: string;
}

// Social group extends CategoryItem
export interface SocialGroup extends CategoryItem {
  population?: string;
  characteristics?: string[];
}

// Culture element extends CategoryItem
export interface CultureElement extends CategoryItem {
  element_type?: 'art' | 'tradition' | 'festival' | 'belief';
}

// Helper function to create a new custom field
export const createCustomField = (
  name: string, 
  type: FieldType = FieldType.TEXT, 
  value: string = '', 
  options?: FieldOption[]
): CustomField => ({
  id: crypto.randomUUID(),
  name,
  type,
  value,
  options
});

// Helper function to create a new CategoryItem (base for all items)
export const createCategoryItem = (
  name: string,
  description: string = ''
): CategoryItem => ({
  id: crypto.randomUUID(),
  name,
  description,
  customFields: []
});

// Function to get the appropriate empty content structure based on category type
export const getEmptyCategoryContent = (type: WorldCategoryType): Json => {
  switch (type) {
    case 'geography':
      return { countries: [] } as unknown as Json;
    case 'politics':
      return { systems: [] } as unknown as Json;
    case 'economy':
      return { entities: [] } as unknown as Json;
    case 'society':
      return { groups: [] } as unknown as Json;
    case 'culture':
      return { elements: [] } as unknown as Json;
    default:
      return {} as Json;
  }
};
