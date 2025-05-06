
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { NarrativeStructureType } from '@/types';
import { getStructureOptions } from '@/types/narrativeStructures/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import NarrativeStructurePreview from './NarrativeStructurePreview';

interface NarrativeStructureSelectorProps {
  value: NarrativeStructureType;
  onValueChange: (value: string) => void;
  projectType: string;
  videoFormat?: string;
}

const NarrativeStructureSelector = ({ 
  value, 
  onValueChange, 
  projectType,
  videoFormat
}: NarrativeStructureSelectorProps) => {
  const structureOptions = getStructureOptions(projectType, videoFormat);
  const [openPreviewId, setOpenPreviewId] = useState<string | null>(null);
  
  // Get description from options
  const currentStructureDescription = structureOptions.find(
    option => option.value === value
  )?.description || '';
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="narrativeStructure">Narrative Structure</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-5 w-5">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <h4 className="font-medium mb-2">Narrative Structure</h4>
            <p className="text-sm text-muted-foreground">
              Die Plotstruktur bestimmt den grundlegenden Aufbau deiner Geschichte. 
              Basierend auf dem gewählten Projekttyp werden passende Strukturen angezeigt.
            </p>
          </PopoverContent>
        </Popover>
      </div>
      
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select narrative structure" />
        </SelectTrigger>
        <SelectContent>
          {structureOptions.map(option => (
            <div key={option.value} className="relative flex items-center">
              <SelectItem value={option.value}>
                {option.label}
              </SelectItem>
              {option.value !== 'none' && (
                <div className="absolute right-2" onClick={(e) => e.stopPropagation()}>
                  <NarrativeStructurePopover 
                    structureType={option.value as NarrativeStructureType}
                    isOpen={openPreviewId === option.value}
                    onOpenChange={(open) => {
                      if (open) {
                        setOpenPreviewId(option.value);
                      } else if (openPreviewId === option.value) {
                        setOpenPreviewId(null);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </SelectContent>
      </Select>
      
      <p className="text-xs text-muted-foreground mt-1">
        {currentStructureDescription}
      </p>
      
      {value && value !== 'none' && (
        <div className="border rounded-md p-3 mt-2">
          <NarrativeStructurePreview structureType={value as NarrativeStructureType} />
        </div>
      )}
    </div>
  );
};

export default NarrativeStructureSelector;
export { getStructureOptions };

const NarrativeStructurePopover = ({ 
  structureType, 
  isOpen, 
  onOpenChange 
}: { 
  structureType: NarrativeStructureType;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
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
