
import { useState } from 'react';
import { World, WorldCategory } from "@/types";

export function useWorldsCore(userId: string | undefined) {
  // Initialize isLoading to false if there's no userId
  const [worlds, setWorlds] = useState<World[]>([]);
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!!userId);

  // Modal states
  const [isNewWorldModalOpen, setIsNewWorldModalOpen] = useState(false);
  const [isEditWorldModalOpen, setIsEditWorldModalOpen] = useState(false);
  const [isDeleteWorldDialogOpen, setIsDeleteWorldDialogOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<WorldCategory | null>(null);

  const selectedWorld = selectedWorldId ? worlds.find(w => w.id === selectedWorldId) : null;

  return {
    worlds,
    setWorlds,
    selectedWorld,
    selectedWorldId,
    isLoading,
    setIsLoading,
    isNewWorldModalOpen,
    isEditWorldModalOpen,
    isDeleteWorldDialogOpen,
    isCategoryModalOpen,
    selectedCategory,
    setSelectedWorldId,
    setIsNewWorldModalOpen,
    setIsEditWorldModalOpen, 
    setIsDeleteWorldDialogOpen,
    setIsCategoryModalOpen,
    setSelectedCategory
  };
}
