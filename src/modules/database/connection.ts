import mongoose from 'mongoose';
import { config } from '@core/config';
import logger from '@shared/utils/logger';

/**
 * Initialize MongoDB connection
 */
export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(config.mongoUri, {
      dbName: config.mongoDbName,
    });
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    throw error;
  }
}

/**
 * Close MongoDB connection
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error('MongoDB disconnection error:', error);
  }
}

/**
 * Get MongoDB connection status
 */
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
