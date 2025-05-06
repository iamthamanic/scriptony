
import React from 'react';
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { NarrativeStructureType } from '@/types';
import NarrativeStructurePreview from './NarrativeStructurePreview';

interface NarrativeStructurePopoverProps {
  structureType: NarrativeStructureType;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const NarrativeStructurePopover = ({ 
  structureType, 
  isOpen, 
  onOpenChange 
}: NarrativeStructurePopoverProps) => {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="end">
        <div className="p-4">
          <NarrativeStructurePreview structureType={structureType} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NarrativeStructurePopover;
