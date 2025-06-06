
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Image, Trash2, Upload } from 'lucide-react';
import { toast } from "sonner";
import { uploadFile, handleUploadError } from "@/services/storage/fileStorage";
import DriveConnectionModal from '@/components/storage/DriveConnectionModal';

interface ImageUploaderProps {
  imageUrl?: string;
  onImageChange: (url: string | undefined) => void;
  disableToast?: boolean;
  category?: string;
  projectId?: string;
  projectName?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  imageUrl, 
  onImageChange, 
  disableToast = false,
  category = 'images',
  projectId,
  projectName
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [componentId] = useState(`uploader-${Math.random().toString(36).substring(2, 9)}`);
  const [showDriveModal, setShowDriveModal] = useState(false);

  // Log when component mounts or imageUrl changes
  useEffect(() => {
    console.log(`[${componentId}] ImageUploader (${category}) initialized with URL:`, imageUrl);
    // Return cleanup function to log when component unmounts
    return () => {
      console.log(`[${componentId}] ImageUploader (${category}) unmounted with final URL:`, imageUrl);
    };
  }, [componentId, category]);
  
  // Log when the URL changes
  useEffect(() => {
    console.log(`[${componentId}] ImageUploader (${category}) URL updated:`, imageUrl);
  }, [imageUrl, componentId, category]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      setUploading(true);
      console.log(`[${componentId}] Starting upload for ${category} with file:`, file.name);

      const uploadResult = await uploadFile(file, {
        category,
        projectId,
        projectName
      });
      
      // Check if connection to Drive is required
      if (!uploadResult.success) {
        if (uploadResult.requiresDriveConnection) {
          setShowDriveModal(true);
          return;
        }
        
        throw new Error(uploadResult.error || 'Upload fehlgeschlagen');
      }

      console.log(`[${componentId}] Image uploaded successfully for ${category}, URL:`, uploadResult.fileUrl);
      
      // Update the local state
      onImageChange(uploadResult.fileUrl);
      console.log(`[${componentId}] Called onImageChange with URL:`, uploadResult.fileUrl);
      
      // Only show toast if not disabled
      if (!disableToast) {
        toast.success('Bild erfolgreich hochgeladen');
      }
    } catch (error: any) {
      console.error(`[${componentId}] Error uploading image for ${category}:`, error);
      setError(error.message || 'Unbekannter Fehler');
      toast.error(`Fehler beim Hochladen: ${error.message || 'Unbekannter Fehler'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    console.log(`[${componentId}] Removing image for ${category}:`, imageUrl);
    
    // Remove the reference from the local state
    onImageChange(undefined);
    console.log(`[${componentId}] Called onImageChange with undefined to remove image`);
    
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
              onError={() => {
                console.error(`[${componentId}] Failed to load image:`, imageUrl);
                setError("Bild konnte nicht geladen werden");
              }}
              onLoad={() => console.log(`[${componentId}] Image successfully loaded:`, imageUrl)}
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
          onClick={() => document.getElementById(`image-upload-${category}-${componentId}`)?.click()}
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
          id={`image-upload-${category}-${componentId}`} 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>
      
      {/* Drive Connection Modal */}
      <DriveConnectionModal 
        isOpen={showDriveModal} 
        onClose={() => setShowDriveModal(false)}
        showCloseButton={true}
      />
    </div>
  );
};

export default ImageUploader;
