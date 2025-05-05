
import React from 'react';
import { Button } from "@/components/ui/button";
import { World } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, Plus } from "lucide-react";

interface WorldsListProps {
  worlds: World[];
  onSelectWorld: (worldId: string) => void;
  onNewWorld: () => void;
}

const WorldsList = ({ worlds, onSelectWorld, onNewWorld }: WorldsListProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Deine Welten</h2>
        <Button 
          onClick={onNewWorld}
        >
          <Plus className="mr-2 h-4 w-4" />
          Neue Welt
        </Button>
      </div>
      
      {worlds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {worlds.map(world => (
            <Card 
              key={world.id} 
              className="cursor-pointer hover:border-anime-purple transition-colors"
              onClick={() => onSelectWorld(world.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  {world.name}
                </CardTitle>
                <CardDescription>
                  {world.categories.length} Kategorien
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                {world.cover_image_url ? (
                  <div className="aspect-video relative overflow-hidden rounded-md mb-2">
                    <img 
                      src={world.cover_image_url} 
                      alt={world.name} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted flex items-center justify-center rounded-md mb-2">
                    <Map className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {world.description || "Keine Beschreibung vorhanden."}
                </p>
              </CardContent>
              <CardFooter className="pt-2 text-xs text-muted-foreground">
                Erstellt: {world.created_at.toLocaleDateString()}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 border border-dashed rounded-lg">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Map className="h-6 w-6 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-medium mb-2">Keine Welten gefunden</h3>
          <p className="text-muted-foreground mb-4">
            Erstelle deine erste Welt und verbinde sie mit deinen Projekten
          </p>
          <Button 
            onClick={onNewWorld}
          >
            <Plus className="mr-2 h-4 w-4" />
            Erste Welt erstellen
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorldsList;
