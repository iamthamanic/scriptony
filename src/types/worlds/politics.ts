
import { Json } from "@/integrations/supabase/types";
import { CategoryItem, CustomField } from "./items";

export interface Leader {
  id: string;
  name: string;
  title: string;
  image_url?: string;
  description?: string;
  customFields?: CustomField[];
  [key: string]: any; // Index signature for Json compatibility
}

export interface PoliticalSystem {
  id: string;
  name: string;
  description?: string;
  structure?: string;
  leaders?: Leader[];
  customFields?: CustomField[];
  [key: string]: any; // Index signature for Json compatibility
}

export interface PoliticsContent {
  systems: Array<PoliticalSystem & Record<string, Json>>;
}

export const createEmptyPoliticsContent = (): PoliticsContent => ({
  systems: []
});
