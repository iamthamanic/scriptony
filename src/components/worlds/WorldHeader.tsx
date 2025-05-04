
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit, Trash2 } from "lucide-react";
import { World } from "@/types";

interface WorldHeaderProps {
  world: World;
  onBack: () => void;
  onEditWorld: () => void;
  onDeleteWorld: () => void;
}

const WorldHeader = ({
  world,
  onBack,
  onEditWorld,
  onDeleteWorld
}: WorldHeaderProps) => {
  return (
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
  );
};

export default WorldHeader;
