
import { Json } from "@/integrations/supabase/types";
import { CategoryItem, CustomField } from "./items";

export interface SocialGroup {
  id: string;
  name: string;
  description?: string;
  population?: string;
  characteristics?: string[];
  customFields: CustomField[];
  [key: string]: any; // Index signature for Json compatibility
}

export interface SocietyContent {
  groups: SocialGroup[];
  [key: string]: any; // Index signature for Json compatibility
}

export const createEmptySocietyContent = (): SocietyContent => ({
  groups: []
});
