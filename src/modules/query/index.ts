import { IModule } from '@core/types';
import { queryRoutes } from './routes';

/**
 * Query Module
 * Handles log querying with filtering and search
 */
export const queryModule: IModule = {
  name: 'query',

  routes: queryRoutes,

  async init(): Promise<void> {
    // Query module initialization if needed
  },

  async shutdown(): Promise<void> {
    // Query module cleanup if needed
  },
};
