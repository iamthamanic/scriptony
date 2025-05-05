
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface ProjectPageHeaderProps {
  onNewProject: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProjectPageHeader = ({ 
  onNewProject, 
  fileInputRef, 
  handleFileChange 
}: ProjectPageHeaderProps) => {
  // Function to trigger file input click
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Skript-Projekte</h1>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className="bg-anime-purple hover:bg-anime-dark-purple"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                <span>New Project</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onNewProject}>
                Empty Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={triggerFileUpload}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Script
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
            style={{ display: 'none' }}
            aria-label="Upload script file"
          />
        </div>
      </div>
    </header>
  );
};

export default ProjectPageHeader;
