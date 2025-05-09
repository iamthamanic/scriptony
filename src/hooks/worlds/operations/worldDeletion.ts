
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
  
  const handleDeleteWorld = useCallback(async (selectedWorld: World | null): Promise<void> => {
    // Prevent deletion if no world is selected or deletion is already in progress
    if (!selectedWorld || deletionState === 'deleting') {
      console.log("Delete operation rejected - state:", deletionState, "world:", selectedWorld?.id);
      return Promise.resolve();
    }
    
    try {
      // Set deletion state first to prevent concurrent operations
      setDeletionState('deleting');
      
      // Save world name and ID for later
      const worldName = selectedWorld.name;
      const worldId = selectedWorld.id;
      
      console.log('Delete operation started:', worldId);
      
      // Apply loading state for UI feedback
      setIsLoading(true);
      
      // Perform actual deletion in backend
      await deleteWorld(worldId);
      
      console.log('Backend delete completed, updating UI...');
      
      // Update local state (optimistic UI update)
      const newWorlds = worlds.filter(w => w.id !== worldId);
      setWorlds(newWorlds);
      
      // Clear selection to prevent references to deleted world
      setSelectedWorldId(null);
      
      // Update to success state
      setDeletionState('completed');
      
      // Show success message
      toast({
        title: 'Dünya silindi',
        description: `"${worldName}" dünyası başarıyla silindi.`,
        duration: 3000
      });
      
      console.log('World deletion completed successfully');
      
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
      
      return Promise.reject(error);
    } finally {
      // Always ensure loading state is cleared
      setTimeout(() => {
        setIsLoading(false);
        
        // Reset deletion state after a small delay
        setTimeout(() => {
          if (deletionState !== 'deleting') {
            setDeletionState('idle');
          }
        }, 250);
      }, 300);
    }
  }, [worlds, setWorlds, setSelectedWorldId, toast, setIsLoading, deletionState]);

  return {
    handleDeleteWorld,
    deletionState
  };
}
