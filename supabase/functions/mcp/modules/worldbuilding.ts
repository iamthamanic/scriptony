
import { McpFunction } from '../router.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export const createWorld: McpFunction = {
  description: "Creates a new world for worldbuilding",
  parameters: {
    name: {
      type: "string",
      description: "Name of the world",
      required: true
    },
    description: {
      type: "string",
      description: "Description of the world"
    },
    user_id: {
      type: "string",
      description: "The user ID who owns this world",
      required: true
    }
  },
  execute: async (args: any) => {
    const { name, description, user_id } = args;
    
    if (!name) {
      throw new Error("World name is required");
    }
    
    if (!user_id) {
      throw new Error("User ID is required");
    }

    // Create the world in the database
    const { data, error } = await supabase
      .from('worlds')
      .insert({
        name,
        description,
        user_id
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create world: ${error.message}`);
    }

    // Create default categories
    const DEFAULT_CATEGORIES = [
      { type: 'geography', name: 'Geografie', icon: 'map', order_index: 0 },
      { type: 'politics', name: 'Politik', icon: 'landmark', order_index: 1 },
      { type: 'economy', name: 'Wirtschaft', icon: 'coins', order_index: 2 },
      { type: 'society', name: 'Gesellschaft', icon: 'users', order_index: 3 },
    ];

    const categories = DEFAULT_CATEGORIES.map(cat => ({
      world_id: data.id,
      ...cat,
      content: {}
    }));

    const { error: catError } = await supabase
      .from('world_categories')
      .insert(categories);

    if (catError) {
      console.error("Failed to create default categories:", catError);
    }

    return data;
  }
};

export const addCategory: McpFunction = {
  description: "Adds a category to a world",
  parameters: {
    world_id: {
      type: "string",
      description: "ID of the world",
      required: true
    },
    name: {
      type: "string",
      description: "Name of the category",
      required: true
    },
    type: {
      type: "string",
      description: "Type of category",
      required: true,
      enum: ['geography', 'politics', 'economy', 'society', 'religion', 'history', 'technology', 'nature', 'language', 'culture', 'custom']
    },
    icon: {
      type: "string",
      description: "Icon for the category"
    }
  },
  execute: async (args: any) => {
    const { world_id, name, type, icon } = args;
    
    if (!world_id) {
      throw new Error("World ID is required");
    }
    
    if (!name) {
      throw new Error("Category name is required");
    }
    
    if (!type) {
      throw new Error("Category type is required");
    }

    // Get the highest order_index for this world
    const { data: existingCategories, error: fetchError } = await supabase
      .from('world_categories')
      .select('order_index')
      .eq('world_id', world_id)
      .order('order_index', { ascending: false })
      .limit(1);
      
    if (fetchError) {
      throw new Error(`Failed to fetch existing categories: ${fetchError.message}`);
    }
    
    const nextOrderIndex = existingCategories.length > 0 ? existingCategories[0].order_index + 1 : 0;
    
    // Create empty content structure based on type
    let content = {};
    if (type === 'geography') {
      content = { countries: [] };
    } else if (type === 'politics') {
      content = { systems: [] };
    } else if (type === 'economy') {
      content = { entities: [] };
    } else if (type === 'society') {
      content = { groups: [] };
    } else if (type === 'culture') {
      content = { elements: [] };
    }

    // Create the category
    const { data, error } = await supabase
      .from('world_categories')
      .insert({
        world_id,
        name,
        type,
        icon,
        content,
        order_index: nextOrderIndex
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }

    return data;
  }
};

export const addCountry: McpFunction = {
  description: "Adds a country to a geography category",
  parameters: {
    category_id: {
      type: "string",
      description: "ID of the geography category",
      required: true
    },
    name: {
      type: "string",
      description: "Name of the country",
      required: true
    },
    description: {
      type: "string",
      description: "Description of the country"
    }
  },
  execute: async (args: any) => {
    const { category_id, name, description } = args;
    
    if (!category_id) {
      throw new Error("Category ID is required");
    }
    
    if (!name) {
      throw new Error("Country name is required");
    }

    // Get the current category data
    const { data: category, error: fetchError } = await supabase
      .from('world_categories')
      .select('content, type')
      .eq('id', category_id)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch category: ${fetchError.message}`);
    }

    // Verify it's a geography category
    if (category.type !== 'geography') {
      throw new Error("Category is not of type geography");
    }

    // Create or update the content
    const content = category.content || { countries: [] };
    
    // Add the new country
    const newCountry = {
      id: crypto.randomUUID(),
      name,
      description: description || '',
      locations: [],
      customFields: []
    };
    
    content.countries = [...(content.countries || []), newCountry];

    // Update the category with the new content
    const { error } = await supabase
      .from('world_categories')
      .update({ content })
      .eq('id', category_id);

    if (error) {
      throw new Error(`Failed to add country: ${error.message}`);
    }

    return newCountry;
  }
};
