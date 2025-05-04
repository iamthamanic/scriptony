
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EpisodeFormFieldsProps {
  number: number;
  title: string;
  description: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const EpisodeFormFields: React.FC<EpisodeFormFieldsProps> = ({
  number,
  title,
  description,
  handleChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="number">Episode Number</Label>
        <Input
          id="number"
          name="number"
          type="number"
          value={number}
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
          value={title}
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
          value={description}
          onChange={handleChange}
          placeholder="Enter episode description"
          required
          rows={4}
        />
      </div>
    </>
  );
};

export default EpisodeFormFields;
