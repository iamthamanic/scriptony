
export async function validateApiKey(req: Request): Promise<boolean> {
  // Get the Authorization header
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  // Extract the API key
  const apiKey = authHeader.split(' ')[1];
  
  // Get the secret from environment variables
  const secretKey = Deno.env.get('MCP_SECRET');
  
  if (!secretKey) {
    console.error('MCP_SECRET environment variable not set');
    return false;
  }

  // Validate the API key
  return apiKey === secretKey;
}
