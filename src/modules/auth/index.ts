import { IModule } from '@core/types';
import { authRoutes } from './routes';

/**
 * Auth Module
 * Handles user authentication and JWT token generation
 */
export const authModule: IModule = {
  name: 'auth',

  routes: authRoutes,

  async init(): Promise<void> {
    // Auth module initialization if needed
  },

  async shutdown(): Promise<void> {
    // Auth module cleanup if needed
  },
};
