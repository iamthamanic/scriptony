
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Episode, NewEpisodeFormData, EditEpisodeFormData } from "../../types";
import EpisodeImageUpload from "./EpisodeImageUpload";
import EpisodeFormFields from "./EpisodeFormFields";

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
          <EpisodeImageUpload 
            coverImagePreview={coverImagePreview}
            onImageUpload={handleImageUpload}
          />

          <EpisodeFormFields
            number={Number(formData.number)}
            title={formData.title}
            description={formData.description}
            handleChange={handleChange}
          />
          
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
