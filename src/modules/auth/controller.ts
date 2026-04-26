import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './service';
import { loginSchema } from '@shared/utils/schemas';
import { successResponse, errorResponse, ErrorCodes } from '@shared/utils/response';
import logger from '@shared/utils/logger';

/**
 * Authentication Controller
 */
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Handle login request
   */
  async login(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = loginSchema.parse(request.body);

      const { token, user } = await this.authService.login(body.username, body.password);

      logger.info(`User logged in: ${body.username}`);

      reply.send(
        successResponse({
          token,
          user,
        })
      );
    } catch (error) {
      logger.error('Login error:', error);

      if (error instanceof Error && error.message === 'Invalid credentials') {
        return reply.status(401).send(
          errorResponse(ErrorCodes.INVALID_CREDENTIALS, 'Invalid username or password')
        );
      }

      reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Login failed')
      );
    }
  }
}
