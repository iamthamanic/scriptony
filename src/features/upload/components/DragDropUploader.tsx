
import React from 'react';

interface DragDropUploaderProps {
  isAnalyzing: boolean;
  onFileSelect: (file: File) => void;
}

// This is a stub component that would be implemented with the full DragDropUploader functionality
const DragDropUploader = ({ isAnalyzing, onFileSelect }: DragDropUploaderProps) => {
  return (
    <div 
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-anime-purple transition-colors"
      onClick={() => {
        if (!isAnalyzing) {
          // Implement file selection logic
        }
      }}
    >
      {isAnalyzing ? (
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-t-2 border-anime-purple rounded-full animate-spin mb-4" />
          <p>Analysiere Skript...</p>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="mb-2">Drag and drop your script file here, or click to browse</p>
          <p className="text-sm text-muted-foreground">Supported formats: PDF, DOCX, TXT</p>
        </div>
      )}
    </div>
  );
};

export default DragDropUploader;
