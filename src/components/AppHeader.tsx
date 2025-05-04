
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import Logo from "./Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface AppHeaderProps {
  onNewProject: () => void;
  onUploadScript?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accountName: string;
}

const AppHeader = ({ onNewProject, onUploadScript, accountName }: AppHeaderProps) => {
  const isWorldbuilding = window.location.pathname === '/worldbuilding';
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!onUploadScript) {
      toast({
        title: "Feature not available",
        description: "Script upload is not available in this context",
        variant: "destructive"
      });
      return;
    }
    
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file type
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(fileExt || '')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOCX, or TXT file",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive"
      });
      return;
    }
    
    onUploadScript(event);
  };
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
      <div className="flex items-center gap-4">
        <Logo size="sm" />
      </div>
      
      <div className="flex items-center gap-2">
        {isWorldbuilding ? (
          <Button
            onClick={onNewProject}
            size="sm"
            className="bg-anime-purple hover:bg-anime-dark-purple"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Neue Welt</span>
          </Button>
        ) : (
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
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Script
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.txt"
                  style={{ display: 'none' }}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default AppHeader;
