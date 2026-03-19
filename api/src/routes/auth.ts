import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3),
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function authRoutes(app: FastifyInstance, options: FastifyPluginOptions) {
  // Sign up
  app.post('/signup', async (request, reply) => {
    try {
      const { email, password, username } = signupSchema.parse(request.body);
      
      // Check if user exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return reply.status(400).send({ error: 'User already exists' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
        },
      });
      
      // Create session
      const session = await prisma.session.create({
        data: {
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });
      
      // Generate JWT
      const token = app.jwt.sign({ userId: user.id, sessionId: session.id });
      
      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
        },
        session: {
          id: session.id,
          userId: session.userId,
          expiresAt: session.expiresAt,
        },
        token,
      };
    } catch (error) {
      app.log.error(error);
      return reply.status(400).send({ error: 'Invalid input' });
    }
  });
  
  // Sign in
  app.post('/signin', async (request, reply) => {
    try {
      const { email, password } = signinSchema.parse(request.body);
      
      // Find user
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }
      
      // Verify password
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }
      
      // Create session
      const session = await prisma.session.create({
        data: {
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
      
      // Generate JWT
      const token = app.jwt.sign({ userId: user.id, sessionId: session.id });
      
      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
        },
        session: {
          id: session.id,
          userId: session.userId,
          expiresAt: session.expiresAt,
        },
        token,
      };
    } catch (error) {
      app.log.error(error);
      return reply.status(400).send({ error: 'Invalid input' });
    }
  });
  
  // Sign out
  app.post('/signout', { preHandler: [app.authenticate] }, async (request, reply) => {
    try {
      const { sessionId } = request.user as { sessionId: string };
      
      await prisma.session.delete({
        where: { id: sessionId },
      });
      
      return { success: true };
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: 'Failed to sign out' });
    }
  });
  
  // Get session
  app.get('/session', { preHandler: [app.authenticate] }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      
      if (!user) {
        return reply.status(401).send({ error: 'User not found' });
      }
      
      const session = await prisma.session.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      
      return {
        session: session ? {
          id: session.id,
          userId: session.userId,
          expiresAt: session.expiresAt,
        } : null,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: 'Failed to get session' });
    }
  });
  
  // Google OAuth (placeholder)
  app.get('/google', async (request, reply) => {
    // TODO: Implement Google OAuth
    return { url: 'https://accounts.google.com/o/oauth2/v2/auth?...' };
  });
  
  // OAuth callback (placeholder)
  app.post('/callback', async (request, reply) => {
    // TODO: Implement OAuth callback
    return { error: 'Not implemented' };
  });
  
  // Reset password (placeholder)
  app.post('/reset-password', async (request, reply) => {
    // TODO: Implement password reset
    return { success: true };
  });
  
  // Update password (placeholder)
  app.post('/update-password', { preHandler: [app.authenticate] }, async (request, reply) => {
    // TODO: Implement password update
    return { success: true };
  });
}
