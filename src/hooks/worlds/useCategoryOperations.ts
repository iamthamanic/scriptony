import { useToast } from "@/hooks/use-toast";
import { 
  createWorldCategory, 
  updateWorldCategory, 
  deleteWorldCategory,
  updateCategoryOrder
} from "@/services/worlds";
import { WorldCategoryFormData, getEmptyCategoryContent, WorldCategoryType } from "@/types/worlds";
import { Json } from "@/integrations/supabase/types";

export function useCategoryOperations(
  worlds: any[],
  setWorlds: (worlds: any[]) => void,
  selectedWorld: any,
  setSelectedCategory: (category: any) => void,
  setIsCategoryModalOpen: (open: boolean) => void
) {
  const { toast } = useToast();

  // Helper to ensure content structures are preserved correctly
  const ensureContentStructure = (type: WorldCategoryType, existingContent: Json | null): Json => {
    console.log("Ensuring content structure for type:", type, "Existing:", existingContent);
    
    // Get default empty structure for this category type
    const emptyContent = getEmptyCategoryContent(type);
    
    // Early return if no existing content
    if (!existingContent) return emptyContent;
    
    // Deep clone the content to avoid reference issues
    const contentCopy = existingContent ? JSON.parse(JSON.stringify(existingContent)) : {};
    
    // Ensure we have the expected structure based on category type
    switch (type) {
      case 'geography':
        // Preserve country data including images
        let countries = [];
        
        if ((contentCopy as any)?.countries && Array.isArray((contentCopy as any).countries)) {
          countries = (contentCopy as any).countries.map((country: any) => {
            console.log('Preserving country:', country.name);
            console.log('With flag URL:', country.flag_url);
            console.log('With cover image URL:', country.cover_image_url);
            
            // Create a clean copy of the country
            const countryCopy = {
              ...country,
              flag_url: country.flag_url,
              cover_image_url: country.cover_image_url,
              locations: []
            };
            
            // Add locations if they exist
            if (Array.isArray(country.locations)) {
              countryCopy.locations = country.locations.map((loc: any) => {
                console.log('Preserving location:', loc.name);
                console.log('With cover image URL:', loc.cover_image_url);
                
                return {
                  ...loc,
                  cover_image_url: loc.cover_image_url,
                  symbol_image_url: loc.symbol_image_url
                };
              });
            }
            
            return countryCopy;
          });
        }
          
        return {
          countries
        } as Json;
      
      case 'politics':
        return {
          systems: Array.isArray((contentCopy as any)?.systems) ? 
            (contentCopy as any).systems.map((system: any) => ({
              ...system,
              cover_image_url: system.cover_image_url,
              symbol_image_url: system.symbol_image_url,
            })) : []
        } as Json;
      
      case 'economy':
        return {
          entities: Array.isArray((contentCopy as any)?.entities) ? 
            (contentCopy as any).entities.map((entity: any) => ({
              ...entity,
              cover_image_url: entity.cover_image_url,
              symbol_image_url: entity.symbol_image_url,
            })) : []
        } as Json;
      
      case 'society':
        return {
          groups: Array.isArray((contentCopy as any)?.groups) ? 
            (contentCopy as any).groups.map((group: any) => ({
              ...group,
              cover_image_url: group.cover_image_url,
              symbol_image_url: group.symbol_image_url,
            })) : []
        } as Json;
      
      case 'culture':
        return {
          elements: Array.isArray((contentCopy as any)?.elements) ? 
            (contentCopy as any).elements.map((element: any) => ({
              ...element,
              cover_image_url: element.cover_image_url,
              symbol_image_url: element.symbol_image_url,
            })) : []
        } as Json;
      
      default:
        // For custom or other categories, just keep what we have
        return contentCopy as Json;
    }
  };

  // Category operations
  const handleCategorySubmit = async (data: WorldCategoryFormData) => {
    if (!selectedWorld) return;
    
    try {
      const selectedCategory = selectedWorld.categories.find((c: any) => 
        c.id === data.id);
      
      // Ensure content has a proper structure based on category type
      if (!data.content || typeof data.content !== 'object') {
        data.content = getEmptyCategoryContent(data.type);
      }
      
      if (selectedCategory) {
        console.log("Updating existing category:", data);
        console.log("Original category content:", selectedCategory.content);
        
        // For existing categories with type change, initialize new structure
        if (selectedCategory.type !== data.type) {
          console.log("Category type changed from", selectedCategory.type, "to", data.type);
          data.content = getEmptyCategoryContent(data.type);
        } else {
          // Preserve existing content structure if type hasn't changed
          data.content = ensureContentStructure(data.type, data.content as Json);
          console.log("Preserved category content:", data.content);
        }
        
        // Update existing category
        const updatedCategory = await updateWorldCategory(selectedCategory.id, data);
        console.log("Category updated successfully:", updatedCategory);
        
        const updatedWorld = {
          ...selectedWorld,
          categories: selectedWorld.categories.map((c: any) => 
            c.id === updatedCategory.id ? updatedCategory : c
          )
        };
        
        setWorlds(worlds.map(w => w.id === updatedWorld.id ? updatedWorld : w));
        
        toast({
          title: 'Kategorie aktualisiert',
          description: `"${data.name}" wurde erfolgreich aktualisiert.`
        });
      } else {
        console.log("Creating new category:", data);
        
        // Initialize appropriate content structure for new category
        data.content = getEmptyCategoryContent(data.type);
        
        // Create new category
        const newCategory = await createWorldCategory(selectedWorld.id, data);
        console.log("Category created successfully:", newCategory);
        
        const updatedWorld = {
          ...selectedWorld,
          categories: [...selectedWorld.categories, newCategory]
        };
        
        setWorlds(worlds.map(w => w.id === updatedWorld.id ? updatedWorld : w));
        
        toast({
          title: 'Kategorie erstellt',
          description: `"${data.name}" wurde erfolgreich erstellt.`
        });
      }
      
      setIsCategoryModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error with category:', error);
      toast({
        title: 'Fehler',
        description: 'Die Kategorie konnte nicht gespeichert werden.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!selectedWorld) return;
    
    try {
      await deleteWorldCategory(categoryId);
      const updatedWorld = {
        ...selectedWorld,
        categories: selectedWorld.categories.filter((c: any) => c.id !== categoryId)
      };
      
      setWorlds(worlds.map(w => w.id === updatedWorld.id ? updatedWorld : w));
      
      toast({
        title: 'Kategorie gelöscht',
        description: 'Die Kategorie wurde erfolgreich gelöscht.'
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Fehler',
        description: 'Die Kategorie konnte nicht gelöscht werden.',
        variant: 'destructive'
      });
    }
  };

  const handleReorderCategories = async (reorderedCategories: any[]) => {
    if (!selectedWorld) return;
    
    try {
      await updateCategoryOrder(reorderedCategories);
      const updatedWorld = {
        ...selectedWorld,
        categories: reorderedCategories
      };
      
      setWorlds(worlds.map(w => w.id === updatedWorld.id ? updatedWorld : w));
    } catch (error) {
      console.error('Error reordering categories:', error);
      toast({
        title: 'Fehler',
        description: 'Die Reihenfolge konnte nicht gespeichert werden.',
        variant: 'destructive'
      });
    }
  };

  return {
    handleCategorySubmit,
    handleDeleteCategory,
    handleReorderCategories
  };
}
