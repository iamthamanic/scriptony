
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { isDevelopmentMode } from "@/utils/devMode";

// Import constants from the existing client
const SUPABASE_URL = "https://suvxmnrnldfhfwxvkntv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1dnhtbnJubGRmaGZ3eHZrbnR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNTAyMzEsImV4cCI6MjA2MTkyNjIzMX0.bwMg4PYkxfGyWQ_ekV6TplRhHUDyz53qy_wIGu_MF44";

// Create a custom client with development mode header when needed
const createCustomClient = () => {
  const options: any = {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  };
  
  // Add development mode header in development mode
  if (isDevelopmentMode()) {
    options.global = {
      headers: {
        'x-dev-mode': 'true',
      },
    };
    console.log('Development mode headers applied to Supabase client');
  }
  
  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, options);
};

export const customSupabase = createCustomClient();
