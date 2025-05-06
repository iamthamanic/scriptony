import { useToast } from "@/hooks/use-toast";
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
import { NewWorldFormData, WorldCategoryFormData } from "@/types";
import { isDevelopmentMode } from "@/utils/devMode";

export function useWorldsOperations(
  userId: string | undefined,
  worlds: any[],
  setWorlds: (worlds: any[]) => void,
  selectedWorldId: string | null,
  selectedWorld: any,
  setIsLoading: (loading: boolean) => void,
  setSelectedWorldId: (id: string | null) => void,
  setIsNewWorldModalOpen: (open: boolean) => void,
  setIsEditWorldModalOpen: (open: boolean) => void,
  setIsDeleteWorldDialogOpen: (open: boolean) => void,
  setIsCategoryModalOpen: (open: boolean) => void,
  setSelectedCategory: (category: any) => void
) {
  const { toast } = useToast();
  
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
      
      // Remove auto-selection of the first world to show the worlds list instead
      if (selectedWorldId && worldsData.some(w => w.id === selectedWorldId)) {
        // Keep selected world if it exists in the loaded worlds
        setSelectedWorldId(selectedWorldId);
      } else {
        // Clear selection to show the worlds list
        setSelectedWorldId(null);
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

  // World operations
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

  const handleDeleteWorld = async (): Promise<void> => {
    if (!selectedWorld) return Promise.resolve();
    
    try {
      const isDevMode = isDevelopmentMode();
      console.log('Starting deletion process for world:', selectedWorld.id, 
                  'Development mode:', isDevMode ? 'YES' : 'NO');
      
      // Store world name and ID before deletion for toast message
      const worldName = selectedWorld.name;
      const worldId = selectedWorld.id;
      
      // The actual deletion process in the service now handles dev mode headers
      await deleteWorld(worldId);
      
      console.log('World deletion successful, updating local state');
      
      // Update local state first before closing dialog
      const newWorlds = worlds.filter(w => w.id !== worldId);
      setWorlds(newWorlds);
      setSelectedWorldId(null); // Always return to worlds list after deletion
      
      // Close the dialog last - this prevents UI from freezing
      // Use a small delay to ensure React has processed the state updates
      setTimeout(() => {
        setIsDeleteWorldDialogOpen(false);
        
        // Show success toast after all UI operations are complete
        toast({
          title: 'Welt gelöscht',
          description: `"${worldName}" wurde erfolgreich gelöscht.`
        });
      }, 50); // A very small delay to ensure state updates are processed
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error in handleDeleteWorld:', error);
      // Let the error propagate to the DeleteWorldDialog component
      return Promise.reject(error);
    }
  };

  return {
    loadWorlds,
    handleCreateWorld,
    handleUpdateWorld,
    handleDeleteWorld
  };
}
