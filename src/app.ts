import Fastify, { FastifyInstance } from 'fastify';
import { config } from '@core/config';
import { errorHandler } from './middleware/errorHandler.js';
import { registry } from './core/registry.js';
import { requestLogger } from './middleware/logger.js';
import logger from '@shared/utils/logger';
import {
  authModule,
  ingestionModule,
  queryModule,
  databaseModule,
  healthModule,
} from './modules/index.js';

/**
 * Initialize and configure Fastify application
 * Uses Registry pattern for modular architecture
 */
export async function createApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: config.isDevelopment ? { level: 'debug' } : { level: 'info' },
  });

  // Add request logging hook
  app.addHook('onRequest', requestLogger);

  // Register all modules in the central registry
  registry.register(authModule);
  registry.register(ingestionModule);
  registry.register(queryModule);
  registry.register(databaseModule);
  registry.register(healthModule);

  // Initialize all modules via registry
  await registry.initializeAll();

  // Register routes from all modules via registry
  await registry.registerRoutes(app);

  // Set error handler
  app.setErrorHandler(errorHandler);

  // Graceful shutdown
  const signals = ['SIGTERM', 'SIGINT'];

  signals.forEach((signal) => {
    process.on(signal, async () => {
      logger.info(`${signal} received, shutting down gracefully...`);

      try {
        await registry.shutdownAll();
        await app.close();
        logger.info('Server shutdown complete');
        process.exit(0);
      } catch (error) {
        logger.error('Shutdown error:', error);
        process.exit(1);
      }
    });
  });

  return app;
}
