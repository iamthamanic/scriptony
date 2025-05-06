
import { narrativeStructureTemplates } from '@/types/narrativeStructures'; 
import { EmotionalSignificance, NarrativeStructureType } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NarrativeStructurePreviewProps {
  structureType: NarrativeStructureType;
}

const getEmotionalSignificanceColor = (significance: EmotionalSignificance | string): string => {
  switch (significance) {
    case 'introduction':
      return 'bg-blue-500';
    case 'buildup': 
      return 'bg-green-500';
    case 'turning-point':
      return 'bg-purple-500';
    case 'climax':
      return 'bg-orange-500';
    case 'finale':
    case 'resolution':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const NarrativeStructurePreview = ({ structureType }: NarrativeStructurePreviewProps) => {
  const template = narrativeStructureTemplates[structureType];
  
  if (!template) {
    return <p className="text-sm text-muted-foreground">No preview available.</p>;
  }
  
  const scenes = template.suggestedScenes || template.scenes || [];
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{template.name}</h3>
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </div>
      
      {scenes.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Example Scenes:</h4>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {scenes.map((scene, index) => (
              <Card key={index} className="p-0">
                <CardHeader className="p-3 pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">
                      Scene {scene.sceneNumber}: {scene.location}
                    </CardTitle>
                    <Badge 
                      className={`${getEmotionalSignificanceColor(scene.emotionalSignificance)}`}
                    >
                      {scene.emotionalSignificance}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-1">
                  <CardDescription>{scene.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NarrativeStructurePreview;
