import { FastifyInstance } from 'fastify';
import { IModule } from './types';
import logger from '@shared/utils/logger';

/**
 * Central Registry - Dependency Injection Container
 * Manages module lifecycle and provides service access
 */
export class Registry {
  private modules: Map<string, IModule> = new Map();
  private services: Map<string, any> = new Map();

  /**
   * Register a module
   */
  register(module: IModule): void {
    if (this.modules.has(module.name)) {
      throw new Error(`Module ${module.name} is already registered`);
    }
    this.modules.set(module.name, module);
    logger.info(`Module registered: ${module.name}`);
  }

  /**
   * Register a service in the container
   */
  registerService(name: string, service: any): void {
    this.services.set(name, service);
    logger.info(`Service registered: ${name}`);
  }

  /**
   * Get a service from the container
   */
  getService<T = any>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found in registry`);
    }
    return service as T;
  }

  /**
   * Check if service exists
   */
  hasService(name: string): boolean {
    return this.services.has(name);
  }

  /**
   * Get a module
   */
  getModule(name: string): IModule {
    const module = this.modules.get(name);
    if (!module) {
      throw new Error(`Module ${name} not found`);
    }
    return module;
  }

  /**
   * Get all module names
   */
  getModuleNames(): string[] {
    return Array.from(this.modules.keys());
  }

  /**
   * Initialize all modules
   */
  async initializeAll(): Promise<void> {
    logger.info('Initializing all modules...');
    for (const [name, module] of this.modules) {
      try {
        logger.info(`Initializing module: ${name}`);
        if (module.init) {
          await module.init();
        }
      } catch (error) {
        logger.error(`Failed to initialize module ${name}`, error);
        throw error;
      }
    }
    logger.info('All modules initialized');
  }

  /**
   * Register routes from all modules
   */
  async registerRoutes(app: FastifyInstance): Promise<void> {
    logger.info('Registering routes from all modules...');
    for (const [name, module] of this.modules) {
      try {
        logger.info(`Registering routes for module: ${name}`);
        await module.routes(app);
      } catch (error) {
        logger.error(`Failed to register routes for module ${name}`, error);
        throw error;
      }
    }
    logger.info('All routes registered');
  }

  /**
   * Graceful shutdown of all modules
   */
  async shutdownAll(): Promise<void> {
    logger.info('Shutting down all modules...');
    for (const [name, module] of this.modules) {
      try {
        logger.info(`Shutting down module: ${name}`);
        if (module.shutdown) {
          await module.shutdown();
        }
      } catch (error) {
        logger.error(`Error during shutdown of module ${name}`, error);
      }
    }
    logger.info('All modules shutdown');
  }
}

// Global registry instance
export const registry = new Registry();
