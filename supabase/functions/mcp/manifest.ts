
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

export async function generateManifest(): Promise<Manifest> {
  const functions = router.getAllFunctions();
  
  const manifest: Manifest = {
    app_name: "ScriptBuddy",
    version: "1.0.0",
    functions: []
  };

  // Add all registered functions to the manifest
  for (const [name, func] of functions.entries()) {
    manifest.functions.push({
      name,
      description: func.description,
      parameters: func.parameters
    });
  }

  return manifest;
}
