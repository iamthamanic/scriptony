
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useFileUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Navigate to the upload page with the file
    toast({
      title: "Processing script",
      description: "Redirecting to upload page for script analysis"
    });
    
    // In a real implementation, we would store the file in a context
    // or use a state management library to pass it to the upload page
    navigate('/upload');
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return {
    fileInputRef,
    handleFileChange,
    triggerFileUpload
  };
};

export default useFileUpload;
