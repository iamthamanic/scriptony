import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export async function sceneRoutes(app: FastifyInstance, options: FastifyPluginOptions) {
  // Get all scenes
  app.get('/', { preHandler: [app.authenticate] }, async (request, reply) => {
    return { scenes: [] };
  });
  
  // Create scene
  app.post('/', { preHandler: [app.authenticate] }, async (request, reply) => {
    return { id: 'new-scene-id' };
  });
  
  // Update scene
  app.patch('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    return { id };
  });
  
  // Delete scene
  app.delete('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    return { success: true };
  });
}
