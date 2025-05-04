
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Episode } from "../types";
import { Edit, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DeleteEpisodeDialog from "./DeleteEpisodeDialog";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [episodeToDelete, setEpisodeToDelete] = useState<Episode | null>(null);
  const { toast } = useToast();

  const handleDeleteClick = (episode: Episode) => {
    setEpisodeToDelete(episode);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (episodeToDelete) {
      onDeleteEpisode(episodeToDelete.id);
      setDeleteDialogOpen(false);
      setEpisodeToDelete(null);
    }
  };

  const sortedEpisodes = [...episodes].sort((a, b) => a.number - b.number);

  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Episodes</h2>
        <Button 
          onClick={onNewEpisode}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Episode
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedEpisodes.map((episode) => (
          <Card key={episode.id} className="overflow-hidden">
            {episode.coverImage && (
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={episode.coverImage}
                  alt={episode.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader className="pb-2">
              <h3 className="text-lg font-semibold">
                Episode {episode.number}: {episode.title}
              </h3>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-muted-foreground line-clamp-2">
                {episode.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-0">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => onEditEpisode(episode.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-destructive hover:bg-destructive/10"
                onClick={() => handleDeleteClick(episode)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <DeleteEpisodeDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        episode={episodeToDelete}
      />
    </div>
  );
};

export default EpisodeList;
