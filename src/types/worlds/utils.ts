
import { WorldCategoryType } from "./base";
import { createEmptyGeographyContent, GeographyContent } from "./geography";
import { createEmptyPoliticsContent, PoliticsContent } from "./politics";
import { createEmptyEconomyContent, EconomyContent } from "./economy";
import { createEmptySocietyContent, SocietyContent } from "./society";
import { createEmptyCultureContent, CultureContent } from "./culture";
import { Json } from "@/integrations/supabase/types";

export const getEmptyCategoryContent = (type: WorldCategoryType): any => {
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
