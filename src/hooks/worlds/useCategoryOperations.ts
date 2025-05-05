
import { useToast } from "@/hooks/use-toast";
import { 
  createWorldCategory, 
  updateWorldCategory, 
  deleteWorldCategory,
  updateCategoryOrder
} from "@/services/worlds";
import { WorldCategoryFormData } from "@/types";

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
      
      // Ensure geography content has a proper structure
      if (data.type === 'geography' && (!data.content || typeof data.content !== 'object')) {
        data.content = { countries: [] };
      }
      
      if (selectedCategory) {
        // For geography type, make sure we don't lose existing countries when updating
        if (selectedCategory.type === 'geography' && data.type === 'geography') {
          const existingContent = selectedCategory.content || { countries: [] };
          // Fix: Ensure we're spreading an object, not potentially undefined or null
          data.content = { 
            countries: existingContent && existingContent.countries ? 
              [...existingContent.countries] : []
          };
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
