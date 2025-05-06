
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { NewWorldFormData } from "@/types";
import { 
  useWorldCreation,
  useWorldDeletion, 
  useWorldLoading, 
  useWorldUpdate
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
  setSelectedCategory: (category: any) => void
) {
  // Use our refactored hooks
  const { loadWorlds } = useWorldLoading(
    userId,
    setWorlds,
    selectedWorldId, 
    setSelectedWorldId,
    setIsLoading
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

  // Create wrappers to maintain the same API
  const wrappedHandleUpdateWorld = (data: NewWorldFormData) => {
    return handleUpdateWorld(selectedWorld, data);
  };
  
  const wrappedHandleDeleteWorld = async () => {
    return handleDeleteWorld(selectedWorld);
  };

  return {
    loadWorlds,
    handleCreateWorld,
    handleUpdateWorld: wrappedHandleUpdateWorld,
    handleDeleteWorld: wrappedHandleDeleteWorld,
    deletionState
  };
}
