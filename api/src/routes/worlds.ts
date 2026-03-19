import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export async function worldRoutes(app: FastifyInstance, options: FastifyPluginOptions) {
  // Get all worlds
  app.get('/', { preHandler: [app.authenticate] }, async (request, reply) => {
    return { worlds: [] };
  });
  
  // Create world
  app.post('/', { preHandler: [app.authenticate] }, async (request, reply) => {
    return { id: 'new-world-id' };
  });
  
  // Get world by ID
  app.get('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    return { id };
  });
  
  // Update world
  app.patch('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    return { id };
  });
  
  // Delete world
  app.delete('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    return { success: true };
  });
  
  // World categories
  app.get('/:id/categories', { preHandler: [app.authenticate] }, async (request, reply) => {
    return { categories: [] };
  });
}
