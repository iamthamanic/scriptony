
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { WorldFormData } from '@/types';
import { Upload } from 'lucide-react';

interface NewWorldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WorldFormData) => void;
}

const NewWorldModal = ({ isOpen, onClose, onSubmit }: NewWorldModalProps) => {
  const [formData, setFormData] = useState<WorldFormData>({
    name: '',
    description: '',
  });
  
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, cover_image: file }));
      
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-anime-purple">Neue Welt erstellen</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name der Welt</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="z.B. Kontinent Silkat"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Eine kurze Beschreibung deiner Welt..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover-Bild (Optional)</Label>
            <div className="flex flex-col gap-4 items-start">
              <div className="w-full">
                <div className="border-2 border-dashed border-border rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Label htmlFor="coverImage" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {coverImagePreview ? 'Bild ändern' : 'Bild hochladen'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Empfohlen: 1200×630px
                    </span>
                  </Label>
                </div>
              </div>
              
              {coverImagePreview && (
                <div className="w-full">
                  <div className="aspect-video rounded-md overflow-hidden bg-anime-gray-200">
                    <img 
                      src={coverImagePreview} 
                      alt="Cover-Vorschau" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Abbrechen
            </Button>
            <Button 
              type="submit" 
              className="bg-anime-purple hover:bg-anime-dark-purple"
              disabled={!formData.name}
            >
              Welt erstellen
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewWorldModal;
