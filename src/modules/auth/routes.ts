import { FastifyInstance } from 'fastify';
import { AuthService } from './service';
import { AuthController } from './controller';

/**
 * Auth Routes
 */
export async function authRoutes(app: FastifyInstance): Promise<void> {
  const authService = new AuthService();
  const authController = new AuthController(authService);

  // Register auth service in app context for use by other modules
  app.register(async (fastify) => {
    fastify.decorate('authService', authService);
  });

  // Login endpoint
  app.post<{ Body: { username: string; password: string } }>(
    '/auth/login',
    async (request, reply) => {
      await authController.login(request, reply);
    }
  );

  // Health check
  app.get('/health', async (_request, reply) => {
    reply.send({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
    });
  });
}
