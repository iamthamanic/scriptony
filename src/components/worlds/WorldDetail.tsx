
import React, { useState } from 'react';
import { World, WorldCategory } from "@/types";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorldHeader from './WorldHeader';
import WorldCategoryList from './WorldCategoryList';
import WorldCategoryReorder from './WorldCategoryReorder';
import WorldTabActions from './WorldTabActions';
import { DropResult } from '@hello-pangea/dnd';

interface WorldDetailProps {
  world: World;
  onBack: () => void;
  onEditWorld: () => void;
  onDeleteWorld: () => void;
  onDuplicateWorld?: () => void; // Added the missing prop with optional type
  onAddCategory: () => void;
  onEditCategory: (category: WorldCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
  onReorderCategories: (categories: WorldCategory[]) => void;
}

const WorldDetail = ({
  world,
  onBack,
  onEditWorld,
  onDeleteWorld,
  onDuplicateWorld,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onReorderCategories
}: WorldDetailProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isReordering, setIsReordering] = useState(false);
  const [reorderedCategories, setReorderedCategories] = useState<WorldCategory[]>([...world.categories]);

  const handleDragEnd = (result: DropResult) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = Array.from(reorderedCategories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the order index for each item
    const updatedItems = items.map((item, index) => ({
      ...item,
      order_index: index
    }));

    setReorderedCategories(updatedItems);
  };

  const saveReordering = () => {
    onReorderCategories(reorderedCategories);
    setIsReordering(false);
    toast.success("Reihenfolge gespeichert");
  };

  return (
    <div className="space-y-6">
      <WorldHeader 
        world={world}
        onBack={onBack}
        onEditWorld={onEditWorld}
        onDeleteWorld={onDeleteWorld}
      />
      
      {world.cover_image_url && (
        <div className="aspect-[21/9] rounded-lg overflow-hidden">
          <img 
            src={world.cover_image_url} 
            alt={world.name} 
            className="object-cover w-full h-full"
          />
        </div>
      )}
      
      {world.description && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-muted-foreground">{world.description}</p>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="categories">Kategorien</TabsTrigger>
          </TabsList>
          
          <WorldTabActions 
            activeTab={activeTab}
            isReordering={isReordering}
            onStartReordering={() => setIsReordering(true)}
            onAddCategory={onAddCategory}
          />
        </div>
        
        <TabsContent value="overview" className="space-y-4">
          <WorldCategoryList
            world={world}
            onAddCategory={onAddCategory}
            onEditCategory={onEditCategory}
            onDeleteCategory={onDeleteCategory}
            isOverview={true}
          />
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          {isReordering ? (
            <WorldCategoryReorder
              categories={reorderedCategories}
              onCancelReordering={() => {
                setReorderedCategories([...world.categories]);
                setIsReordering(false);
              }}
              onSaveReordering={saveReordering}
              onDragEnd={handleDragEnd}
            />
          ) : (
            <WorldCategoryList
              world={world}
              onAddCategory={onAddCategory}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorldDetail;
