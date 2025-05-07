
import React from 'react';
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
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
      <PopoverContent className="w-[400px] p-0" align="end" sideOffset={5}>
        <ScrollArea className="h-[400px] p-4">
          <div className="space-y-4">
            <h3 className="font-medium text-center sticky top-0 bg-background pt-2 pb-2 border-b">
              {structureType === 'three-act' ? 'Drei-Akt-Struktur' : 
               structureType === 'hero-journey' ? 'Heldenreise' : 
               structureType === 'save-the-cat' ? 'Save the Cat' :
               structureType === 'seven-point' ? 'Sieben-Punkte-Struktur' : 
               'Narrative Struktur'}
            </h3>
            <NarrativeStructurePreview structureType={structureType} />
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NarrativeStructurePopover;

