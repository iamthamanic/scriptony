
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Accordion } from '@/components/ui/accordion';
import { Check } from 'lucide-react';
import { AnalysisResult, ProjectType } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NewProjectFormData } from '@/types';

// Import refactored components
import { ScriptAnalysisHeader } from './ScriptAnalysisHeader';
import ScriptAnalysisStructure from './ScriptAnalysisStructure';
import ScriptAnalysisCharacters from './ScriptAnalysisCharacters';
import ScriptAnalysisScenes from './ScriptAnalysisScenes';

interface ScriptAnalysisResultsProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResult: AnalysisResult | null;
  onCreateProject: (data: NewProjectFormData) => void;
  isLoading: boolean;
}

const ScriptAnalysisResults = ({
  isOpen,
  onClose,
  analysisResult,
  onCreateProject,
  isLoading
}: ScriptAnalysisResultsProps) => {
  if (!analysisResult) {
    return null;
  }

  const handleCreateProject = () => {
    const formData: NewProjectFormData = {
      title: analysisResult.title,
      type: analysisResult.type as ProjectType,
      logline: analysisResult.scenes[0]?.description.substring(0, 200) || '',
      genres: analysisResult.genres,
      duration: analysisResult.duration,
      narrativeStructure: analysisResult.narrativeStructure,
      inspirations: [],
    };
    
    onCreateProject(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-anime-purple">Script Analysis Results</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            {/* Header section with title and genres */}
            <ScriptAnalysisHeader analysisResult={analysisResult} />
            
            {/* Structure section */}
            <ScriptAnalysisStructure analysisResult={analysisResult} />
            
            {/* Characters and Scenes sections */}
            <Accordion type="single" collapsible defaultValue="characters">
              <ScriptAnalysisCharacters analysisResult={analysisResult} />
              <ScriptAnalysisScenes analysisResult={analysisResult} />
            </Accordion>
          </div>
        </ScrollArea>
        
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateProject}
            className="bg-anime-purple hover:bg-anime-dark-purple"
            disabled={isLoading}
          >
            <Check className="h-4 w-4 mr-1.5" />
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScriptAnalysisResults;
