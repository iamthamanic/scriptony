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
        variant: 'destructive',
        duration: 5000 // Set reasonable toast duration
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
        description: `"${data.name}" wurde erfolgreich erstellt.`,
        duration: 3000 // Set reasonable toast duration
      });
    } catch (error) {
      console.error('Error creating world:', error);
      toast({
        title: 'Fehler',
        description: 'Die Welt konnte nicht erstellt werden.',
        variant: 'destructive',
        duration: 5000 // Set reasonable toast duration
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
        description: `"${data.name}" wurde erfolgreich aktualisiert.`,
        duration: 3000 // Set reasonable toast duration
      });
    } catch (error) {
      console.error('Error updating world:', error);
      toast({
        title: 'Fehler',
        description: 'Die Welt konnte nicht aktualisiert werden.',
        variant: 'destructive',
        duration: 5000 // Set reasonable toast duration
      });
    }
  };

  // Enhanced delete world operation with simplified state management
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
      
      // 2. Clear selected world ID to return to worlds list
      setSelectedWorldId(null);
      
      // 3. Optimistic update (remove from list)
      const newWorlds = worlds.filter(w => w.id !== worldId);
      setWorlds(newWorlds);
      
      // 4. Show loading state
      setIsLoading(true);
      
      // 5. Perform actual deletion
      await deleteWorld(worldId);
      
      // 6. Set deletion timestamp to prevent immediate reloading
      setDeleteCompletedAt(Date.now());
      
      // 7. Update isLoading state
      setIsLoading(false);
      
      // 8. Show success message
      toast({
        title: 'Welt gelöscht',
        description: `"${worldName}" wurde erfolgreich gelöscht.`,
        duration: 3000 // Set reasonable toast duration
      });
      
      // 9. Reset processing state after a short delay
      setTimeout(() => {
        setIsProcessing(false);
      }, 300);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error in handleDeleteWorld:', error);
      
      // Show error message
      toast({
        title: 'Fehler beim Löschen',
        description: error instanceof Error ? error.message : 'Es ist ein Fehler aufgetreten',
        variant: 'destructive',
        duration: 5000 // Set reasonable toast duration
      });
      
      // Reload worlds and reset state
      try {
        const worldsData = await fetchUserWorlds();
        setWorlds(worldsData);
      } catch (e) {
        console.error('Failed to reload worlds after error:', e);
      }
      
      // Reset states
      setIsLoading(false);
      setIsProcessing(false);
      
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
