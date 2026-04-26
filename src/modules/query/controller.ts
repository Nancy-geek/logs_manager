import { FastifyRequest, FastifyReply } from 'fastify';
import { QueryService } from './service';
import { logSearchSchema } from '@shared/utils/schemas';
import { successResponse, errorResponse, ErrorCodes } from '@shared/utils/response';
import logger from '@shared/utils/logger';

/**
 * Query Controller
 */
export class QueryController {
  constructor(private queryService: QueryService) {}

  /**
   * Search logs
   */
  async search(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      // Validate user is authenticated
      if (!request.user) {
        return reply.status(401).send(
          errorResponse(ErrorCodes.UNAUTHORIZED, 'Authentication required')
        );
      }

      const query = logSearchSchema.parse(request.query);

      const result = await this.queryService.searchLogs(
        {
          level: query.level,
          message: query.message,
          resourceId: query.resourceId,
          traceId: query.traceId,
          spanId: query.spanId,
          commit: query.commit,
          from: query.from,
          to: query.to,
        },
        query.page,
        query.limit
      );

      reply.send(successResponse(result));
    } catch (error) {
      logger.error('Search error:', error);

      if (error instanceof Error && error.message === 'Failed to search logs') {
        return reply.status(500).send(
          errorResponse(ErrorCodes.DATABASE_ERROR, 'Failed to search logs')
        );
      }

      reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Invalid search parameters')
      );
    }
  }

  /**
   * Get logs by resource ID
   */
  async getByResource(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      if (!request.user) {
        return reply.status(401).send(
          errorResponse(ErrorCodes.UNAUTHORIZED, 'Authentication required')
        );
      }

      const { resourceId } = request.params as { resourceId: string };
      const { page = '1', limit = '50' } = request.query as any;

      const result = await this.queryService.getByResourceId(
        resourceId,
        parseInt(page),
        parseInt(limit)
      );

      reply.send(successResponse(result));
    } catch (error) {
      logger.error('Get by resource error:', error);
      reply.status(500).send(
        errorResponse(ErrorCodes.DATABASE_ERROR, 'Failed to fetch logs')
      );
    }
  }

  /**
   * Get logs by level
   */
  async getByLevel(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      if (!request.user) {
        return reply.status(401).send(
          errorResponse(ErrorCodes.UNAUTHORIZED, 'Authentication required')
        );
      }

      const { level } = request.params as { level: string };
      const { page = '1', limit = '50' } = request.query as any;

      const result = await this.queryService.getByLevel(level, parseInt(page), parseInt(limit));

      reply.send(successResponse(result));
    } catch (error) {
      logger.error('Get by level error:', error);
      reply.status(500).send(
        errorResponse(ErrorCodes.DATABASE_ERROR, 'Failed to fetch logs')
      );
    }
  }
}
