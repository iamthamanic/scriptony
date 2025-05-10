
import React from 'react';
import { World } from "@/types";

interface WorldsListProps {
  worlds: World[];
  onSelectWorld: (worldId: string) => void;
  onNewWorld: () => void;
}

// This is a stub component that would be expanded with the full implementation
const WorldsList = ({ worlds, onSelectWorld, onNewWorld }: WorldsListProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Worldbuilding</h1>
        <button 
          onClick={onNewWorld}
          className="px-4 py-2 bg-anime-purple text-white rounded"
        >
          New World
        </button>
      </div>
      
      {worlds.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No worlds yet</h2>
          <p className="text-muted-foreground mb-6">
            Create your first world to get started.
          </p>
          <button 
            onClick={onNewWorld}
            className="px-4 py-2 bg-anime-purple text-white rounded"
          >
            Create World
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {worlds.map((world) => (
            <div 
              key={world.id}
              className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSelectWorld(world.id)}
            >
              {world.cover_image_url && (
                <img 
                  src={world.cover_image_url} 
                  alt={world.name} 
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-medium mb-1">{world.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {world.description || "No description provided"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorldsList;
