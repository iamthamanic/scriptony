
import { Json } from "@/integrations/supabase/types";

/**
 * Helper to preserve image URLs and other special properties during JSON transformations
 */
export const preserveImageProperties = (obj: any): any => {
  // Handle null, undefined, and primitive values
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }
  
  // For arrays, process each item
  if (Array.isArray(obj)) {
    return obj.map(item => preserveImageProperties(item));
  }
  
  // For objects, preserve special properties and process nested objects
  const result = { ...obj };
  
  // List of special properties to explicitly preserve
  const specialProperties = [
    'flag_url', 
    'cover_image_url', 
    'image_url', 
    'symbol_image_url'
  ];
  
  // Log the object for debugging
  console.log('Processing object in preserveImageProperties:', 
    JSON.stringify(obj).substring(0, 100) + (JSON.stringify(obj).length > 100 ? '...' : ''));
  
  // Ensure special properties are preserved
  for (const prop of specialProperties) {
    if (obj[prop] !== undefined) {
      console.log(`Preserving ${prop}:`, obj[prop]);
      result[prop] = obj[prop];
    }
  }
  
  // Process nested objects
  for (const key in result) {
    if (result[key] !== null && typeof result[key] === 'object') {
      result[key] = preserveImageProperties(result[key]);
    }
  }
  
  return result;
};

/**
 * Safely serialize and deserialize JSON while preserving image URLs
 */
export const safeJsonTransform = (data: any): any => {
  try {
    // Check if data is null, undefined, or not an object
    if (data === null || data === undefined || typeof data !== 'object') {
      return data;
    }
    
    // First apply property preservation to ensure URLs are kept
    const preservedData = preserveImageProperties(data);
    
    // Log before serialization
    console.log('Before serialization, data with preserved properties:', 
      JSON.stringify(preservedData).substring(0, 100) + 
      (JSON.stringify(preservedData).length > 100 ? '...' : ''));
    
    // Serialize to JSON string
    const jsonString = JSON.stringify(preservedData);
    
    // Then parse back to object
    const parsed = JSON.parse(jsonString);
    
    // Log after parsing
    console.log('After parsing, final data:', 
      JSON.stringify(parsed).substring(0, 100) + 
      (JSON.stringify(parsed).length > 100 ? '...' : ''));
    
    return parsed;
  } catch (error) {
    console.error('Error in safeJsonTransform:', error);
    // Return the original data if transformation fails
    return data; 
  }
};
