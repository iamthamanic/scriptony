
import { Json } from "@/integrations/supabase/types";
import { CategoryItem, CustomField } from "./items";

export interface EconomicEntity {
  id: string;
  name: string;
  description?: string;
  type: string;
  currency?: string;
  resources?: string[];
  customFields?: CustomField[];
  [key: string]: any; // Index signature for Json compatibility
}

export interface EconomyContent {
  entities: Array<EconomicEntity & Record<string, Json>>;
}

export const createEmptyEconomyContent = (): EconomyContent => ({
  entities: []
});
