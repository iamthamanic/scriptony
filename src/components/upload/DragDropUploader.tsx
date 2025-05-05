
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';

interface DragDropUploaderProps {
  isAnalyzing: boolean;
  onFileSelect: (file: File) => void;
}

const DragDropUploader: React.FC<DragDropUploaderProps> = ({ isAnalyzing, onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
      // Clear the input
      e.target.value = '';
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        dragActive ? 'border-anime-purple bg-anime-light-purple/50' : 'border-gray-300'
      } transition-colors`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="p-4 rounded-full bg-anime-light-purple text-anime-purple">
          <UploadCloud className="h-8 w-8" />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Ziehe dein Skript hierher oder</h3>
          <p className="text-sm text-muted-foreground">
            Unterstützte Dateien: PDF, DOCX, TXT (max. 10MB)
          </p>
        </div>
        
        <label>
          <Button 
            className="bg-anime-purple hover:bg-anime-dark-purple"
            disabled={isAnalyzing}
          >
            Datei auswählen
            <input
              type="file"
              className="hidden"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              disabled={isAnalyzing}
            />
          </Button>
        </label>
      </div>
      
      {isAnalyzing && (
        <div className="mt-4 text-center">
          <p className="text-muted-foreground animate-pulse">
            Analyse läuft... Dies kann einen Moment dauern.
          </p>
        </div>
      )}
    </div>
  );
};

export default DragDropUploader;
