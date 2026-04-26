import { FastifyInstance } from 'fastify';
import { QueryService } from './service';
import { QueryController } from './controller';
import { verifyJwt } from '@shared/middleware/auth';

/**
 * Query Routes
 */
export async function queryRoutes(app: FastifyInstance): Promise<void> {
  const queryService = new QueryService();
  const queryController = new QueryController(queryService);

  // Store service in app context
  app.register(async (fastify) => {
    fastify.decorate('queryService', queryService);
  });

  // Search logs - requires auth
  app.get('/logs/search', { preHandler: verifyJwt }, async (request, reply) => {
    await queryController.search(request, reply);
  });

  // Get logs by resource ID - requires auth
  app.get<{ Params: { resourceId: string } }>(
    '/logs/resource/:resourceId',
    { preHandler: verifyJwt },
    async (request, reply) => {
      await queryController.getByResource(request, reply);
    }
  );

  // Get logs by level - requires auth
  app.get<{ Params: { level: string } }>(
    '/logs/level/:level',
    { preHandler: verifyJwt },
    async (request, reply) => {
      await queryController.getByLevel(request, reply);
    }
  );
}
