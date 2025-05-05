
import { Json } from "@/integrations/supabase/types";
import { CategoryItem } from "./items";

// Economy category content with economic entities
export interface EconomyContent {
  entities: Array<EconomicEntity & Record<string, Json>>;
  [key: string]: Json; // Index signature to satisfy Json requirements
}

// Economic entity extends CategoryItem
export interface EconomicEntity extends CategoryItem {
  entity_type?: 'currency' | 'resource' | 'organization' | 'system';
  value?: string;
  [key: string]: any; // Index signature to satisfy Json requirements
}
