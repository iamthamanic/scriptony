
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { World, WorldCategory } from "@/types";
import { 
  ChevronLeft, 
  Edit, 
  Trash2, 
  Plus,
  Map,
  SortAsc,
  Save
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import WorldCategoryCard from "./WorldCategoryCard";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { toast } from "sonner";

interface WorldDetailProps {
  world: World;
  onBack: () => void;
  onEditWorld: () => void;
  onDeleteWorld: () => void;
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{world.name}</h1>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEditWorld}>
            <Edit className="h-4 w-4 mr-2" />
            Bearbeiten
          </Button>
          <Button variant="destructive" size="sm" onClick={onDeleteWorld}>
            <Trash2 className="h-4 w-4 mr-2" />
            Löschen
          </Button>
        </div>
      </div>
      
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
          
          {activeTab === "categories" && (
            <div className="flex gap-2">
              {isReordering ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => {
                    setReorderedCategories([...world.categories]);
                    setIsReordering(false);
                  }}>
                    Abbrechen
                  </Button>
                  <Button size="sm" onClick={saveReordering}>
                    <Save className="h-4 w-4 mr-2" />
                    Speichern
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsReordering(true)}>
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
                </>
              )}
            </div>
          )}
        </div>
        
        <TabsContent value="overview" className="space-y-4">
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
          
          {world.categories.length === 0 && (
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
          )}
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          {isReordering ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="world-categories">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {reorderedCategories.map((category, index) => (
                      <Draggable key={category.id} draggableId={category.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="border rounded-md p-3 bg-background flex items-center gap-3"
                          >
                            <SortAsc className="h-4 w-4 text-muted-foreground" />
                            <span>{category.name}</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <div className="space-y-4">
              {world.categories.map((category) => (
                <WorldCategoryCard
                  key={category.id}
                  category={category}
                  onEdit={() => onEditCategory(category)}
                  onDelete={() => onDeleteCategory(category.id)}
                />
              ))}
              
              {world.categories.length === 0 && (
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
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorldDetail;
