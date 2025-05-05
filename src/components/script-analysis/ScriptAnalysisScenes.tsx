
import React from 'react';
import { FileText } from 'lucide-react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { AnalysisResult } from '@/types';

interface ScriptAnalysisScenesProps {
  analysisResult: AnalysisResult;
}

const ScriptAnalysisScenes = ({ analysisResult }: ScriptAnalysisScenesProps) => {
  return (
    <AccordionItem value="scenes">
      <AccordionTrigger className="text-sm font-medium">
        <div className="flex items-center">
          <FileText className="h-4 w-4 mr-1.5 text-muted-foreground" />
          Scenes ({analysisResult.scenes.length})
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2">
          {analysisResult.scenes.slice(0, 10).map((scene, index) => (
            <div key={index} className="bg-muted rounded-md p-2 text-sm">
              <div className="font-medium">Scene {scene.sceneNumber}: {scene.location}</div>
              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {scene.description}
              </div>
              {scene.characters.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {scene.characters.slice(0, 3).map((char, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">{char}</Badge>
                  ))}
                  {scene.characters.length > 3 && (
                    <Badge variant="outline" className="text-xs">+{scene.characters.length - 3}</Badge>
                  )}
                </div>
              )}
            </div>
          ))}
          {analysisResult.scenes.length > 10 && (
            <div className="text-center text-sm text-muted-foreground">
              + {analysisResult.scenes.length - 10} more scenes
            </div>
          )}
          {analysisResult.scenes.length === 0 && (
            <div className="text-sm text-muted-foreground">No scenes detected</div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ScriptAnalysisScenes;
