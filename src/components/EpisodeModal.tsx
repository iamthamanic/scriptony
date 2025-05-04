
import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image } from "lucide-react";
import { Episode, NewEpisodeFormData, EditEpisodeFormData } from "../types";

interface EpisodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewEpisodeFormData | EditEpisodeFormData) => void;
  episode?: Episode | null;
  lastEpisodeNumber?: number;
}

const EpisodeModal = ({
  isOpen,
  onClose,
  onSubmit,
  episode,
  lastEpisodeNumber = 0
}: EpisodeModalProps) => {
  const [formData, setFormData] = useState<NewEpisodeFormData | EditEpisodeFormData>({
    title: "",
    number: lastEpisodeNumber + 1,
    description: ""
  });
  
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (episode) {
      setFormData({
        title: episode.title,
        number: episode.number,
        description: episode.description
      });
      
      if (episode.coverImage) {
        setCoverImagePreview(episode.coverImage);
      }
    } else {
      setFormData({
        title: "",
        number: lastEpisodeNumber + 1,
        description: ""
      });
      setCoverImagePreview(null);
    }
  }, [episode, lastEpisodeNumber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, coverImage: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = (): boolean => {
    return !!formData.title && !!formData.number && !!formData.description;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-anime-purple">
            {episode ? `Edit Episode ${episode.number}` : 'Create New Episode'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Cover image */}
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
                  onChange={handleImageUpload}
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

          <div className="space-y-2">
            <Label htmlFor="number">Episode Number</Label>
            <Input
              id="number"
              name="number"
              type="number"
              value={formData.number}
              onChange={handleChange}
              min={1}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Episode Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter episode title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter episode description"
              required
              rows={4}
            />
          </div>
          
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid()}
              className="bg-anime-purple hover:bg-anime-dark-purple"
            >
              {episode ? 'Update Episode' : 'Create Episode'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EpisodeModal;
