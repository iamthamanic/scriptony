
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Image, Trash2, Upload } from 'lucide-react';
import { customSupabase } from "@/integrations/supabase/customClient";
import { toast } from "sonner";

interface ImageUploaderProps {
  imageUrl?: string;
  onImageChange: (url: string | undefined) => void;
  disableToast?: boolean;
  category?: string; // To specify which category the image belongs to
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  imageUrl, 
  onImageChange, 
  disableToast = false,
  category = 'geography'
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Log when component mounts or imageUrl changes
  React.useEffect(() => {
    console.log(`ImageUploader (${category}) initialized with URL:`, imageUrl);
  }, [imageUrl, category]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      setUploading(true);
      console.log(`Starting upload for ${category} with file:`, file.name);

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${category}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = fileName;

      // Make sure the storage bucket exists
      const { error: uploadError } = await customSupabase.storage
        .from('covers')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get the public URL
      const { data } = customSupabase.storage
        .from('covers')
        .getPublicUrl(filePath);

      console.log(`Image uploaded successfully for ${category}, URL:`, data.publicUrl);
      
      // Update the local state
      onImageChange(data.publicUrl);
      
      // Only show toast if not disabled
      if (!disableToast) {
        toast.success('Bild erfolgreich hochgeladen');
      }
    } catch (error: any) {
      console.error(`Error uploading image for ${category}:`, error);
      setError(error.message || 'Unbekannter Fehler');
      toast.error(`Fehler beim Hochladen: ${error.message || 'Unbekannter Fehler'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    console.log(`Removing image for ${category}:`, imageUrl);
    
    // Remove the reference from the local state
    onImageChange(undefined);
    
    // Only show toast if not disabled
    if (!disableToast) {
      toast.success('Bild entfernt');
    }
  };

  return (
    <div className="space-y-2">
      <div className="border rounded-md p-2 min-h-32 flex items-center justify-center">
        {imageUrl ? (
          <div className="w-full">
            <img 
              src={imageUrl} 
              alt="Uploaded" 
              className="max-h-32 max-w-full mx-auto object-contain rounded" 
            />
          </div>
        ) : (
          <div className="text-center p-4">
            <Image className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Kein Bild ausgewählt</p>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => document.getElementById(`image-upload-${category}`)?.click()}
          disabled={uploading}
        >
          <Upload className="h-4 w-4 mr-2" /> {uploading ? 'Lädt...' : 'Bild hochladen'}
        </Button>
        
        {imageUrl && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRemoveImage}
            disabled={uploading}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        
        <input 
          id={`image-upload-${category}`} 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>
    </div>
  );
};

export default ImageUploader;
