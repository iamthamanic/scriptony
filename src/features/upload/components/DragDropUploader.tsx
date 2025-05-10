
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUp } from 'lucide-react';

interface DragDropUploaderProps {
  isAnalyzing: boolean;
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string[];
}

const DragDropUploader = ({ 
  isAnalyzing, 
  onFileSelect,
  acceptedFileTypes = ['.pdf', '.docx', '.txt']
}: DragDropUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    disabled: isAnalyzing,
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
        dragActive ? 'border-anime-purple bg-anime-purple/5' : 'border-gray-300 hover:border-anime-purple'
      }`}
      onDragEnter={() => setDragActive(true)}
      onDragLeave={() => setDragActive(false)}
      onDrop={() => setDragActive(false)}
    >
      <input {...getInputProps()} />

      {isAnalyzing ? (
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-t-2 border-anime-purple rounded-full animate-spin mb-4" />
          <p>Analysiere Skript...</p>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex justify-center">
            <FileUp className="h-12 w-12 text-muted-foreground" />
          </div>
          <p className="mb-2 text-lg font-medium">Drag and drop your script file here, or click to browse</p>
          <p className="text-sm text-muted-foreground">
            Supported formats: {acceptedFileTypes.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default DragDropUploader;
