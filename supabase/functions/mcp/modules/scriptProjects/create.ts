
import { McpFunction } from '../../router.ts';
import { supabase } from './utils.ts';

export const createProject: McpFunction = {
  description: "Creates a new script project",
  parameters: {
    title: {
      type: "string",
      description: "The title of the new project",
      required: true
    },
    description: {
      type: "string",
      description: "A description of the project"
    },
    type: {
      type: "string",
      description: "The type of project",
      enum: ["film", "series", "book", "audio", "social_video"]
    },
    user_id: {
      type: "string",
      description: "The user ID who owns this project",
      required: true
    }
  },
  execute: async (args: any) => {
    const { title, description, type = 'film', user_id } = args;
    
    if (!title) {
      throw new Error("Project title is required");
    }
    
    if (!user_id) {
      throw new Error("User ID is required");
    }

    // Create the project in the database
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title,
        description,
        type,
        user_id
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create project: ${error.message}`);
    }

    return data;
  }
};
