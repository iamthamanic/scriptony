import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export async function episodeRoutes(app: FastifyInstance, options: FastifyPluginOptions) {
  // Get all episodes
  app.get('/', { preHandler: [app.authenticate] }, async (request, reply) => {
    return { episodes: [] };
  });
  
  // Create episode
  app.post('/', { preHandler: [app.authenticate] }, async (request, reply) => {
    return { id: 'new-episode-id' };
  });
  
  // Update episode
  app.patch('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    return { id };
  });
  
  // Delete episode
  app.delete('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    return { success: true };
  });
}
