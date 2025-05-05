
import React from 'react';
import { Users } from 'lucide-react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { AnalysisResult } from '@/types';

interface ScriptAnalysisCharactersProps {
  analysisResult: AnalysisResult;
}

const ScriptAnalysisCharacters = ({ analysisResult }: ScriptAnalysisCharactersProps) => {
  return (
    <AccordionItem value="characters">
      <AccordionTrigger className="text-sm font-medium">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1.5 text-muted-foreground" />
          Characters ({analysisResult.characters.length})
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {analysisResult.characters.map((character, index) => (
            <div key={index} className="bg-muted rounded-md p-2 text-sm">
              <div className="font-medium">{character.name}</div>
            </div>
          ))}
          {analysisResult.characters.length === 0 && (
            <div className="text-sm text-muted-foreground">No characters detected</div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ScriptAnalysisCharacters;
