import { FastifyReply, FastifyRequest } from 'fastify';
import logger from '@shared/utils/logger';

export async function requestLogger(request: FastifyRequest, _reply: FastifyReply) {
  logger.info({ method: request.method, url: request.url }, 'Incoming request');
}
