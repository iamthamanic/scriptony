
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from '@/components/ui/accordion';
import {
  Check,
  FileText,
  Globe,
  Users,
  Layout,
  FilmIcon
} from 'lucide-react';
import { AnalysisResult, Genre, ProjectType } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NewProjectFormData } from '@/types';

const projectTypeLabels: Record<ProjectType, string> = {
  'movie': 'Film',
  'series': 'TV Series',
  'short': 'Short Film',
  'theaterstück': 'Theater Play',
  'hörspiel': 'Audio Drama',
  'buch': 'Book',
  'social_video': 'Social Video'
};

const genreLabels: Record<Genre, string> = {
  'action': 'Action',
  'adventure': 'Adventure',
  'comedy': 'Comedy',
  'drama': 'Drama',
  'fantasy': 'Fantasy',
  'horror': 'Horror',
  'mystery': 'Mystery',
  'romance': 'Romance',
  'sci-fi': 'Sci-Fi',
  'slice-of-life': 'Slice of Life',
  'supernatural': 'Supernatural',
  'thriller': 'Thriller'
};

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
            {/* Title and Media Type */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{analysisResult.title || 'Untitled Script'}</h3>
                <div className="flex items-center mt-1">
                  <FilmIcon className="h-4 w-4 mr-1.5 text-muted-foreground" />
                  <span>{projectTypeLabels[analysisResult.type] || analysisResult.type}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 justify-end">
                {analysisResult.genres.map(genre => (
                  <Badge key={genre} variant="secondary">{genreLabels[genre] || genre}</Badge>
                ))}
              </div>
            </div>

            <Separator />
            
            {/* Structure section */}
            <div>
              <h4 className="text-sm font-medium flex items-center mb-2">
                <Layout className="h-4 w-4 mr-1.5 text-muted-foreground" />
                Structure
              </h4>
              <div className="bg-muted rounded-md p-3 text-sm">
                <div className="flex justify-between">
                  <span>Narrative Structure:</span>
                  <span className="font-medium">{analysisResult.narrativeStructure.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Duration:</span>
                  <span className="font-medium">{analysisResult.duration} minutes</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Scene Count:</span>
                  <span className="font-medium">{analysisResult.scenes.length}</span>
                </div>
              </div>
            </div>
            
            {/* Characters section */}
            <Accordion type="single" collapsible defaultValue="characters">
              <AccordionItem value="characters">
                <AccordionTrigger className="text-sm font-medium">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1.5 text-muted-foreground" />
                    Characters ({analysisResult.characters.length})
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {analysisResult.characters.map((character, index) => (
                      <div key={index} className="bg-muted rounded-md p-2 text-sm">
                        <div className="font-medium">{character.name}</div>
                      </div>
                    ))}
                    {analysisResult.characters.length === 0 && (
                      <div className="text-sm text-muted-foreground">No characters detected</div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            {/* Scenes section */}
            <Accordion type="single" collapsible defaultValue="scenes">
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
