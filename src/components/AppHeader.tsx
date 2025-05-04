
import React from "react";
import { Button } from "@/components/ui/button";
import { FilePlus, Settings } from "lucide-react";

interface AppHeaderProps {
  onNewProject: () => void;
  onOpenAccountSettings?: () => void;
  accountName?: string;
}

const AppHeader = ({
  onNewProject,
  onOpenAccountSettings,
  accountName = "User"
}: AppHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-4xl font-bold text-anime-purple">Scriptbuddy</h1>
        <p className="text-muted-foreground mt-1">
          <span>{accountName}'s workspace</span>
        </p>
      </div>
      <div className="flex gap-2">
        {onOpenAccountSettings && (
          <Button 
            onClick={onOpenAccountSettings} 
            variant="outline" 
            className="transition-colors"
          >
            <Settings className="mr-2 h-4 w-4" />
            Account Settings
          </Button>
        )}
        <Button 
          onClick={onNewProject} 
          className="bg-anime-purple hover:bg-anime-dark-purple transition-colors"
        >
          <FilePlus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
    </div>
  );
};

export default AppHeader;
