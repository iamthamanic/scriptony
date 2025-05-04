
import React from "react";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";

interface AppHeaderProps {
  onNewProject: () => void;
}

const AppHeader = ({ onNewProject }: AppHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-4xl font-bold text-anime-purple">Scriptbuddy</h1>
        <p className="text-muted-foreground mt-1">
          Create, visualize, and organize your anime script scenes
        </p>
      </div>
      <Button 
        onClick={onNewProject} 
        className="bg-anime-purple hover:bg-anime-dark-purple transition-colors"
      >
        <FilePlus className="mr-2 h-4 w-4" />
        New Project
      </Button>
    </div>
  );
};

export default AppHeader;
