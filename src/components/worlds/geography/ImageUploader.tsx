
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Image, Trash2, Upload } from 'lucide-react';
import { customSupabase } from "@/integrations/supabase/customClient";
import { toast } from "sonner";

interface ImageUploaderProps {
  imageUrl?: string;
  onImageChange: (url: string | undefined) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ imageUrl, onImageChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `geography/${fileName}`;

      // Make sure the storage bucket exists (you'd need to create it in Supabase first)
      const { error: uploadError } = await customSupabase.storage
        .from('covers')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data } = customSupabase.storage
        .from('covers')
        .getPublicUrl(filePath);

      onImageChange(data.publicUrl);
      toast.success('Bild erfolgreich hochgeladen');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(`Fehler beim Hochladen: ${error.message || 'Unbekannter Fehler'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    // We don't delete from storage to avoid orphaned files
    // Just remove the reference
    onImageChange(undefined);
    toast.success('Bild entfernt');
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
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => document.getElementById('image-upload')?.click()}
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
          id="image-upload" 
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
