
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { World, WorldCategory, NewWorldFormData, WorldCategoryFormData } from "@/types";
import { 
  fetchUserWorlds, 
  createWorld, 
  updateWorld, 
  deleteWorld, 
  createWorldCategory, 
  updateWorldCategory, 
  deleteWorldCategory,
  updateCategoryOrder
} from "@/services/worlds";

export function useWorldsState(userId: string | undefined) {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Modal states
  const [isNewWorldModalOpen, setIsNewWorldModalOpen] = useState(false);
  const [isEditWorldModalOpen, setIsEditWorldModalOpen] = useState(false);
  const [isDeleteWorldDialogOpen, setIsDeleteWorldDialogOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<WorldCategory | null>(null);

  const selectedWorld = selectedWorldId ? worlds.find(w => w.id === selectedWorldId) : null;

  // Load worlds
  const loadWorlds = async () => {
    if (!userId) {
      setWorlds([]);
      setSelectedWorldId(null);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const worldsData = await fetchUserWorlds();
      setWorlds(worldsData);
      if (worldsData.length > 0 && !selectedWorldId) {
        setSelectedWorldId(worldsData[0].id);
      }
    } catch (error) {
      console.error('Error loading worlds:', error);
      toast({
        title: 'Fehler beim Laden',
        description: 'Welten konnten nicht geladen werden.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // World operations handlers
  const handleCreateWorld = async (data: NewWorldFormData) => {
    try {
      const newWorld = await createWorld(data);
      setWorlds([newWorld, ...worlds]);
      setSelectedWorldId(newWorld.id);
      setIsNewWorldModalOpen(false);
      
      toast({
        title: 'Welt erstellt',
        description: `"${data.name}" wurde erfolgreich erstellt.`
      });
    } catch (error) {
      console.error('Error creating world:', error);
      toast({
        title: 'Fehler',
        description: 'Die Welt konnte nicht erstellt werden.',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateWorld = async (data: NewWorldFormData) => {
    if (!selectedWorld) return;
    
    try {
      const updatedWorld = await updateWorld(selectedWorld.id, data);
      setWorlds(worlds.map(w => w.id === updatedWorld.id ? updatedWorld : w));
      setIsEditWorldModalOpen(false);
      
      toast({
        title: 'Welt aktualisiert',
        description: `"${data.name}" wurde erfolgreich aktualisiert.`
      });
    } catch (error) {
      console.error('Error updating world:', error);
      toast({
        title: 'Fehler',
        description: 'Die Welt konnte nicht aktualisiert werden.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteWorld = async () => {
    if (!selectedWorld) return;
    
    try {
      await deleteWorld(selectedWorld.id);
      const newWorlds = worlds.filter(w => w.id !== selectedWorld.id);
      setWorlds(newWorlds);
      setSelectedWorldId(newWorlds.length > 0 ? newWorlds[0].id : null);
      setIsDeleteWorldDialogOpen(false);
      
      toast({
        title: 'Welt gelöscht',
        description: `"${selectedWorld.name}" wurde erfolgreich gelöscht.`
      });
    } catch (error) {
      console.error('Error deleting world:', error);
      toast({
        title: 'Fehler',
        description: 'Die Welt konnte nicht gelöscht werden.',
        variant: 'destructive'
      });
    }
  };

  // Category operations handlers
  const handleCategorySubmit = async (data: WorldCategoryFormData) => {
    if (!selectedWorld) return;
    
    try {
      if (selectedCategory) {
        // Update existing category
        const updatedCategory = await updateWorldCategory(selectedCategory.id, data);
        const updatedWorld = {
          ...selectedWorld,
          categories: selectedWorld.categories.map(c => 
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
        categories: selectedWorld.categories.filter(c => c.id !== categoryId)
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
    worlds,
    selectedWorld,
    selectedWorldId,
    isLoading,
    isNewWorldModalOpen,
    isEditWorldModalOpen,
    isDeleteWorldDialogOpen,
    isCategoryModalOpen,
    selectedCategory,
    loadWorlds,
    setSelectedWorldId,
    setIsNewWorldModalOpen,
    setIsEditWorldModalOpen, 
    setIsDeleteWorldDialogOpen,
    setIsCategoryModalOpen,
    setSelectedCategory,
    handleCreateWorld,
    handleUpdateWorld,
    handleDeleteWorld,
    handleCategorySubmit,
    handleDeleteCategory,
    handleReorderCategories
  };
}
