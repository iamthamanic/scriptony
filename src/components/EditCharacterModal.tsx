
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Character } from "../types";

interface EditCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditCharacterFormData) => void;
  character: Character;
}

export interface EditCharacterFormData {
  name: string;
  role: string;
  description: string;
  avatar?: File;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  description: z.string().min(1, "Description is required"),
  avatar: z.instanceof(File).optional(),
});

const EditCharacterModal = ({ isOpen, onClose, onSubmit, character }: EditCharacterModalProps) => {
  const form = useForm<EditCharacterFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: character.name,
      role: character.role,
      description: character.description,
    },
  });

  const handleSubmit = (data: EditCharacterFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Character</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter character name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. Protagonist, Antagonist, Supporting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the character's personality, goals, and background..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatar"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Character Image</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      {character.avatar && (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden">
                          <img
                            src={character.avatar}
                            alt={character.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                        {...fieldProps}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCharacterModal;
