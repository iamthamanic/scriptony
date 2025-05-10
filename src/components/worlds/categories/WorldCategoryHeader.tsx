
import React from 'react';
import { CardTitle } from "@/components/ui/card";
import { Edit, Trash2, ChevronDown, ChevronUp, Globe, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorldCategory } from "@/types";

interface WorldCategoryHeaderProps {
  category: WorldCategory;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const WorldCategoryHeader: React.FC<WorldCategoryHeaderProps> = ({
  category,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete
}) => {
  const getIconComponent = () => {
    if (category.type === 'geography') {
      return <Map className="h-5 w-5" />;
    }
    return <Globe className="h-5 w-5" />;
  };

  return (
    <div className="flex justify-between items-center">
      <CardTitle className="text-base flex items-center gap-2">
        <div className="h-7 w-7 rounded bg-muted/50 flex items-center justify-center">
          {getIconComponent()}
        </div>
        {category.name}
      </CardTitle>
      
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4" />
          <span className="sr-only">Bearbeiten</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Löschen</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onToggleExpand}>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span className="sr-only">Erweitern</span>
        </Button>
      </div>
    </div>
  );
};

export default WorldCategoryHeader;
