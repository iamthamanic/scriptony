
import { Json } from "@/integrations/supabase/types";
import { CategoryItem } from "./items";

// Geography category content with countries and locations
export interface GeographyContent {
  countries: Array<Country & Record<string, Json>>;
  [key: string]: Json; // Index signature to satisfy Json requirements
}

// Country extends CategoryItem
export interface Country extends CategoryItem {
  flag_url?: string;
  locations: Array<Location & Record<string, Json>>;
}

// Location extends CategoryItem
export interface Location extends CategoryItem {
  coordinates?: { x: number; y: number }; // For map positioning
}
