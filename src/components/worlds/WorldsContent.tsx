
import React from 'react';
import { Loader2 } from "lucide-react";
import WorldsList from "./WorldsList";
import WorldDetail from "./WorldDetail";
import { World, WorldCategory } from "@/types";

interface WorldsContentProps {
  isLoading: boolean;
  worlds: World[];
  selectedWorld: World | null;
  onSelectWorld: (worldId: string) => void;
  onNewWorld: () => void;
  onEditWorld: () => void;
  onDeleteWorld: () => void;
  onAddCategory: () => void;
  onEditCategory: (category: WorldCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
  onReorderCategories: (categories: WorldCategory[]) => void;
}

const WorldsContent = ({
  isLoading,
  worlds,
  selectedWorld,
  onSelectWorld,
  onNewWorld,
  onEditWorld,
  onDeleteWorld,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onReorderCategories
}: WorldsContentProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-anime-purple mb-4" />
        <p className="text-lg text-muted-foreground">Welten werden geladen...</p>
      </div>
    );
  }

  if (selectedWorld) {
    return (
      <WorldDetail
        world={selectedWorld}
        onBack={() => onSelectWorld('')}
        onEditWorld={onEditWorld}
        onDeleteWorld={onDeleteWorld}
        onAddCategory={onAddCategory}
        onEditCategory={onEditCategory}
        onDeleteCategory={onDeleteCategory}
        onReorderCategories={onReorderCategories}
      />
    );
  }

  return (
    <WorldsList
      worlds={worlds}
      onSelectWorld={onSelectWorld}
      onNewWorld={onNewWorld}
    />
  );
};

export default WorldsContent;
