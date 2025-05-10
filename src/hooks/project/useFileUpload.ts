
import { useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useFileUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Show a toast notification that script analysis is not implemented yet
    toast({
      title: "Script Analysis",
      description: "Script analysis functionality is coming soon.",
      duration: 3000
    });
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
