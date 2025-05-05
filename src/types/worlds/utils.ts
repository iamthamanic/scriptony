
import { Json } from "@/integrations/supabase/types";
import { WorldCategoryType } from "./base";

// Function to get the appropriate empty content structure based on category type
export const getEmptyCategoryContent = (type: WorldCategoryType): Json => {
  console.log("Creating empty content structure for type:", type);
  
  switch (type) {
    case 'geography':
      return { countries: [] } as Json;
    case 'politics':
      return { systems: [] } as Json;
    case 'economy':
      return { entities: [] } as Json;
    case 'society':
      return { groups: [] } as Json;
    case 'culture':
      return { elements: [] } as Json;
    default:
      return {} as Json;
  }
};
