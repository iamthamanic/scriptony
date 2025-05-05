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
    
    // Ensure we have the expected structure based on category type
    switch (type) {
      case 'geography':
        return {
          countries: Array.isArray((existingContent as any)?.countries) ? 
            (existingContent as any).countries : []
        } as Json;
      
      case 'politics':
        return {
          systems: Array.isArray((existingContent as any)?.systems) ? 
            (existingContent as any).systems : []
        } as Json;
      
      case 'economy':
        return {
          entities: Array.isArray((existingContent as any)?.entities) ? 
            (existingContent as any).entities : []
        } as Json;
      
      case 'society':
        return {
          groups: Array.isArray((existingContent as any)?.groups) ? 
            (existingContent as any).groups : []
        } as Json;
      
      case 'culture':
        return {
          elements: Array.isArray((existingContent as any)?.elements) ? 
            (existingContent as any).elements : []
        } as Json;
      
      default:
        // For custom or other categories, just keep what we have
        return existingContent;
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
        
        // For existing categories with type change, initialize new structure
        if (selectedCategory.type !== data.type) {
          console.log("Category type changed from", selectedCategory.type, "to", data.type);
          data.content = getEmptyCategoryContent(data.type);
        } else {
          // Preserve existing content structure if type hasn't changed
          data.content = ensureContentStructure(data.type, data.content as Json);
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
