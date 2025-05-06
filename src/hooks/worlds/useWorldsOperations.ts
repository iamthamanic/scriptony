
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
import { useState, useCallback } from "react";

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
  const [isProcessing, setIsProcessing] = useState(false);
  
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

  // Enhanced delete world operation with better state management
  const handleDeleteWorld = useCallback(async (): Promise<void> => {
    if (!selectedWorld || isProcessing) return Promise.resolve();
    
    try {
      setIsProcessing(true);
      const isDevMode = isDevelopmentMode();
      console.log('Starting deletion process for world:', selectedWorld.id, 
                  'Development mode:', isDevMode ? 'YES' : 'NO');
      
      // Store world name and ID before deletion for toast message
      const worldName = selectedWorld.name;
      const worldId = selectedWorld.id;
      
      // First, update local UI state to improve perceived performance
      // First, close the dialog to remove it from DOM
      setIsDeleteWorldDialogOpen(false);
      
      // Update the worlds state first (optimistic update)
      const newWorlds = worlds.filter(w => w.id !== worldId);
      
      // Clear selected world ID to return to worlds list
      // This needs to happen before the actual deletion to avoid UI freezes
      setSelectedWorldId(null);
      
      // Small delay to let React process these UI updates
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Now perform the actual deletion
      await deleteWorld(worldId);
      
      console.log('World deletion completed successfully, updating final state');
      
      // Now update the worlds list 
      setWorlds(newWorlds);
      
      // Show success toast after all operations complete
      setTimeout(() => {
        toast({
          title: 'Welt gelöscht',
          description: `"${worldName}" wurde erfolgreich gelöscht.`
        });
        
        // Final cleanup
        setIsProcessing(false);
      }, 300);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error in handleDeleteWorld:', error);
      
      // Reset processing state
      setIsProcessing(false);
      
      // Make sure dialog is closed even on error
      setTimeout(() => {
        setIsDeleteWorldDialogOpen(false);
      }, 800);
      
      // Let the error propagate to the DeleteWorldDialog component
      return Promise.reject(error);
    }
  }, [selectedWorld, worlds, setWorlds, setSelectedWorldId, toast, setIsDeleteWorldDialogOpen, isProcessing]);

  return {
    loadWorlds,
    handleCreateWorld,
    handleUpdateWorld,
    handleDeleteWorld
  };
}
