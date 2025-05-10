
import { WorldCategoryType } from "./base";
import { createEmptyGeographyContent } from "./geography";
import { createEmptyPoliticsContent } from "./politics";
import { createEmptyEconomyContent } from "./economy";
import { createEmptySocietyContent } from "./society";
import { createEmptyCultureContent } from "./culture";
import { Json } from "@/integrations/supabase/types";

export const getEmptyCategoryContent = (type: WorldCategoryType): Json => {
  switch (type) {
    case 'geography':
      return createEmptyGeographyContent();
    case 'politics':
      return createEmptyPoliticsContent();
    case 'economy':
      return createEmptyEconomyContent();
    case 'society':
      return createEmptySocietyContent();
    case 'culture':
      return createEmptyCultureContent();
    default:
      return {};
  }
};
