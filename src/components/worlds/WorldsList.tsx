
import React from 'react';
import { World } from "@/types";
import EmptyState from '../EmptyState';
import { PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface WorldsListProps {
  worlds: World[];
  onSelectWorld: (worldId: string) => void;
  onNewWorld: () => void;
}

const WorldsList = ({ worlds, onSelectWorld, onNewWorld }: WorldsListProps) => {
  console.log("WorldsList render - worlds count:", worlds.length);
  
  if (!worlds || worlds.length === 0) {
    return (
      <EmptyState
        title="Keine Welten vorhanden"
        description="Erstelle deine erste Welt, um dein Worldbuilding zu beginnen."
        buttonText="Neue Welt erstellen"
        onClick={onNewWorld}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with title and create button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Deine Welten</h2>
        <Button 
          onClick={onNewWorld}
          className="bg-anime-purple hover:bg-anime-dark-purple"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Neue Welt erstellen
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {worlds.map((world) => (
          <div 
            key={world.id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelectWorld(world.id)}
          >
            <div className="relative aspect-video bg-slate-100">
              {world.cover_image_url ? (
                <img 
                  src={world.cover_image_url} 
                  alt={world.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-slate-200">
                  <span className="text-slate-500">Kein Bild</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg truncate">{world.name}</h3>
              {world.description && (
                <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                  {world.description}
                </p>
              )}
              <div className="flex items-center mt-2">
                <span className="text-xs text-muted-foreground">
                  {world.categories?.length || 0} Kategorien
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {/* Create New World Card */}
        <div 
          className="border border-dashed rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center justify-center p-8 min-h-[220px]"
          onClick={onNewWorld}
        >
          <PlusCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg text-center">Neue Welt erstellen</h3>
        </div>
      </div>
    </div>
  );
};

export default WorldsList;
