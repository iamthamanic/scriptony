import React from 'react';
import { Scene, Character } from '../types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Edit, Clock, User, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SceneCardProps {
  scene: Scene;
  onClick: () => void;
  onExportPDF: () => void;
  onDeleteScene?: () => void;
  characters?: Character[];
}

const SceneCard = ({ scene, onClick, onExportPDF, onDeleteScene, characters = [] }: SceneCardProps) => {
  // Helper function to get background color based on emotional significance
  const getEmotionColor = () => {
    switch (scene.emotionalSignificance) {
      case 'introduction':
        return 'bg-blue-50 border-blue-200';
      case 'buildup':
        return 'bg-green-50 border-green-200';
      case 'climax':
        return 'bg-red-50 border-red-200';
      case 'turning-point':
        return 'bg-purple-50 border-purple-200';
      case 'resolution':
        return 'bg-yellow-50 border-yellow-200';
      case 'finale':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Get characters in scene
  const sceneCharacters = characters.filter(
    character => scene.characterIds?.includes(character.id)
  );

  return (
    <Card 
      className={cn(
        "scene-card border-2", 
        getEmotionColor()
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">
              Scene {scene.sceneNumber}
              {scene.episodeTitle && <span className="font-normal text-muted-foreground"> - {scene.episodeTitle}</span>}
            </h3>
            <p className="text-sm text-muted-foreground">{scene.location} ({scene.timeOfDay})</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={14} />
            <span>{scene.timecodeStart} - {scene.timecodeEnd}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex gap-4">
          {scene.keyframeImage && (
            <div className="hidden sm:block w-1/3">
              <div className="bg-muted rounded-md overflow-hidden flex items-center justify-center p-1">
                <img 
                  src={scene.keyframeImage} 
                  alt={`Scene ${scene.sceneNumber} keyframe`}
                  className="max-w-full object-contain"
                  style={{ maxHeight: "120px" }}
                />
              </div>
            </div>
          )}
          <div className={scene.keyframeImage ? "w-full sm:w-2/3" : "w-full"}>
            <p className="text-sm line-clamp-3">
              {scene.description}
            </p>
            
            {sceneCharacters.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {sceneCharacters.map(character => (
                  <div 
                    key={character.id} 
                    className="flex items-center bg-muted/40 rounded-full px-2 py-0.5 text-xs"
                  >
                    <User size={10} className="mr-1" />
                    {character.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div>
          <span className="text-xs bg-anime-light-purple text-anime-purple px-2 py-1 rounded-full">
            {scene.emotionalSignificance}
          </span>
        </div>
        <div className="flex gap-2">
          {onDeleteScene && (
            <Button variant="outline" size="sm" onClick={onDeleteScene} className="border-destructive text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onExportPDF}>
            <FileText className="h-4 w-4 mr-1" />
            PDF
          </Button>
          <Button variant="default" size="sm" onClick={onClick} className="bg-anime-purple hover:bg-anime-dark-purple">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SceneCard;
