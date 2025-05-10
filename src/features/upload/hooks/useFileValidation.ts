import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

type FileValidationOptions = {
  maxSizeMB?: number;
  allowedTypes?: string[];
};

export const useFileValidation = (options: FileValidationOptions = {}) => {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  
  const {
    maxSizeMB = 10,
    allowedTypes = ['.pdf', '.docx', '.txt', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
  } = options;
  
  const validateFile = (file: File): boolean => {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const errorMessage = `File is too large. Maximum size is ${maxSizeMB}MB.`;
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive"
      });
      setError(errorMessage);
      return false;
    }
    
    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const fileTypeValid = allowedTypes.some(type => {
      // Check if it's a file extension (starts with .)
      if (type.startsWith('.')) {
        return `.${fileExtension}` === type.toLowerCase();
      }
      // Otherwise check the mime type
      return file.type === type;
    });
    
    if (!fileTypeValid) {
      const errorMessage = `Invalid file type. Allowed types: ${allowedTypes.filter(t => t.startsWith('.')).join(', ')}`;
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive"
      });
      setError(errorMessage);
      return false;
    }
    
    // All validations passed
    setError(null);
    return true;
  };
  
  return {
    validateFile,
    error
  };
};
