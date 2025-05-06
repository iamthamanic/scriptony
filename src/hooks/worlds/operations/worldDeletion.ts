
import { useState, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteWorld } from "@/services/worlds";
import { World } from "@/types";
import { fetchUserWorlds } from "@/services/worlds";

// Deletion states to clearly manage the process
export type DeletionState = 'idle' | 'starting' | 'processing' | 'completed' | 'error';

export function useWorldDeletion(
  worlds: World[],
  setWorlds: (worlds: World[]) => void,
  setSelectedWorldId: (id: string | null) => void,
  setIsLoading: (loading: boolean) => void,
) {
  const { toast } = useToast();
  const [deletionState, setDeletionState] = useState<DeletionState>('idle');
  const deleteCompletedAtRef = useRef<number | null>(null);
  
  // Significantly improved delete world operation with state machine approach
  const handleDeleteWorld = useCallback(async (selectedWorld: World | null): Promise<void> => {
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
  }, [worlds, setWorlds, setSelectedWorldId, toast, setIsLoading, deletionState]);

  return {
    handleDeleteWorld,
    deletionState
  };
}
