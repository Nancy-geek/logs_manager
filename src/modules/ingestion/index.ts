import { IModule } from '@core/types';
import { ingestionRoutes } from './routes';
import { getIngestionService } from './service';

let ingestionService = getIngestionService();

/**
 * Ingestion Module
 * Handles high-throughput log ingestion with batching
 */
export const ingestionModule: IModule = {
  name: 'ingestion',

  routes: ingestionRoutes,

  async init(): Promise<void> {
    // Ingestion service singleton is already initialized on module load.
    ingestionService = getIngestionService();
  },

  async shutdown(): Promise<void> {
    if (ingestionService) {
      await ingestionService.shutdown();
    }
  },
};
