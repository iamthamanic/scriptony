
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { World, EditWorldFormData } from "@/types";

interface EditWorldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditWorldFormData) => Promise<void>;
  world: World | null;
}

const EditWorldModal = ({
  isOpen,
  onClose,
  onSubmit,
  world
}: EditWorldModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<EditWorldFormData>({
    defaultValues: {
      name: world?.name || '',
      description: world?.description || '',
    }
  });

  // Reset form when modal opens or world changes
  React.useEffect(() => {
    if (isOpen && world) {
      reset({
        name: world.name,
        description: world.description || '',
      });
    }
  }, [isOpen, world, reset]);

  const onSubmitHandler = async (data: EditWorldFormData) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error("Error saving world:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit World</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditWorldModal;
