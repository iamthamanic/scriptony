
import { Json } from "@/integrations/supabase/types";
import { CategoryItem } from "./items";

// Culture category content with cultural elements
export interface CultureContent {
  elements: Array<CultureElement & Record<string, Json>>;
  [key: string]: Json; // Index signature to satisfy Json requirements
}

// Culture element extends CategoryItem
export interface CultureElement extends CategoryItem {
  element_type?: 'art' | 'tradition' | 'festival' | 'belief';
  [key: string]: any; // Index signature to satisfy Json requirements
}
