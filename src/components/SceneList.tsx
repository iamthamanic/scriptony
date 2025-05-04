
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Scene, Character } from '../types';
import SceneCard from './SceneCard';
import TimelineView from './TimelineView';
import { ListFilter, Calendar } from 'lucide-react';

interface SceneListProps {
  scenes: Scene[];
  onEditScene: (scene: Scene) => void;
  onExportPDF: (scene: Scene) => void;
  onDeleteScene?: (scene: Scene) => void;
  characters?: Character[];
}

const SceneList = ({ scenes, onEditScene, onExportPDF, onDeleteScene, characters = [] }: SceneListProps) => {
  const [activeView, setActiveView] = useState<"gallery" | "timeline">("gallery");

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Scenes ({scenes.length})</h2>
        <div className="flex gap-2">
          <Button 
            variant={activeView === "gallery" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setActiveView("gallery")} 
            className={activeView === "gallery" ? "bg-anime-purple hover:bg-anime-dark-purple" : ""}
          >
            <ListFilter className="h-4 w-4 mr-2" />
            Gallery
          </Button>
          <Button 
            variant={activeView === "timeline" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setActiveView("timeline")} 
            className={activeView === "timeline" ? "bg-anime-purple hover:bg-anime-dark-purple" : ""}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Timeline
          </Button>
        </div>
      </div>
      
      {activeView === "gallery" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenes.map(scene => (
            <SceneCard 
              key={scene.id} 
              scene={scene} 
              onClick={() => onEditScene(scene)} 
              onExportPDF={() => onExportPDF(scene)} 
              onDeleteScene={onDeleteScene ? () => onDeleteScene(scene) : undefined}
              characters={characters}
            />
          ))}
        </div>
      ) : (
        <TimelineView scenes={scenes} onSceneClick={scene => onEditScene(scene)} />
      )}
    </div>
  );
};

export default SceneList;
