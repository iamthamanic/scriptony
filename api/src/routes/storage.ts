import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import * as Minio from 'minio';

// MinIO client setup
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

const bucketName = process.env.MINIO_BUCKET || 'scriptony-uploads';

export async function storageRoutes(app: FastifyInstance, options: FastifyPluginOptions) {
  // Upload file
  app.post('/upload', { preHandler: [app.authenticate] }, async (request, reply) => {
    try {
      const data = await request.file();
      if (!data) {
        return reply.status(400).send({ error: 'No file uploaded' });
      }
      
      const { bucket, path } = request.query as { bucket: string; path?: string };
      const targetBucket = bucket || bucketName;
      
      // Ensure bucket exists
      const bucketExists = await minioClient.bucketExists(targetBucket);
      if (!bucketExists) {
        await minioClient.makeBucket(targetBucket);
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const filename = path ? `${path}/${timestamp}-${data.filename}` : `${timestamp}-${data.filename}`;
      
      // Upload to MinIO
      await minioClient.putObject(targetBucket, filename, data.file, data.filesize, {
        'Content-Type': data.mimetype,
      });
      
      return {
        data: {
          path: filename,
          bucket: targetBucket,
          fullPath: `${targetBucket}/${filename}`,
        },
      };
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: 'Upload failed' });
    }
  });
  
  // Get public URL
  app.get('/url', { preHandler: [app.authenticate] }, async (request, reply) => {
    try {
      const { bucket, path } = request.query as { bucket: string; path: string };
      const targetBucket = bucket || bucketName;
      
      const url = await minioClient.presignedGetObject(targetBucket, path, 24 * 60 * 60); // 24 hours
      
      return { url };
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: 'Failed to generate URL' });
    }
  });
  
  // Delete file
  app.delete('/delete', { preHandler: [app.authenticate] }, async (request, reply) => {
    try {
      const { bucket, path } = request.body as { bucket: string; path: string };
      const targetBucket = bucket || bucketName;
      
      await minioClient.removeObject(targetBucket, path);
      
      return { success: true };
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: 'Delete failed' });
    }
  });
}
