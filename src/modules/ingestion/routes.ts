import { FastifyInstance } from 'fastify';
import { getIngestionService } from './service';
import { IngestionController } from './controller';

/**
 * Ingestion Routes
 */
export async function ingestionRoutes(app: FastifyInstance): Promise<void> {
  const ingestionService = getIngestionService();
  const ingestionController = new IngestionController(ingestionService);

  // Store service in app context
  app.register(async (fastify) => {
    fastify.decorate('ingestionService', ingestionService);
  });

  // Ingest single log
  app.post('/logs', async (request, reply) => {
    await ingestionController.ingestSingle(request, reply);
  });

  // Ingest bulk logs
  app.post('/logs/bulk', async (request, reply) => {
    await ingestionController.ingestBulk(request, reply);
  });

  // Get ingestion statistics
  app.get('/logs/stats', async (request, reply) => {
    await ingestionController.getStats(request, reply);
  });
}
