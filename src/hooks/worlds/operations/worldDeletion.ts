
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteWorld } from "@/services/worlds";
import { World } from "@/types";

// Simplified deletion states
export type DeletionState = 'idle' | 'deleting' | 'completed' | 'error';

export function useWorldDeletion(
  worlds: World[],
  setWorlds: (worlds: World[]) => void,
  setSelectedWorldId: (id: string | null) => void,
  setIsLoading: (loading: boolean) => void,
) {
  const { toast } = useToast();
  const [deletionState, setDeletionState] = useState<DeletionState>('idle');
  
  // Simplified and flattened world deletion function
  const handleDeleteWorld = useCallback(async (selectedWorld: World | null): Promise<void> => {
    // Prevent deletion if no world is selected or deletion is already in progress
    if (!selectedWorld || deletionState === 'deleting') {
      console.log("Delete operation rejected - state:", deletionState, "world:", selectedWorld?.id);
      return Promise.resolve();
    }
    
    try {
      // 1. Update deletion state
      setDeletionState('deleting');
      
      // 2. Save world name and ID for later
      const worldName = selectedWorld.name;
      const worldId = selectedWorld.id;
      
      console.log('Delete operation started:', worldId);
      
      // 3. Set loading state - this should happen early
      setIsLoading(true);
      
      // 4. Perform actual deletion (backend operation first)
      await deleteWorld(worldId);
      
      // 5. Optimistic UI update - remove world from list
      const newWorlds = worlds.filter(w => w.id !== worldId);
      setWorlds(newWorlds);
      
      // 6. Take user back to the world list
      setSelectedWorldId(null);
      
      // 7. Update success state
      setDeletionState('completed');
      
      // 8. Show success message
      toast({
        title: 'Dünya silindi',
        description: `"${worldName}" dünyası başarıyla silindi.`,
        duration: 3000
      });
      
      // 9. Turn off loading state
      setIsLoading(false);
      
      // 10. Reset deletion state after completion
      setTimeout(() => {
        setDeletionState('idle');
      }, 100);
      
      return Promise.resolve();
      
    } catch (error) {
      console.error('Error deleting world:', error);
      
      // Update error state
      setDeletionState('error');
      
      // Show error message
      toast({
        title: 'Silme hatası',
        description: error instanceof Error ? error.message : 'Dünya silinirken bir hata oluştu',
        variant: 'destructive',
        duration: 3000
      });
      
      // Turn off loading state
      setIsLoading(false);
      
      // Reset deletion state after error
      setTimeout(() => {
        setDeletionState('idle');
      }, 100);
      
      return Promise.reject(error);
    }
  }, [worlds, setWorlds, setSelectedWorldId, toast, setIsLoading, deletionState]);

  return {
    handleDeleteWorld,
    deletionState
  };
}
