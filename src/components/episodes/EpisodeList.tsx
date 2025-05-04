
import React from "react";
import { Episode } from "../../types";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EpisodeListProps {
  episodes: Episode[];
  onNewEpisode: () => void;
  onEditEpisode: (episodeId: string) => void;
  onDeleteEpisode: (episodeId: string) => void;
}

const EpisodeList = ({ 
  episodes, 
  onNewEpisode, 
  onEditEpisode, 
  onDeleteEpisode 
}: EpisodeListProps) => {
  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Episodes</h2>
        <Button
          onClick={onNewEpisode}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Episode
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {episodes.sort((a, b) => a.number - b.number).map((episode) => (
          <Card key={episode.id} className="hover:shadow-md transition-shadow">
            <div className="aspect-video w-full overflow-hidden bg-black/10">
              {episode.coverImage ? (
                <img 
                  src={episode.coverImage} 
                  alt={episode.title}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-anime-gray-200">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">
                  <span className="text-anime-purple font-bold mr-2">#{episode.number}</span>
                  {episode.title}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                {episode.description}
              </p>
              <div className="flex justify-end space-x-2">
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => onEditEpisode(episode.id)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => onDeleteEpisode(episode.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EpisodeList;
