
import React from 'react';
import { Layout } from 'lucide-react';
import { AnalysisResult } from '@/types';

interface ScriptAnalysisStructureProps {
  analysisResult: AnalysisResult;
}

const ScriptAnalysisStructure = ({ analysisResult }: ScriptAnalysisStructureProps) => {
  return (
    <div>
      <h4 className="text-sm font-medium flex items-center mb-2">
        <Layout className="h-4 w-4 mr-1.5 text-muted-foreground" />
        Structure
      </h4>
      <div className="bg-muted rounded-md p-3 text-sm">
        <div className="flex justify-between">
          <span>Narrative Structure:</span>
          <span className="font-medium">
            {analysisResult.narrative_structure?.replace('_', ' ') || 'None'}
          </span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Duration:</span>
          <span className="font-medium">{analysisResult.duration} minutes</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Scene Count:</span>
          <span className="font-medium">{analysisResult.scenes?.length || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default ScriptAnalysisStructure;
