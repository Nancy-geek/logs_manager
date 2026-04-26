import { IModule } from '@core/types';
import { healthRoutes } from './health.routes.js';

export const healthModule: IModule = {
  name: 'health',
  routes: healthRoutes,
};
