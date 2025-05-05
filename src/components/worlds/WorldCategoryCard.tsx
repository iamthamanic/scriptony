
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { WorldCategory } from "@/types";
import WorldCategoryHeader from './categories/WorldCategoryHeader';
import WorldCategoryContent from './categories/WorldCategoryContent';

interface WorldCategoryCardProps {
  category: WorldCategory;
  onEdit: () => void;
  onDelete: () => void;
}

const WorldCategoryCard = ({ category, onEdit, onDelete }: WorldCategoryCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Card className="transition-all">
      <CardHeader className="py-3 px-4">
        <WorldCategoryHeader 
          category={category}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0 pb-3 px-4">
          <WorldCategoryContent 
            category={category} 
            onEdit={onEdit} 
          />
        </CardContent>
      )}
    </Card>
  );
};

export default WorldCategoryCard;
