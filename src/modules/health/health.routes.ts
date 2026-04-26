import mongoose from 'mongoose';
import { FastifyInstance } from 'fastify';
import { getIngestionService } from '../ingestion/service.js';
import { QueryService } from '../query/service.js';
import { successResponse } from '@shared/utils/response';

export async function healthRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/health', async (_request, reply) => {
    const ingestionService = getIngestionService();
    const bufferStats = ingestionService.getBufferStats();

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      buffer: bufferStats,
      mongodb: {
        connected: mongoose.connection.readyState === 1,
      },
    };

    reply.status(200).send(successResponse(health));
  });

  fastify.get('/metrics', async (_request, reply) => {
    const ingestionService = getIngestionService();
    const bufferStats = ingestionService.getBufferStats();
    const queryService = new QueryService();
    const stats = await queryService.getStatistics();

    const metrics = {
      buffer: bufferStats,
      logs: stats,
      timestamp: new Date().toISOString(),
    };

    reply.status(200).send(successResponse(metrics));
  });
}
