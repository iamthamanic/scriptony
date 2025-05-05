
import { World, WorldCategory } from "@/types";
import { useCategoryMutations } from "./categories/useCategoryMutations";

export function useCategoryOperations(
  worlds: World[],
  setWorlds: (worlds: World[]) => void,
  selectedWorld: World | null,
  setSelectedCategory: (category: WorldCategory | null) => void,
  setIsCategoryModalOpen: (open: boolean) => void
) {
  // Use our new refactored hooks
  const categoryMutations = useCategoryMutations({
    worlds,
    setWorlds,
    selectedWorld,
    setSelectedCategory,
    setIsCategoryModalOpen
  });

  return {
    // Export all operations from our hooks
    ...categoryMutations
  };
}
