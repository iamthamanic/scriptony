
import { router } from './router.ts';

export interface Manifest {
  app_name: string;
  version: string;
  functions: {
    name: string;
    description: string;
    parameters: Record<string, {
      type: string;
      description: string;
      required?: boolean;
      enum?: string[];
    }>;
  }[];
}

export async function generateManifest(scopes?: any[]): Promise<Manifest> {
  const functions = router.getAllFunctions();
  
  const manifest: Manifest = {
    app_name: "ScriptBuddy",
    version: "1.0.0",
    functions: []
  };

  // Add all registered functions to the manifest, filtered by scopes if provided
  for (const [name, func] of functions.entries()) {
    // If scopes are provided and don't include this function or wildcard, skip it
    if (scopes && !scopes.includes('*') && !scopes.includes(name)) {
      continue;
    }
    
    manifest.functions.push({
      name,
      description: func.description,
      parameters: func.parameters
    });
  }

  return manifest;
}
