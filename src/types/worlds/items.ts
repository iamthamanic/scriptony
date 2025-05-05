
import { Json } from "@/integrations/supabase/types";

// Field type definitions
export enum FieldType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  DROPDOWN = 'dropdown'
}

// Base interfaces for category items
export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
  cover_image_url?: string;
  symbol_image_url?: string;
  customFields: CustomField[];
  [key: string]: any; // Index signature to satisfy Json requirements
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
