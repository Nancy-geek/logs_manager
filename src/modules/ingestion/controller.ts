import { FastifyRequest, FastifyReply } from 'fastify';
import { IngestionService } from './service';
import { logSchema, bulkLogsSchema } from '@shared/utils/schemas';
import { successResponse, errorResponse, ErrorCodes } from '@shared/utils/response';
import logger from '@shared/utils/logger';

/**
 * Ingestion Controller
 */
export class IngestionController {
  constructor(private ingestionService: IngestionService) {}

  /**
   * Ingest a single log
   */
  async ingestSingle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = logSchema.parse(request.body);

      await this.ingestionService.ingestLog(body);

      reply.status(201).send(
        successResponse({
          message: 'Log ingested successfully',
          logged: 1,
        })
      );
    } catch (error) {
      logger.error('Single log ingestion error:', error);

      if (error instanceof Error && error.message.includes('is required')) {
        return reply.status(400).send(
          errorResponse(ErrorCodes.VALIDATION_ERROR, error.message)
        );
      }

      reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Invalid log format')
      );
    }
  }

  /**
   * Ingest multiple logs (bulk)
   */
  async ingestBulk(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = bulkLogsSchema.parse(request.body);

      await this.ingestionService.ingestBulk(body);

      reply.status(201).send(
        successResponse({
          message: 'Logs ingested successfully',
          logged: body.length,
        })
      );
    } catch (error) {
      logger.error('Bulk logs ingestion error:', error);

      if (error instanceof Error && error.message.includes('is required')) {
        return reply.status(400).send(
          errorResponse(ErrorCodes.VALIDATION_ERROR, error.message)
        );
      }

      reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Invalid logs format')
      );
    }
  }

  /**
   * Get ingestion statistics
   */
  async getStats(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const stats = this.ingestionService.getBufferStats();
    reply.send(successResponse(stats));
  }
}
