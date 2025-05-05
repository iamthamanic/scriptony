
import { useWorldsCore } from './worlds/useWorldsCore';
import { useWorldsOperations } from './worlds/useWorldsOperations';
import { useCategoryOperations } from './worlds/useCategoryOperations';

export function useWorldsState(userId: string | undefined) {
  const core = useWorldsCore(userId);
  
  const operations = useWorldsOperations(
    userId,
    core.worlds,
    core.setWorlds,
    core.selectedWorldId,
    core.selectedWorld,
    core.setIsLoading,
    core.setSelectedWorldId,
    core.setIsNewWorldModalOpen,
    core.setIsEditWorldModalOpen,
    core.setIsDeleteWorldDialogOpen,
    core.setIsCategoryModalOpen,
    core.setSelectedCategory
  );
  
  const categoryOps = useCategoryOperations(
    core.worlds,
    core.setWorlds,
    core.selectedWorld,
    core.setSelectedCategory,
    core.setIsCategoryModalOpen
  );

  return {
    ...core,
    ...operations,
    ...categoryOps
  };
}
