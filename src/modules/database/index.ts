import { IModule } from '@core/types';
import { connectDatabase, disconnectDatabase } from './connection';
import logger from '@shared/utils/logger';
import mongoose from 'mongoose';

/**
 * Database Module - Manages MongoDB connection
 */
export const databaseModule: IModule = {
  name: 'database',

  async init(): Promise<void> {
    await connectDatabase();
  },

  async shutdown(): Promise<void> {
    await disconnectDatabase();
  },

  routes: async (app): Promise<void> => {
    // Health check endpoint for database
    app.get('/health/db', async (_request, reply) => {
      try {
        const isConnected = mongoose.connection.readyState === 1;
        reply.send({
          success: isConnected,
          database: isConnected ? 'connected' : 'disconnected',
        });
      } catch (error) {
        logger.error('Database health check failed:', error);
        reply.status(503).send({
          success: false,
          database: 'error',
        });
      }
    });
  },
};
