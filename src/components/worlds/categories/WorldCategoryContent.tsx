
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { WorldCategory } from "@/types";
import ContentRenderer from './ContentRenderer';

interface WorldCategoryContentProps {
  category: WorldCategory;
  onEdit: () => void;
}

const WorldCategoryContent: React.FC<WorldCategoryContentProps> = ({ category, onEdit }) => {
  return (
    <>
      <ContentRenderer category={category} />
      
      <div className="mt-3 flex justify-end">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Bearbeiten
        </Button>
      </div>
    </>
  );
};

export default WorldCategoryContent;
