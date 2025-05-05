import { useToast } from "@/hooks/use-toast";
import { 
  createWorldCategory, 
  updateWorldCategory, 
  deleteWorldCategory,
  updateCategoryOrder
} from "@/services/worlds";
import { WorldCategoryFormData, getEmptyCategoryContent } from "@/types/worlds";

export function useCategoryOperations(
  worlds: any[],
  setWorlds: (worlds: any[]) => void,
  selectedWorld: any,
  setSelectedCategory: (category: any) => void,
  setIsCategoryModalOpen: (open: boolean) => void
) {
  const { toast } = useToast();

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
        // For existing categories, make sure we preserve existing content structure
        if (selectedCategory.type === data.type) {
          // Keep existing content structure if type hasn't changed
          const existingContent = selectedCategory.content || getEmptyCategoryContent(data.type);
          
          // Safely merge content based on category type
          switch (data.type) {
            case 'geography':
              data.content = { 
                countries: existingContent && Array.isArray(existingContent.countries) ? 
                  [...existingContent.countries] : []
              };
              break;
              
            case 'politics':
              data.content = { 
                systems: existingContent && Array.isArray(existingContent.systems) ? 
                  [...existingContent.systems] : []
              };
              break;
              
            case 'economy':
              data.content = { 
                entities: existingContent && Array.isArray(existingContent.entities) ? 
                  [...existingContent.entities] : []
              };
              break;
              
            case 'society':
              data.content = { 
                groups: existingContent && Array.isArray(existingContent.groups) ? 
                  [...existingContent.groups] : []
              };
              break;
              
            case 'culture':
              data.content = { 
                elements: existingContent && Array.isArray(existingContent.elements) ? 
                  [...existingContent.elements] : []
              };
              break;
              
            default:
              // For custom or other categories, just keep the existing content
              data.content = existingContent;
          }
        } else {
          // If type has changed, initialize with empty structure
          data.content = getEmptyCategoryContent(data.type);
        }
        
        // Update existing category
        const updatedCategory = await updateWorldCategory(selectedCategory.id, data);
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
        // Create new category
        const newCategory = await createWorldCategory(selectedWorld.id, data);
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
