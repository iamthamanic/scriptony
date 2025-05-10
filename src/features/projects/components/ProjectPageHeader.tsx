
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileUp } from 'lucide-react';

interface ProjectPageHeaderProps {
  onNewProject: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  triggerFileUpload: () => void;
}

const ProjectPageHeader = ({
  onNewProject,
  fileInputRef,
  handleFileChange,
  triggerFileUpload
}: ProjectPageHeaderProps) => {
  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
      <div className="mb-4 md:mb-0">
        <h1 className="text-3xl font-bold mb-2">Scriptony</h1>
        <p className="text-muted-foreground">
          Create and manage your creative projects
        </p>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={triggerFileUpload}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FileUp className="h-4 w-4" />
          Upload Script
        </Button>
        <input 
          ref={fileInputRef} 
          type="file" 
          onChange={handleFileChange} 
          accept=".pdf,.docx,.txt" 
          className="hidden"
        />
        
        <Button onClick={onNewProject} className="bg-anime-purple hover:bg-anime-dark-purple">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>
    </header>
  );
};

export default ProjectPageHeader;
