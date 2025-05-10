
import { Json } from "@/integrations/supabase/types";
import { CategoryItem, CustomField } from "./items";

// Geography specific types
export interface Location {
  id: string;
  name: string;
  description?: string;
  coordinates?: {
    x: number;
    y: number;
  };
  customFields: CustomField[];
  cover_image_url?: string;
  [key: string]: any; // Index signature for Json compatibility
}

export interface Country {
  id: string;
  name: string;
  description?: string;
  flag_url?: string;
  locations?: Location[];
  customFields: CustomField[];
  cover_image_url?: string;
  [key: string]: any; // Index signature for Json compatibility
}

export interface GeographyContent {
  countries: Country[];
  [key: string]: any; // Index signature for Json compatibility
}

export const createEmptyGeographyContent = (): GeographyContent => ({
  countries: [],
});
