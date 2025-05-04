
import React from 'react';
import { Button } from "@/components/ui/button";
import { SortAsc, Plus } from "lucide-react";

interface WorldTabActionsProps {
  activeTab: string;
  isReordering: boolean;
  onStartReordering: () => void;
  onAddCategory: () => void;
}

const WorldTabActions = ({
  activeTab,
  isReordering,
  onStartReordering,
  onAddCategory
}: WorldTabActionsProps) => {
  if (activeTab !== "categories") return null;
  
  if (isReordering) return null;
  
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={onStartReordering}>
        <SortAsc className="h-4 w-4 mr-2" />
        Sortieren
      </Button>
      <Button 
        size="sm" 
        className="bg-anime-purple hover:bg-anime-dark-purple"
        onClick={onAddCategory}
      >
        <Plus className="h-4 w-4 mr-2" />
        Kategorie
      </Button>
    </div>
  );
};

export default WorldTabActions;
