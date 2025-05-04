
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorldCategory } from "@/types";
import { ChevronDown, ChevronUp, Edit, Trash2, Globe } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface WorldCategoryCardProps {
  category: WorldCategory;
  onEdit: () => void;
  onDelete: () => void;
}

const WorldCategoryCard = ({ category, onEdit, onDelete }: WorldCategoryCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getIconComponent = () => {
    // Default to Globe icon
    return <Globe className="h-5 w-5" />;
  };

  return (
    <Card className="transition-all">
      <CardHeader className="py-3 px-4">
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
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="sr-only">Erweitern</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0 pb-3 px-4">
          <div className="bg-muted/50 rounded-md p-2">
            {category.content && Object.keys(category.content).length > 0 ? (
              <Textarea 
                value={JSON.stringify(category.content, null, 2)}
                readOnly
                className="min-h-[200px] font-mono text-sm"
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Keine Inhalte vorhanden
              </div>
            )}
          </div>
          <div className="mt-3 flex justify-end">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Bearbeiten
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default WorldCategoryCard;
