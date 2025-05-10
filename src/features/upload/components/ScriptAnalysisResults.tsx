
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalysisResult } from '@/types';
import { Check, X } from 'lucide-react';

interface ScriptAnalysisResultsProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResult: AnalysisResult | null;
  onCreateProject: (data: any) => void;
  isLoading: boolean;
}

const ScriptAnalysisResults = ({
  isOpen,
  onClose,
  analysisResult,
  onCreateProject,
  isLoading
}: ScriptAnalysisResultsProps) => {
  const [activeTab, setActiveTab] = useState<string>("summary");
  
  if (!analysisResult) return null;
  
  const {
    title = "Untitled Project",
    type = "movie",
    scenes = [],
    characters = []
  } = analysisResult;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Script Analysis Results: {title}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="scenes">Scenes ({scenes.length})</TabsTrigger>
              <TabsTrigger value="characters">Characters ({characters.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Project Details</h3>
                  <div className="space-y-1">
                    <p><span className="font-medium">Title:</span> {title}</p>
                    <p><span className="font-medium">Type:</span> {type.charAt(0).toUpperCase() + type.slice(1)}</p>
                    <p><span className="font-medium">Scenes:</span> {scenes.length}</p>
                    <p><span className="font-medium">Characters:</span> {characters.length}</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Detection Summary</h3>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Scene structure detected</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {characters.length > 0 ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span>Character detection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {scenes.length > 0 ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span>Dialogue extraction</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="scenes">
              <div className="border rounded-lg divide-y max-h-[50vh] overflow-y-auto">
                {scenes.map((scene, index) => (
                  <div key={index} className="p-3">
                    <h3 className="font-medium">Scene {scene.sceneNumber}</h3>
                    <p className="text-sm text-muted-foreground">{scene.location} - {scene.time_of_day}</p>
                    {scene.description && (
                      <p className="mt-1 text-sm">{scene.description}</p>
                    )}
                  </div>
                ))}
                {scenes.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    No scenes detected
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="characters">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {characters.map((character, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <h3 className="font-medium">{character.name}</h3>
                    {character.role && (
                      <p className="text-sm text-muted-foreground">{character.role}</p>
                    )}
                    {character.description && (
                      <p className="mt-1 text-sm">{character.description}</p>
                    )}
                  </div>
                ))}
                {characters.length === 0 && (
                  <div className="col-span-3 p-4 text-center text-muted-foreground">
                    No characters detected
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="mt-6 gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={() => onCreateProject(analysisResult)}
            className="bg-anime-purple hover:bg-anime-dark-purple"
            disabled={isLoading}
          >
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScriptAnalysisResults;
