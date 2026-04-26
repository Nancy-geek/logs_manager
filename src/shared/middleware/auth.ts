import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { config } from '@core/config';
import { JwtPayload, RequestContext } from '@core/types';
import { errorResponse, ErrorCodes } from '@shared/utils/response';
import logger from '@shared/utils/logger';

/**
 * Extend FastifyRequest to include user context
 */
declare module 'fastify' {
  interface FastifyRequest {
    user?: RequestContext;
  }
}

/**
 * Verify JWT and extract user context
 */
export async function verifyJwt(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const token = extractToken(request);

    if (!token) {
      return reply.status(401).send(
        errorResponse(ErrorCodes.UNAUTHORIZED, 'No authorization token provided')
      );
    }

    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;

    request.user = {
      userId: payload.userId,
      role: payload.role,
      username: payload.username,
    };
  } catch (error) {
    logger.error('JWT verification failed:', error);

    if (error instanceof jwt.TokenExpiredError) {
      return reply.status(401).send(
        errorResponse(ErrorCodes.EXPIRED_TOKEN, 'Token has expired')
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return reply.status(401).send(
        errorResponse(ErrorCodes.UNAUTHORIZED, 'Invalid token')
      );
    }

    return reply.status(401).send(
      errorResponse(ErrorCodes.UNAUTHORIZED, 'Authentication failed')
    );
  }
}

/**
 * Extract token from Authorization header
 */
function extractToken(request: FastifyRequest): string | null {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

/**
 * Middleware to authorize specific roles
 */
export function authorizeRole(...allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      return reply.status(401).send(
        errorResponse(ErrorCodes.UNAUTHORIZED, 'User not authenticated')
      );
    }

    if (!allowedRoles.includes(request.user.role)) {
      return reply.status(403).send(
        errorResponse(ErrorCodes.FORBIDDEN, `Access restricted to: ${allowedRoles.join(', ')}`)
      );
    }
  };
}
