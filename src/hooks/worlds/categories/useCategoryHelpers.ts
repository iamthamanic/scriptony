
import { Json } from "@/integrations/supabase/types";
import { WorldCategoryType, getEmptyCategoryContent } from "@/types/worlds";
import { preserveImageProperties } from "@/utils/jsonPreserver";

export function useCategoryHelpers() {
  /**
   * Ensures the content has the correct structure for its category type
   */
  const ensureContentStructure = (type: WorldCategoryType, content: Json | null): Json => {
    console.log(`Ensuring content structure for type: ${type}`);
    
    // If content is null or empty, create default structure
    if (!content || Object.keys(content).length === 0) {
      console.log(`Creating empty content for type ${type}`);
      return getEmptyCategoryContent(type);
    }
    
    let processedContent = content;
    
    // Apply type-specific structure checks and fixes
    switch (type) {
      case 'geography':
        if (!content.countries) {
          processedContent = { ...content, countries: [] };
        } else {
          // Ensure all special properties are preserved in countries array
          const countries = Array.isArray(content.countries) 
            ? content.countries.map(country => preserveImageProperties(country))
            : [];
          processedContent = { ...content, countries };
        }
        break;
        
      case 'politics':
        if (!content.systems) {
          processedContent = { ...content, systems: [] };
        } else {
          // Ensure all special properties are preserved in systems array
          const systems = Array.isArray(content.systems)
            ? content.systems.map(system => preserveImageProperties(system))
            : [];
          processedContent = { ...content, systems };
        }
        break;
        
      case 'economy':
        if (!content.entities) {
          processedContent = { ...content, entities: [] };
        } else {
          // Ensure all special properties are preserved in entities array
          const entities = Array.isArray(content.entities)
            ? content.entities.map(entity => preserveImageProperties(entity))
            : [];
          processedContent = { ...content, entities };
        }
        break;
        
      case 'society':
        if (!content.groups) {
          processedContent = { ...content, groups: [] };
        } else {
          // Ensure all special properties are preserved in groups array
          const groups = Array.isArray(content.groups)
            ? content.groups.map(group => preserveImageProperties(group))
            : [];
          processedContent = { ...content, groups };
        }
        break;
        
      case 'culture':
        if (!content.elements) {
          processedContent = { ...content, elements: [] };
        } else {
          // Ensure all special properties are preserved in elements array
          const elements = Array.isArray(content.elements)
            ? content.elements.map(element => preserveImageProperties(element))
            : [];
          processedContent = { ...content, elements };
        }
        break;
        
      default:
        // For other types, just ensure it's an object
        processedContent = typeof content === 'object' ? content : {};
    }
    
    console.log(`Ensured content structure:`, processedContent);
    return processedContent as Json;
  };
  
  return { ensureContentStructure };
}
