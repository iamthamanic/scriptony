
import { Json } from "@/integrations/supabase/types";
import { CategoryItem, CustomField } from "./items";

export interface CultureElement {
  id: string;
  name: string;
  description?: string;
  category?: string;
  significance?: string;
  element_type?: string;
  customFields: CustomField[];
  [key: string]: any; // Index signature for Json compatibility
}

export interface CultureContent {
  elements: CultureElement[];
  [key: string]: any; // Index signature for Json compatibility
}

export const createEmptyCultureContent = (): CultureContent => ({
  elements: []
});
