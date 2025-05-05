
import { useToast } from '@/hooks/use-toast';

export const useFileValidation = () => {
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    // Check file type
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(fileExt || '')) {
      toast({
        title: "Ungültiger Dateityp",
        description: "Bitte lade eine PDF-, DOCX- oder TXT-Datei hoch",
        variant: "destructive"
      });
      return false;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Datei zu groß",
        description: "Maximale Dateigröße beträgt 10MB",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  return { validateFile };
};
