import { Log } from '@modules/database/Log.model';
import { LogDocument } from '@core/types';
import { config } from '@core/config';
import logger from '@shared/utils/logger';

/**
 * In-Memory Log Buffer
 * Batches logs before inserting to MongoDB
 * Optimizes write performance through bulk operations
 */
export class LogBuffer {
  private buffer: LogDocument[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private isShuttingDown = false;
  private flushCount = 0;
  private insertCount = 0;

  constructor(
    private batchSize: number = config.logBufferSize,
    private flushIntervalMs: number = config.logBufferFlushMs
  ) {
    this.startPeriodicFlush();
  }

  /**
   * Add a log to the buffer
   */
  async add(log: LogDocument): Promise<void> {
    if (this.isShuttingDown) {
      throw new Error('Buffer is shutting down');
    }

    this.buffer.push(log);
    this.insertCount++;

    // Flush if buffer reaches batch size
    if (this.buffer.length >= this.batchSize) {
      await this.flush();
    }
  }

  /**
   * Add multiple logs to the buffer
   */
  async addBulk(logs: LogDocument[]): Promise<void> {
    for (const log of logs) {
      this.buffer.push(log);
      this.insertCount++;

      if (this.buffer.length >= this.batchSize) {
        await this.flush();
      }
    }
  }

  /**
   * Flush buffer to MongoDB
   */
  async flush(): Promise<void> {
    if (this.buffer.length === 0) {
      return;
    }

    try {
      const logsToInsert = [...this.buffer];
      this.buffer = [];

      await Log.insertMany(logsToInsert, { ordered: false });

      this.flushCount++;
      logger.info(
        `Buffer flushed: ${logsToInsert.length} logs inserted (Total: ${this.flushCount} flushes)`
      );
    } catch (error) {
      logger.error('Buffer flush error:', error);
      throw error;
    }
  }

  /**
   * Start periodic flush timer
   */
  private startPeriodicFlush(): void {
    this.flushTimer = setInterval(async () => {
      if (this.buffer.length > 0) {
        try {
          await this.flush();
        } catch (error) {
          logger.error('Periodic flush failed:', error);
        }
      }
    }, this.flushIntervalMs);
  }

  /**
   * Get buffer statistics
   */
  getStats(): {
    bufferSize: number;
    maxBatchSize: number;
    flushIntervalMs: number;
    totalFlushes: number;
    totalLogsInserted: number;
  } {
    return {
      bufferSize: this.buffer.length,
      maxBatchSize: this.batchSize,
      flushIntervalMs: this.flushIntervalMs,
      totalFlushes: this.flushCount,
      totalLogsInserted: this.insertCount,
    };
  }

  /**
   * Graceful shutdown - flush remaining logs
   */
  async shutdown(): Promise<void> {
    this.isShuttingDown = true;

    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    // Final flush
    if (this.buffer.length > 0) {
      logger.info(`Shutting down buffer with ${this.buffer.length} logs remaining`);
      await this.flush();
    }

    logger.info('Log buffer shutdown complete');
  }
}
