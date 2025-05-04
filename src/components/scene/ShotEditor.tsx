
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Shot, ShotType, CameraMovement, CameraPerspective, NewShotFormData } from '../../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Camera, X, Upload } from 'lucide-react';

const shotTypeOptions = [
  { value: 'wide', label: 'Wide Shot' },
  { value: 'medium', label: 'Medium Shot' },
  { value: 'close-up', label: 'Close-Up' },
  { value: 'extreme-close-up', label: 'Extreme Close-Up' },
  { value: 'over-the-shoulder', label: 'Over The Shoulder' },
  { value: 'point-of-view', label: 'Point of View' },
  { value: 'aerial', label: 'Aerial Shot' },
  { value: 'dutch-angle', label: 'Dutch Angle' },
  { value: 'two-shot', label: 'Two Shot' },
  { value: 'other', label: 'Other' }
];

const cameraMovementOptions = [
  { value: 'static', label: 'Static' },
  { value: 'pan', label: 'Pan' },
  { value: 'tilt', label: 'Tilt' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'dolly', label: 'Dolly' },
  { value: 'tracking', label: 'Tracking' },
  { value: 'crane', label: 'Crane' },
  { value: 'steadicam', label: 'Steadicam' },
  { value: 'handheld', label: 'Handheld' },
  { value: 'other', label: 'Other' }
];

const cameraPerspectiveOptions = [
  { value: 'eye-level', label: 'Eye Level' },
  { value: 'high-angle', label: 'High Angle' },
  { value: 'low-angle', label: 'Low Angle' },
  { value: 'birds-eye', label: 'Bird\'s Eye View' },
  { value: 'worms-eye', label: 'Worm\'s Eye View' },
  { value: 'other', label: 'Other' }
];

interface ShotEditorProps {
  shots: Shot[];
  onAddShot: (shot: NewShotFormData) => void;
  onEditShot: (shotId: string, shot: NewShotFormData) => void;
  onDeleteShot: (shotId: string) => void;
  sceneId: string;
}

