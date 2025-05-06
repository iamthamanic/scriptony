
import { McpFunction } from '../../router.ts';
import { supabase } from './utils.ts';

export const createProjectDevMode: McpFunction = {
  description: "Creates a new script project in development mode, bypassing RLS",
  parameters: {
    title: {
      type: "string",
      description: "The title of the project",
      required: true
    },
    type: {
      type: "string",
      description: "The type of project",
      required: true
    },
    user_id: {
      type: "string", 
      description: "The user ID who will own this project",
      required: true
    },
    logline: {
      type: "string",
      description: "A brief summary of the project"
    },
    genres: {
      type: "array",
      description: "The genres of the project"
    },
    duration: {
      type: "string",
      description: "The duration of the project"
    },
    video_format: {
      type: "string",
      description: "The video format for social_video type projects"
    },
    narrative_structure: {
      type: "string",
      description: "The narrative structure of the project"
    },
    cover_image_url: {
      type: "string",
      description: "URL to the cover image"
    },
    inspirations: {
      type: "string",
      description: "Comma-separated list of inspirations"
    },
    world_id: {
      type: "string",
      description: "The ID of the connected world, if any"
    }
  },
  execute: async (args: any) => {
    const { 
      title, 
      type, 
      user_id,
      logline = "",
      genres = [],
      duration = "",
      video_format = null,
      narrative_structure = "none",
      cover_image_url = null,
      inspirations = "",
      world_id = null
    } = args;
    
    if (!title || !type || !user_id) {
      throw new Error("Missing required parameters");
    }

    // Create the project using the service role client which bypasses RLS
    const { data, error } = await supabase
      .rpc('create_project_dev_mode', {
        p_title: title,
        p_type: type,
        p_user_id: user_id,
        p_logline: logline,
        p_genres: genres,
        p_duration: duration,
        p_video_format: video_format,
        p_narrative_structure: narrative_structure,
        p_cover_image_url: cover_image_url,
        p_inspirations: inspirations,
        p_world_id: world_id
      });

    if (error) {
      throw new Error(`Failed to create project in dev mode: ${error.message}`);
    }

    return data;
  }
};
