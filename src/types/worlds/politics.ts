
import { Json } from "@/integrations/supabase/types";
import { CategoryItem } from "./items";

// Politics category content with political systems
export interface PoliticsContent {
  systems: Array<PoliticalSystem & Record<string, Json>>;
  [key: string]: Json; // Index signature to satisfy Json requirements
}

// Political system extends CategoryItem
export interface PoliticalSystem extends CategoryItem {
  government_type?: string;
  leaders?: Leader[];
  laws?: Law[];
  [key: string]: any; // Index signature to satisfy Json requirements
}

export interface Leader {
  id: string;
  name: string;
  title: string;
  portrait_url?: string;
  description?: string;
  [key: string]: any; // Index signature to satisfy Json requirements
}

export interface Law {
  id: string;
  name: string;
  description: string;
  [key: string]: any; // Index signature to satisfy Json requirements
}
