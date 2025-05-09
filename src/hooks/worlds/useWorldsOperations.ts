
import { useState } from "react";
import { NewWorldFormData } from "@/types";
import { 
  useWorldCreation,
  useWorldDeletion, 
  useWorldLoading, 
  useWorldUpdate,
  useWorldDuplicate
} from "./operations";

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
  setSelectedCategory: (category: any) => void,
  hasLoadedOnce: boolean = false,
  setHasLoadedOnce: (loaded: boolean) => void = () => {}
) {
  // Use our refactored hooks
  const { loadWorlds, setDeleteCompletedAt } = useWorldLoading(
    userId,
    setWorlds,
    selectedWorldId, 
    setSelectedWorldId,
    setIsLoading,
    hasLoadedOnce,
    setHasLoadedOnce
  );

  const { handleCreateWorld } = useWorldCreation(
    worlds,
    setWorlds,
    setSelectedWorldId,
    setIsNewWorldModalOpen
  );
  
  const { handleUpdateWorld } = useWorldUpdate(
    worlds,
    setWorlds,
    setIsEditWorldModalOpen
  );
  
  const { handleDeleteWorld, deletionState } = useWorldDeletion(
    worlds,
    setWorlds,
    setSelectedWorldId,
    setIsLoading
  );

  const { handleDuplicateWorld } = useWorldDuplicate(
    worlds,
    setWorlds,
    setSelectedWorldId
  );

  // Create wrappers with improved error handling
  const wrappedHandleUpdateWorld = (data: NewWorldFormData) => {
    return handleUpdateWorld(selectedWorld, data);
  };
  
  const wrappedHandleDeleteWorld = async () => {
    try {
      // Close the dialog when delete operation completes
      const result = await handleDeleteWorld(selectedWorld);
      
      // Mark deletion completion time for reload throttling
      if (deletionState === 'completed') {
        console.log('Setting deletion completed timestamp');
        setDeleteCompletedAt(Date.now());
        
        // Close the delete dialog when deletion completes
        setIsDeleteWorldDialogOpen(false);
      }
      
      return result;
    } catch (error) {
      console.error("Wrapped delete world error:", error);
      return Promise.reject(error);
    }
  };

  const wrappedHandleDuplicateWorld = async () => {
    return handleDuplicateWorld(selectedWorld);
  };

  return {
    loadWorlds,
    handleCreateWorld,
    handleUpdateWorld: wrappedHandleUpdateWorld,
    handleDeleteWorld: wrappedHandleDeleteWorld,
    handleDuplicateWorld: wrappedHandleDuplicateWorld,
    deletionState
  };
}
