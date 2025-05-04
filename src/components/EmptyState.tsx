
import React from 'react';
import { Button } from "@/components/ui/button";
import { FilePlus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}

const EmptyState = ({ title, description, buttonText, onClick }: EmptyStateProps) => {
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">
        {description}
      </p>
      <Button onClick={onClick} className="bg-anime-purple hover:bg-anime-dark-purple">
        <FilePlus className="mr-2 h-4 w-4" />
        {buttonText}
      </Button>
    </div>
  );
};

export default EmptyState;
