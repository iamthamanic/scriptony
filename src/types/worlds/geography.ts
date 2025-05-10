
import { Json } from "@/integrations/supabase/types";
import { CategoryItem, CustomField } from "./items";

// Geography specific types
export interface Location {
  id: string;
  name: string;
  description?: string;
  coordinates?: string;
  customFields?: CustomField[];
  [key: string]: any; // Index signature for Json compatibility
}

export interface Country {
  id: string;
  name: string;
  description?: string;
  flag_url?: string;
  locations?: Location[];
  customFields?: CustomField[];
  [key: string]: any; // Index signature for Json compatibility
}

export interface GeographyContent {
  countries: Array<Country & Record<string, Json>>;
}

export const createEmptyGeographyContent = (): GeographyContent => ({
  countries: []
});
