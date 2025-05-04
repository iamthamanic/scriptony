
import React from 'react';
import { Button } from "@/components/ui/button";
import { SortAsc, Save } from "lucide-react";
import { WorldCategory } from "@/types";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface WorldCategoryReorderProps {
  categories: WorldCategory[];
  onCancelReordering: () => void;
  onSaveReordering: () => void;
  onDragEnd: (result: DropResult) => void;
}

const WorldCategoryReorder = ({
  categories,
  onCancelReordering,
  onSaveReordering,
  onDragEnd
}: WorldCategoryReorderProps) => {
  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onCancelReordering}>
          Abbrechen
        </Button>
        <Button size="sm" onClick={onSaveReordering}>
          <Save className="h-4 w-4 mr-2" />
          Speichern
        </Button>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="world-categories">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {categories.map((category, index) => (
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
    </>
  );
};

export default WorldCategoryReorder;
