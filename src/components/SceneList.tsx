
import React, { useState } from "react";
import SceneCard from "./SceneCard";
import { Scene, Character, Episode } from "../types";
import { Button } from "@/components/ui/button";
import { Film } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SceneListProps {
  scenes: Scene[];
  onEditScene: (scene: Scene) => void;
  onExportPDF: (scene: Scene) => void;
  onDeleteScene: (scene: Scene) => void;
  characters: Character[];
  showEpisodeFilter?: boolean;
  episodes?: Episode[];
}

const SceneList = ({ 
  scenes, 
  onEditScene, 
  onExportPDF, 
  onDeleteScene, 
  characters,
  showEpisodeFilter = false,
  episodes = []
}: SceneListProps) => {
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string>("all");
  
  const filteredScenes = selectedEpisodeId === "all"
    ? scenes
    : scenes.filter(scene => scene.episodeId === selectedEpisodeId);
    
  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <div className="flex items-center mb-4 sm:mb-0">
          <Film className="mr-2 h-5 w-5 text-anime-purple" />
          <h2 className="text-xl font-bold">Scenes ({scenes.length})</h2>
        </div>
        
        {showEpisodeFilter && episodes.length > 0 && (
          <div className="w-full sm:w-64">
            <Select value={selectedEpisodeId} onValueChange={setSelectedEpisodeId}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by episode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Episodes</SelectItem>
                {episodes.map(episode => (
                  <SelectItem key={episode.id} value={episode.id}>
                    Episode {episode.number}: {episode.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      {filteredScenes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredScenes.map((scene) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              onEdit={() => onEditScene(scene)}
              onDelete={() => onDeleteScene(scene)}
              onExport={() => onExportPDF(scene)}
              episodeTitle={
                scene.episodeTitle || 
                (scene.episodeId && episodes.find(ep => ep.id === scene.episodeId)?.title)
              }
              characters={characters.filter(char => 
                scene.characterIds?.includes(char.id)
              )}
            />
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 rounded-md p-6 text-center">
          <p className="text-muted-foreground">No scenes to display</p>
          {selectedEpisodeId !== "all" && (
            <Button 
              variant="ghost" 
              className="mt-2"
              onClick={() => setSelectedEpisodeId("all")}
            >
              Show all scenes
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SceneList;
