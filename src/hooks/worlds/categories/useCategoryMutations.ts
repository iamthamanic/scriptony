
import { useToast } from "@/hooks/use-toast";
import { World, WorldCategory, WorldCategoryFormData, getEmptyCategoryContent } from "@/types/worlds";
import { createWorldCategory, updateWorldCategory, deleteWorldCategory, updateCategoryOrder } from "@/services/worlds";
import { useCategoryHelpers } from "./useCategoryHelpers";
import { Json } from "@/integrations/supabase/types";

interface UseCategoryMutationsProps {
  worlds: World[];
  setWorlds: (worlds: World[]) => void;
  selectedWorld: World | null;
  setSelectedCategory: (category: WorldCategory | null) => void;
  setIsCategoryModalOpen: (open: boolean) => void;
}

export function useCategoryMutations({
  worlds,
  setWorlds,
  selectedWorld,
  setSelectedCategory,
  setIsCategoryModalOpen
}: UseCategoryMutationsProps) {
  const { toast } = useToast();
  const { ensureContentStructure } = useCategoryHelpers();

  // Create or update a category
  const handleCategorySubmit = async (data: WorldCategoryFormData) => {
    if (!selectedWorld) return;
    
    try {
      const selectedCategory = selectedWorld.categories.find((c: WorldCategory) => 
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
          categories: selectedWorld.categories.map((c: WorldCategory) => 
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

  // Delete a category
  const handleDeleteCategory = async (categoryId: string) => {
    if (!selectedWorld) return;
    
    try {
      await deleteWorldCategory(categoryId);
      const updatedWorld = {
        ...selectedWorld,
        categories: selectedWorld.categories.filter((c: WorldCategory) => c.id !== categoryId)
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

  // Reorder categories
  const handleReorderCategories = async (reorderedCategories: WorldCategory[]) => {
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
