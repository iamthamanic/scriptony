import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';

export async function sceneRoutes(app: FastifyInstance, options: FastifyPluginOptions) {
  // Get all scenes
  app.get('/', { preHandler: [app.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    return { scenes: [] };
  });
  
  // Create scene
  app.post('/', { preHandler: [app.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    return { id: 'new-scene-id' };
  });
  
  // Update scene
  app.patch('/:id', { preHandler: [app.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    return { id };
  });
  
  // Delete scene
  app.delete('/:id', { preHandler: [app.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    return { success: true };
  });
}