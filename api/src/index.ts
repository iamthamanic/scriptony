import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { projectRoutes } from './routes/projects';
import { characterRoutes } from './routes/characters';
import { sceneRoutes } from './routes/scenes';
import { episodeRoutes } from './routes/episodes';
import { worldRoutes } from './routes/worlds';
import { storageRoutes } from './routes/storage';

dotenv.config();

// Extend FastifyInstance to include authenticate method
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

async function buildApp(): Promise<FastifyInstance> {
  const app = fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });

  // Register plugins
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:8080', 'http://localhost:3000'],
    credentials: true,
  });

  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  });

  await app.register(multipart, {
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB
    },
  });

  // Decorate fastify instance with auth decorator
  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });

  // Health check endpoint
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Register routes
  await app.register(authRoutes, { prefix: '/auth' });
  await app.register(userRoutes, { prefix: '/users' });
  await app.register(projectRoutes, { prefix: '/projects' });
  await app.register(characterRoutes, { prefix: '/characters' });
  await app.register(sceneRoutes, { prefix: '/scenes' });
  await app.register(episodeRoutes, { prefix: '/episodes' });
  await app.register(worldRoutes, { prefix: '/worlds' });
  await app.register(storageRoutes, { prefix: '/storage' });

  return app;
}

async function start() {
  try {
    const app = await buildApp();
    const port = parseInt(process.env.PORT || '3000');
    const host = process.env.HOST || '0.0.0.0';
    
    await app.listen({ port, host });
    app.log.info(`Server listening on ${host}:${port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
