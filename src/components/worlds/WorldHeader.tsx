
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit, Trash2, MoreHorizontal, Copy } from "lucide-react";
import { World } from "@/types";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface WorldHeaderProps {
  world: World;
  onBack: () => void;
  onEditWorld: () => void;
  onDeleteWorld: () => void;
  onDuplicateWorld?: () => void;
}

const WorldHeader = ({
  world,
  onBack,
  onEditWorld,
  onDeleteWorld,
  onDuplicateWorld
}: WorldHeaderProps) => {
  // Dünya silme işlevini ele al
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteWorld();
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onBack}
        className="w-fit"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Zurück zur Übersicht
      </Button>
      
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-anime-purple">{world.name}</h1>
        {world.categories && (
          <div className="flex flex-wrap gap-1 mt-1">
            <Badge variant="success" className="text-xs">
              {world.categories.length} Kategorie{world.categories.length !== 1 ? 'n' : ''}
            </Badge>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEditWorld}>
              <Edit className="h-4 w-4 mr-2" />
              Welt bearbeiten
            </DropdownMenuItem>
            
            {onDuplicateWorld && (
              <DropdownMenuItem onClick={onDuplicateWorld}>
                <Copy className="h-4 w-4 mr-2" />
                Welt duplizieren
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleDeleteClick}
              className="text-red-500 focus:text-red-500"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Welt löschen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default WorldHeader;
