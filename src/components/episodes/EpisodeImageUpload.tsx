
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Image } from "lucide-react";

interface EpisodeImageUploadProps {
  coverImagePreview: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EpisodeImageUpload: React.FC<EpisodeImageUploadProps> = ({
  coverImagePreview,
  onImageUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="mb-4">
      <div className="flex flex-col items-center gap-2">
        {coverImagePreview ? (
          <div className="w-full aspect-video rounded-md overflow-hidden bg-anime-gray-200">
            <img 
              src={coverImagePreview} 
              alt="Cover preview" 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div 
            className="w-full aspect-video border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={handleUploadButtonClick}
          >
            <Image className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No cover image yet</p>
            <p className="text-xs text-muted-foreground">Click to upload</p>
          </div>
        )}
        
        <div className="flex justify-center mt-2">
          <Input
            id="coverImage"
            name="coverImage"
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
            ref={fileInputRef}
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleUploadButtonClick}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {coverImagePreview ? 'Change Cover' : 'Upload Cover'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EpisodeImageUpload;
