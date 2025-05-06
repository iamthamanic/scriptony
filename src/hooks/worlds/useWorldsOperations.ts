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
  const [deleteCompletedAt, setDeleteCompletedAt] = useState<number | null>(null);
  
  // Load worlds
  const loadWorlds = async () => {
    // Don't reload immediately after deletion to prevent UI issues
    if (deleteCompletedAt && (Date.now() - deleteCompletedAt < 1500)) {
      return;
    }
    
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

  // Enhanced delete world operation with better state management and cooldown
  const handleDeleteWorld = useCallback(async (): Promise<void> => {
    if (!selectedWorld || isProcessing) return Promise.resolve();
    
    try {
      // Set processing flag first
      setIsProcessing(true);
      const worldName = selectedWorld.name;
      const worldId = selectedWorld.id;
      
      console.log('Starting deletion process for world:', selectedWorld.id);
      
      // 1. First, close the dialog - do this before other state changes
      setIsDeleteWorldDialogOpen(false);
      
      // 2. Brief pause to let the dialog close animation start
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 3. Clear selected world ID to return to worlds list
      setSelectedWorldId(null);
      
      // 4. Optimistic update (remove from list)
      const newWorlds = worlds.filter(w => w.id !== worldId);
      setWorlds(newWorlds);
      
      // 5. Show loading state
      setIsLoading(true);
      
      // 6. Small delay to allow UI updates to complete
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // 7. Perform actual deletion
      await deleteWorld(worldId);
      
      // 8. Set deletion timestamp to prevent immediate reloading
      setDeleteCompletedAt(Date.now());
      
      // 9. Wait briefly before showing success message
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // 10. Update isLoading state and show success message
      setIsLoading(false);
      
      toast({
        title: 'Welt gelöscht',
        description: `"${worldName}" wurde erfolgreich gelöscht.`
      });
      
      // 11. Final cleanup with delay
      setTimeout(() => {
        setIsProcessing(false);
      }, 300);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error in handleDeleteWorld:', error);
      
      // Show error state but don't close loading
      toast({
        title: 'Fehler beim Löschen',
        description: error instanceof Error ? error.message : 'Es ist ein Fehler aufgetreten',
        variant: 'destructive'
      });
      
      // Reload worlds and reset state
      try {
        const worldsData = await fetchUserWorlds();
        setWorlds(worldsData);
      } catch (e) {
        console.error('Failed to reload worlds after error:', e);
      }
      
      // Reset states with delay
      setTimeout(() => {
        setIsLoading(false);
        setIsProcessing(false);
        setIsDeleteWorldDialogOpen(false);
      }, 800);
      
      return Promise.reject(error);
    }
  }, [selectedWorld, worlds, setWorlds, setSelectedWorldId, toast, setIsDeleteWorldDialogOpen, isProcessing, setIsLoading]);

  return {
    loadWorlds,
    handleCreateWorld,
    handleUpdateWorld,
    handleDeleteWorld
  };
}
