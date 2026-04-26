import { LogBuffer } from './buffer';
import { LogDocument } from '@core/types';
import { config } from '@core/config';


/**
 * Ingestion Service
 * Handles log validation and buffering
 */
export class IngestionService {
  private buffer: LogBuffer;

  constructor() {
    this.buffer = new LogBuffer(config.logBufferSize, config.logBufferFlushMs);
  }

  /**
   * Ingest a single log
   */
  async ingestLog(log: LogDocument): Promise<void> {
    // Validate log
    this.validateLog(log);

    // Add to buffer
    await this.buffer.add({
      ...log,
      createdAt: new Date(),
    });
  }

  /**
   * Ingest multiple logs
   */
  async ingestBulk(logs: LogDocument[]): Promise<void> {
    const validatedLogs = logs.map((log) => {
      this.validateLog(log);
      return {
        ...log,
        createdAt: new Date(),
      };
    });

    await this.buffer.addBulk(validatedLogs);
  }

  /**
   * Validate log structure
   */
  private validateLog(log: LogDocument): void {
    if (!log.level) throw new Error('Log level is required');
    if (!log.message) throw new Error('Log message is required');
    if (!log.resourceId) throw new Error('Resource ID is required');
    if (!log.timestamp) throw new Error('Timestamp is required');
  }

  /**
   * Force flush buffer
   */
  async flushBuffer(): Promise<void> {
    await this.buffer.flush();
  }

  /**
   * Get buffer statistics
   */
  getBufferStats(): any {
    return this.buffer.getStats();
  }

  /**
   * Shutdown service
   */
  async shutdown(): Promise<void> {
    await this.buffer.shutdown();
  }
}

const ingestionService = new IngestionService();

export const getIngestionService = (): IngestionService => ingestionService;
