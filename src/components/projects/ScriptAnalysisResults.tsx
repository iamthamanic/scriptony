
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ScriptAnalysisResultsProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResult: any;
}

export const ScriptAnalysisResults: React.FC<ScriptAnalysisResultsProps> = ({
  isOpen,
  onClose,
  analysisResult
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Script Analysis Results</DialogTitle>
          <DialogDescription>
            Here are the results of your script analysis.
          </DialogDescription>
        </DialogHeader>
        
        {analysisResult ? (
          <div className="space-y-6">
            {analysisResult.title && (
              <div>
                <h3 className="text-lg font-semibold">Detected Title</h3>
                <p className="text-xl font-medium text-primary">{analysisResult.title}</p>
              </div>
            )}
            
            {analysisResult.genre && (
              <div>
                <h3 className="text-lg font-semibold">Detected Genre</h3>
                <p>{analysisResult.genre.join(', ')}</p>
              </div>
            )}
            
            {analysisResult.characters && analysisResult.characters.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold">Characters ({analysisResult.characters.length})</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {analysisResult.characters.map((character: any, index: number) => (
                    <li key={index}>{character.name}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {analysisResult.scenes && analysisResult.scenes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold">Scenes ({analysisResult.scenes.length})</h3>
                <div className="space-y-2 mt-2">
                  {analysisResult.scenes.map((scene: any, index: number) => (
                    <div key={index} className="p-3 border rounded-md">
                      <p className="font-semibold">Scene {index + 1}</p>
                      <p className="text-sm">{scene.description?.substring(0, 150)}...</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No analysis results available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
