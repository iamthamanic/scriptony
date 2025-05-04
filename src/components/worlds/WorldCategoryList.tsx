
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Map } from "lucide-react";
import { World, WorldCategory } from "@/types";
import WorldCategoryCard from "./WorldCategoryCard";

interface WorldCategoryListProps {
  world: World;
  onAddCategory: () => void;
  onEditCategory: (category: WorldCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
  isOverview?: boolean;
}

const WorldCategoryList = ({
  world,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  isOverview = false
}: WorldCategoryListProps) => {
  if (world.categories.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <h3 className="text-lg font-medium mb-2">Keine Kategorien</h3>
        <p className="text-muted-foreground mb-4">
          Füge Kategorien hinzu, um deine Welt zu strukturieren
        </p>
        <Button 
          onClick={onAddCategory}
          className="bg-anime-purple hover:bg-anime-dark-purple"
        >
          <Plus className="mr-2 h-4 w-4" />
          Kategorie hinzufügen
        </Button>
      </div>
    );
  }
  
  if (isOverview) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {world.categories.map((category) => (
          <Card key={category.id} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {category.icon && (
                <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                  <Map className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <h3 className="font-medium">{category.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {category.content && Object.keys(category.content).length > 0
                ? "Inhalt vorhanden"
                : "Keine Inhalte"}
            </p>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {world.categories.map((category) => (
        <WorldCategoryCard
          key={category.id}
          category={category}
          onEdit={() => onEditCategory(category)}
          onDelete={() => onDeleteCategory(category.id)}
        />
      ))}
    </div>
  );
};

export default WorldCategoryList;
