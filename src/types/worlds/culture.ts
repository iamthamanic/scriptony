
import { Json } from "@/integrations/supabase/types";
import { CategoryItem, CustomField } from "./items";

export interface CultureElement {
  id: string;
  name: string;
  description?: string;
  category?: string;
  significance?: string;
  customFields?: CustomField[];
  [key: string]: any; // Index signature for Json compatibility
}

export interface CultureContent {
  elements: Array<CultureElement & Record<string, Json>>;
}

export const createEmptyCultureContent = (): CultureContent => ({
  elements: []
});
