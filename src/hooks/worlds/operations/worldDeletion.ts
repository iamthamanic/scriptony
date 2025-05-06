
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
  const operationInProgressRef = useRef<boolean>(false);
  
  // Significantly improved delete world operation with sequential state updates
  const handleDeleteWorld = useCallback(async (selectedWorld: World | null): Promise<void> => {
    // Block if already processing or no world selected
    if (!selectedWorld || deletionState !== 'idle' || operationInProgressRef.current) {
      console.log("Delete operation blocked - state:", deletionState, "operation in progress:", operationInProgressRef.current);
      return Promise.resolve();
    }
    
    try {
      // Set operation in progress flag
      operationInProgressRef.current = true;
      
      // 1. Track world details before deletion
      const worldName = selectedWorld.name;
      const worldId = selectedWorld.id;
      
      console.log('Starting deletion process for world:', worldId);
      setDeletionState('starting');
      
      // 2. Clear selected world ID to return to worlds list (before API call)
      setSelectedWorldId(null);
      
      // 3. Brief delay to ensure UI updates
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // 4. Update UI state 
      setDeletionState('processing');
      
      // 5. Remove from worlds list (optimistic update)
      const newWorlds = worlds.filter(w => w.id !== worldId);
      setWorlds(newWorlds);
      
      // 6. Show loading state
      setIsLoading(true);
      
      // 7. Another brief delay to ensure UI updates have propagated
      await new Promise(resolve => setTimeout(resolve, 50));
      
      try {
        // 8. Perform actual deletion
        await deleteWorld(worldId);
        
        // 9. Record completion timestamp
        const completionTimestamp = Date.now();
        deleteCompletedAtRef.current = completionTimestamp;
        
        // 10. Update deletion state
        setDeletionState('completed');
        
        // 11. Show success message
        toast({
          title: 'Welt gelöscht',
          description: `"${worldName}" wurde erfolgreich gelöscht.`,
          duration: 3000
        });
        
        // 12. Reset loading state after a brief delay
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
        
        // 13. Reset deletion state after cooldown
        setTimeout(() => {
          // Only reset if this is still the most recent deletion
          if (deleteCompletedAtRef.current === completionTimestamp) {
            setDeletionState('idle');
          }
          
          // Clear the operation flag
          operationInProgressRef.current = false;
        }, 1000);
        
      } catch (deleteError) {
        // Handle API delete error
        console.error('Error in actual deletion API call:', deleteError);
        
        // Update state to error
        setDeletionState('error');
        
        // Show error message
        toast({
          title: 'Fehler beim Löschen',
          description: deleteError instanceof Error ? deleteError.message : 'Es ist ein Fehler aufgetreten',
          variant: 'destructive',
          duration: 3000
        });
        
        // Reload worlds to reset state
        try {
          const worldsData = await fetchUserWorlds();
          setWorlds(worldsData);
        } catch (reloadError) {
          console.error('Failed to reload worlds after error:', reloadError);
        }
        
        // Reset loading and operation flags
        setIsLoading(false);
        
        // Reset deletion state after error with a delay
        setTimeout(() => {
          setDeletionState('idle');
          operationInProgressRef.current = false;
        }, 500);
        
        return Promise.reject(deleteError);
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error in handleDeleteWorld:', error);
      setDeletionState('error');
      operationInProgressRef.current = false;
      
      // Show error message with reduced duration
      toast({
        title: 'Fehler beim Löschen',
        description: error instanceof Error ? error.message : 'Es ist ein Fehler aufgetreten',
        variant: 'destructive',
        duration: 3000
      });
      
      // Ensure loading is reset
      setIsLoading(false);
      
      // Reset deletion state after error
      setTimeout(() => {
        setDeletionState('idle');
      }, 500);
      
      return Promise.reject(error);
    }
  }, [worlds, setWorlds, setSelectedWorldId, toast, setIsLoading, deletionState]);

  return {
    handleDeleteWorld,
    deletionState
  };
}
