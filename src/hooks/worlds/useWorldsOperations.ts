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
import { useState, useCallback, useRef } from "react";

// Deletion states to clearly manage the process
type DeletionState = 'idle' | 'starting' | 'processing' | 'completed' | 'error';

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
  const [deletionState, setDeletionState] = useState<DeletionState>('idle');
  const deleteCompletedAtRef = useRef<number | null>(null);
  const lastOperationTimestampRef = useRef<number | null>(null);
  
  // Load worlds with cooldown protection
  const loadWorlds = async () => {
    // Prevent loading immediately after deletion to avoid flicker
    if (deleteCompletedAtRef.current && (Date.now() - deleteCompletedAtRef.current < 1500)) {
      console.log("Skipping reload due to recent deletion");
      return;
    }
    
    // Rate limit operations to prevent UI thrashing
    const now = Date.now();
    if (lastOperationTimestampRef.current && (now - lastOperationTimestampRef.current < 500)) {
      console.log("Operation rate limited");
      return;
    }
    lastOperationTimestampRef.current = now;
    
    if (!userId) {
      setWorlds([]);
      setSelectedWorldId(null);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const worldsData = await fetchUserWorlds();
      
      // Add small delay before updating state to ensure smooth UI updates
      await new Promise(resolve => setTimeout(resolve, 100));
      setWorlds(worldsData);
      
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
        duration: 3000 // Shorter toast duration
      });
    } finally {
      // Ensure loading state is eventually cleared
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
        duration: 3000 
      });
    } catch (error) {
      console.error('Error creating world:', error);
      toast({
        title: 'Fehler',
        description: 'Die Welt konnte nicht erstellt werden.',
        variant: 'destructive',
        duration: 3000 
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
        duration: 3000 
      });
    } catch (error) {
      console.error('Error updating world:', error);
      toast({
        title: 'Fehler',
        description: 'Die Welt konnte nicht aktualisiert werden.',
        variant: 'destructive',
        duration: 3000
      });
    }
  };

  // Significantly improved delete world operation with state machine approach
  const handleDeleteWorld = useCallback(async (): Promise<void> => {
    // Block if already processing or no world selected
    if (!selectedWorld || deletionState !== 'idle') {
      console.log("Delete operation blocked - state:", deletionState);
      return Promise.resolve();
    }
    
    try {
      // 1. Track world details before deletion
      const worldName = selectedWorld.name;
      const worldId = selectedWorld.id;
      
      console.log('Starting deletion process for world:', worldId);
      setDeletionState('starting');
      
      // 2. Update UI state immediately (optimistic update)
      setDeletionState('processing');
      
      // 3. Clear selected world ID to return to worlds list (before API call)
      setSelectedWorldId(null);
      
      // 4. Remove from worlds list (optimistic update)
      const newWorlds = worlds.filter(w => w.id !== worldId);
      setWorlds(newWorlds);
      
      // 5. Show loading state
      setIsLoading(true);
      
      // 6. Brief delay to ensure UI updates have propagated
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // 7. Perform actual deletion in the background
      const deletionPromise = deleteWorld(worldId);
      
      // 8. Record completion timestamp
      const completionTimestamp = Date.now();
      deleteCompletedAtRef.current = completionTimestamp;
      
      // 9. Update deletion state
      setDeletionState('completed');
      
      // 10. Add UI cooldown period and show success message
      toast({
        title: 'Welt gelöscht',
        description: `"${worldName}" wurde erfolgreich gelöscht.`,
        duration: 3000
      });
      
      // 11. Update loading state
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
      // 12. Reset deletion state after cooldown
      setTimeout(() => {
        // Only reset if this is still the most recent deletion
        if (deleteCompletedAtRef.current === completionTimestamp) {
          setDeletionState('idle');
        }
      }, 1500);
      
      // 13. Actually wait for the deletion to complete
      await deletionPromise;
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error in handleDeleteWorld:', error);
      setDeletionState('error');
      
      // Show error message with reduced duration
      toast({
        title: 'Fehler beim Löschen',
        description: error instanceof Error ? error.message : 'Es ist ein Fehler aufgetreten',
        variant: 'destructive',
        duration: 3000
      });
      
      // Reload worlds to reset state
      try {
        setIsLoading(true);
        const worldsData = await fetchUserWorlds();
        setWorlds(worldsData);
        setIsLoading(false);
      } catch (e) {
        console.error('Failed to reload worlds after error:', e);
        setIsLoading(false);
      }
      
      // Reset deletion state after error
      setTimeout(() => {
        setDeletionState('idle');
      }, 1000);
      
      return Promise.reject(error);
    }
  }, [selectedWorld, worlds, setWorlds, setSelectedWorldId, toast, setIsLoading, deletionState]);

  return {
    loadWorlds,
    handleCreateWorld,
    handleUpdateWorld,
    handleDeleteWorld,
    deletionState
  };
}
