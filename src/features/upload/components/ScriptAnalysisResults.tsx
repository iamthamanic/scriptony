
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AnalysisResult } from '@/types';

interface ScriptAnalysisResultsProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResult: AnalysisResult | null;
  onCreateProject: (data: any) => void;
  isLoading: boolean;
}

// This is a stub component that would be implemented with the full ScriptAnalysisResults functionality
const ScriptAnalysisResults = ({
  isOpen,
  onClose,
  analysisResult,
  onCreateProject,
  isLoading
}: ScriptAnalysisResultsProps) => {
  if (!analysisResult) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Script Analysis Results</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Detected Information</h3>
          <p>Title: {analysisResult.title || "Unknown"}</p>
          <p>Scenes detected: {analysisResult.scenes?.length || 0}</p>
          <p>Characters detected: {analysisResult.characters?.length || 0}</p>
          
          <div className="mt-6 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-3 py-1 border rounded-md"
            >
              Cancel
            </button>
            <button 
              onClick={() => onCreateProject(analysisResult)}
              className="px-3 py-1 bg-anime-purple text-white rounded-md"
              disabled={isLoading}
            >
              Create Project
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScriptAnalysisResults;
