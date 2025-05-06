
import React from "react";
import { Button } from "@/components/ui/button";
import { Video, Plus } from "lucide-react";
import { Episode } from "../../types";
import DeleteEpisodeDialog from "../DeleteEpisodeDialog";

interface EpisodeListProps {
  episodes: Episode[];
  onNewEpisode: () => void;
  onEditEpisode: (episodeId: string) => void;
  onDeleteEpisode: (episode: Episode) => void;
  selectedEpisodeId?: string | null;
  onSelectEpisode?: (episodeId: string | null) => void;
}

const EpisodeList = ({ 
  episodes, 
  onNewEpisode, 
  onEditEpisode, 
  onDeleteEpisode,
  selectedEpisodeId,
  onSelectEpisode
}: EpisodeListProps) => {
  if (!episodes || episodes.length === 0) {
    return null;
  }

  const sortedEpisodes = [...episodes].sort((a, b) => a.number - b.number);

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Video className="mr-2 h-5 w-5 text-anime-purple" />
          <h2 className="text-xl font-bold">Episodes ({episodes.length})</h2>
        </div>
        <Button onClick={onNewEpisode} size="sm" variant="outline" className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Episode
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedEpisodes.map(episode => (
          <div 
            key={episode.id} 
            className={`relative group bg-card border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer ${
              selectedEpisodeId === episode.id ? 'ring-2 ring-anime-purple' : ''
            }`}
            onClick={() => onSelectEpisode && onSelectEpisode(
              selectedEpisodeId === episode.id ? null : episode.id
            )}
          >
            <div className="aspect-video bg-muted/40">
              {episode.coverImage ? (
                <img 
                  src={episode.coverImage} 
                  alt={episode.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Video className="h-12 w-12 text-muted-foreground opacity-40" />
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg truncate">{episode.title}</h3>
              <p className="text-sm text-muted-foreground">Episode {episode.number}</p>
              
              <div className="mt-3 flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditEpisode(episode.id);
                  }}
                >
                  Edit
                </Button>
                
                <DeleteEpisodeDialog 
                  episode={episode}
                  onConfirm={() => onDeleteEpisode(episode)}
                  trigger={
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-destructive text-destructive hover:bg-destructive/10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Delete
                    </Button>
                  }
                />
              </div>
              
              {selectedEpisodeId === episode.id && (
                <div className="absolute top-2 right-2 bg-anime-purple text-white px-2 py-1 text-xs rounded">
                  Selected
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EpisodeList;
