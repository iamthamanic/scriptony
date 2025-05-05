
import { McpFunction } from '../router.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export const createScene: McpFunction = {
  description: "Creates a new scene in an episode",
  parameters: {
    episode_id: {
      type: "string",
      description: "The episode ID to add the scene to",
      required: true
    },
    title: {
      type: "string",
      description: "The title of the scene",
      required: true
    },
    description: {
      type: "string",
      description: "Description of the scene"
    },
    location: {
      type: "string",
      description: "Location where the scene takes place"
    },
    time_of_day: {
      type: "string",
      description: "Time of day for the scene",
      enum: ["morning", "day", "afternoon", "evening", "night"]
    },
    order_index: {
      type: "number",
      description: "Order of the scene within the episode"
    }
  },
  execute: async (args: any) => {
    const { episode_id, title, description, location, time_of_day, order_index } = args;
    
    if (!episode_id) {
      throw new Error("Episode ID is required");
    }
    
    if (!title) {
      throw new Error("Scene title is required");
    }

    // If no order_index provided, find the highest index and add 1
    let sceneOrderIndex = order_index;
    if (sceneOrderIndex === undefined) {
      const { data: scenes, error: fetchError } = await supabase
        .from('scenes')
        .select('order_index')
        .eq('episode_id', episode_id)
        .order('order_index', { ascending: false })
        .limit(1);
        
      if (fetchError) {
        throw new Error(`Failed to fetch scenes: ${fetchError.message}`);
      }
      
      sceneOrderIndex = scenes.length > 0 ? scenes[0].order_index + 1 : 0;
    }

    // Create the scene
    const { data, error } = await supabase
      .from('scenes')
      .insert({
        episode_id,
        title,
        description,
        location,
        time_of_day,
        order_index: sceneOrderIndex,
        shots: []
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create scene: ${error.message}`);
    }

    return data;
  }
};

export const addCharacterToScene: McpFunction = {
  description: "Adds a character to a scene",
  parameters: {
    scene_id: {
      type: "string",
      description: "The scene ID",
      required: true
    },
    character_id: {
      type: "string",
      description: "The character ID to add",
      required: true
    }
  },
  execute: async (args: any) => {
    const { scene_id, character_id } = args;
    
    if (!scene_id) {
      throw new Error("Scene ID is required");
    }
    
    if (!character_id) {
      throw new Error("Character ID is required");
    }

    // Get the current scene characters
    const { data: scene, error: fetchError } = await supabase
      .from('scenes')
      .select('characters')
      .eq('id', scene_id)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch scene: ${fetchError.message}`);
    }

    // Add the character if not already present
    let characters = scene.characters || [];
    if (!characters.includes(character_id)) {
      characters.push(character_id);
    }

    // Update the scene
    const { data, error } = await supabase
      .from('scenes')
      .update({ characters })
      .eq('id', scene_id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add character to scene: ${error.message}`);
    }

    return data;
  }
};
