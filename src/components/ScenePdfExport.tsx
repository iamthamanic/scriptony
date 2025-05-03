
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { generateScenePDF } from '../utils/pdfGenerator';
import { Scene, Project } from '../types';
import { useToast } from '@/components/ui/use-toast';

interface ScenePdfExportProps {
  scene: Scene;
  project: Project;
}

const ScenePdfExport = ({ scene, project }: ScenePdfExportProps) => {
  const { toast } = useToast();

  const handleExport = () => {
    try {
      generateScenePDF(scene, project);
      toast({
        title: "PDF Generated Successfully",
        description: `Scene ${scene.sceneNumber} has been exported as PDF.`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error Exporting PDF",
        description: "There was a problem creating your PDF.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      className="flex items-center gap-2"
    >
      <FileText className="h-4 w-4" />
      Export as PDF
    </Button>
  );
};

export default ScenePdfExport;
