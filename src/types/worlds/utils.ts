
import { Json } from "@/integrations/supabase/types";
import { WorldCategoryType } from "./base";

// Function to get the appropriate empty content structure based on category type
export const getEmptyCategoryContent = (type: WorldCategoryType): Json => {
  switch (type) {
    case 'geography':
      return { countries: [] } as unknown as Json;
    case 'politics':
      return { systems: [] } as unknown as Json;
    case 'economy':
      return { entities: [] } as unknown as Json;
    case 'society':
      return { groups: [] } as unknown as Json;
    case 'culture':
      return { elements: [] } as unknown as Json;
    default:
      return {} as Json;
  }
};