const ShotEditor = ({
  shots,
  onAddShot,
  onEditShot,
  onDeleteShot,
  sceneId
}: ShotEditorProps) => {
  const [editingShot, setEditingShot] = useState<Shot | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newShot, setNewShot] = useState<NewShotFormData>({
    title: '',
    shotNumber: shots.length + 1,
    shotType: 'medium',
    cameraMovement: 'static',
    description: ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const resetForm = () => {
    setNewShot({
      title: '',
      shotNumber: shots.length + 1,
      shotType: 'medium',
      cameraMovement: 'static',
      description: ''
    });
    setImagePreview(null);
    setEditingShot(null);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewShot(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewShot(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    setNewShot(prev => ({ ...prev, image: file }));
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingShot) {
      onEditShot(editingShot.id, newShot);
    } else {
      onAddShot(newShot);
    }
    
    resetForm();
    setShowForm(false);
  };
  
  const handleEdit = (shot: Shot) => {
    setEditingShot(shot);
    setNewShot({
      title: shot.title,
      shotNumber: shot.shotNumber,
      shotType: shot.shotType,
      cameraMovement: shot.cameraMovement,
      cameraPerspective: shot.cameraPerspective,
      timecodeStart: shot.timecodeStart,
      timecodeEnd: shot.timecodeEnd,
      description: shot.description,
      aiNotes: shot.aiNotes
    });
    
    if (shot.image) {
      setImagePreview(shot.image);
    }
    
    setShowForm(true);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Shots ({shots.length})
        </h3>
        
        <Button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="bg-anime-purple hover:bg-anime-dark-purple"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          {showForm ? "Cancel" : "Add Shot"}
        </Button>
      </div>
      
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-muted/30 p-4 rounded-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Shot Title</Label>
              <Input
                id="title"
                name="title"
                value={newShot.title}
                onChange={handleInputChange}
                placeholder="e.g., Hero enters the room"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="shotNumber">Shot Number</Label>
              <Input
                id="shotNumber"
                name="shotNumber"
                type="number"
                min={1}
                value={newShot.shotNumber}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="shotType">Shot Type</Label>
              <Select
                value={newShot.shotType}
                onValueChange={(value) => handleSelectChange('shotType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shot type" />
                </SelectTrigger>
                <SelectContent>
                  {shotTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="cameraMovement">Camera Movement</Label>
              <Select
                value={newShot.cameraMovement}
                onValueChange={(value) => handleSelectChange('cameraMovement', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select camera movement" />
                </SelectTrigger>
                <SelectContent>
                  {cameraMovementOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="cameraPerspective">Camera Perspective (Optional)</Label>
              <Select
                value={newShot.cameraPerspective || 'none'}
                onValueChange={(value) => handleSelectChange('cameraPerspective', value === 'none' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select perspective" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {cameraPerspectiveOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timecodeStart">Start Timecode (Optional)</Label>
              <Input
                id="timecodeStart"
                name="timecodeStart"
                value={newShot.timecodeStart || ''}
                onChange={handleInputChange}
                placeholder="00:00:00"
              />
            </div>
            
            <div>
              <Label htmlFor="timecodeEnd">End Timecode (Optional)</Label>
              <Input
                id="timecodeEnd"
                name="timecodeEnd"
                value={newShot.timecodeEnd || ''}
                onChange={handleInputChange}
                placeholder="00:00:00"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={newShot.description}
              onChange={handleInputChange}
              placeholder="Describe what happens in this shot..."
              required
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <Label htmlFor="aiNotes">AI Generation Notes (Optional)</Label>
            <Textarea
              id="aiNotes"
              name="aiNotes"
              value={newShot.aiNotes || ''}
              onChange={handleInputChange}
              placeholder="Add notes for AI image generation..."
              className="min-h-[60px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Shot Image/Sketch (Optional)</Label>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </Button>
              </div>
              
              {imagePreview && (
                <div className="h-20 w-32 rounded-md overflow-hidden border border-muted">
                  <img 
                    src={imagePreview} 
                    alt="Shot preview" 
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              className="bg-anime-purple hover:bg-anime-dark-purple"
            >
              {editingShot ? 'Update Shot' : 'Add Shot'}
            </Button>
          </div>
        </form>
      )}
      
      {shots.length > 0 ? (
        <div className="space-y-2">
          {shots.sort((a, b) => a.shotNumber - b.shotNumber).map((shot) => (
            <div 
              key={shot.id} 
              className="bg-muted/20 p-3 rounded-md flex items-start gap-3 hover:bg-muted/30 transition-colors"
            >
              {shot.image && (
                <div className="hidden md:block h-20 w-32 rounded-md overflow-hidden border border-muted">
                  <img 
                    src={shot.image} 
                    alt={shot.title} 
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <h4 className="font-medium text-base">{shot.title}</h4>
                  <span className="text-xs bg-anime-light-purple text-anime-purple px-2 py-0.5 rounded-full">
                    Shot {shot.shotNumber}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
                  <span>{shotTypeOptions.find(o => o.value === shot.shotType)?.label}</span>
                  <span>•</span>
                  <span>{cameraMovementOptions.find(o => o.value === shot.cameraMovement)?.label}</span>
                  {shot.cameraPerspective && (
                    <>
                      <span>•</span>
                      <span>{cameraPerspectiveOptions.find(o => o.value === shot.cameraPerspective)?.label}</span>
                    </>
                  )}
                </div>
                
                <p className="mt-1 text-sm line-clamp-2">{shot.description}</p>
                
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDeleteShot(shot.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(shot)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 p-6 rounded-md text-center text-muted-foreground">
          <Camera className="h-12 w-12 mx-auto mb-2 opacity-40" />
          <p>No shots defined for this scene yet.</p>
          <p className="text-sm">Click 'Add Shot' to create your first camera shot.</p>
        </div>
      )}
    </div>
  );
};

export default ShotEditor;
