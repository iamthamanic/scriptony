
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
  setSelectedCategory: (category: any) => void
) {
  // Use our refactored hooks
  const { loadWorlds, setDeleteCompletedAt } = useWorldLoading(
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

  const { handleDuplicateWorld } = useWorldDuplicate(
    worlds,
    setWorlds,
    setSelectedWorldId
  );

  // Create wrappers to maintain the same API with safer operation handling
  const wrappedHandleUpdateWorld = (data: NewWorldFormData) => {
    return handleUpdateWorld(selectedWorld, data);
  };
  
  const wrappedHandleDeleteWorld = async () => {
    try {
      // Dialog'u kapattıktan sonra bu işlemi gerçekleştireceğimiz için
      // setIsDeleteWorldDialogOpen(false); burada çağrılmaz

      // Silme işlemini başlat
      const result = await handleDeleteWorld(selectedWorld);
      
      // Silme işlemi tamamlandıktan sonra dialog'u kapat
      setTimeout(() => {
        setIsDeleteWorldDialogOpen(false);
      }, 100);
      
      // Silme işlemi tamamlandı zaman damgasını kaydet
      setDeleteCompletedAt(Date.now());
      
      return result;
    } catch (error) {
      console.error("Wrapped delete world error:", error);
      // Hata durumunda yine de dialog'u kapatmaya çalış
      setIsDeleteWorldDialogOpen(false);
      throw error;
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
