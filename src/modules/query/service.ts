import { Log } from '@modules/database/Log.model';
import { LogDocument, PaginatedResponse } from '@core/types';
import logger from '@shared/utils/logger';

interface SearchFilters {
  level?: string;
  message?: string;
  resourceId?: string;
  traceId?: string;
  spanId?: string;
  commit?: string;
  from?: Date;
  to?: Date;
}

/**
 * Query Service
 * Handles complex log queries with filters and full-text search
 */
export class QueryService {
  /**
   * Search logs with filters and pagination
   */
  async searchLogs(
    filters: SearchFilters,
    page: number = 1,
    limit: number = 50
  ): Promise<PaginatedResponse<LogDocument>> {
    try {
      const query = this.buildQuery(filters);

      // Get total count for pagination
      const total = await Log.countDocuments(query);

      // Calculate skip
      const skip = (page - 1) * limit;

      // Execute query with pagination
      const data = await Log.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();

      const pages = Math.ceil(total / limit);

      return {
        data: data as LogDocument[],
        meta: {
          page,
          limit,
          total,
          pages,
          hasNextPage: page < pages,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      logger.error('Search error:', error);
      throw new Error('Failed to search logs');
    }
  }

  /**
   * Build MongoDB query from filters
   */
  private buildQuery(filters: SearchFilters): any {
    const query: any = {};

    if (filters.level) {
      query.level = filters.level;
    }

    if (filters.message) {
      // Use full-text search if available
      query.$text = { $search: filters.message };
    }

    if (filters.resourceId) {
      query.resourceId = filters.resourceId;
    }

    if (filters.traceId) {
      query.traceId = filters.traceId;
    }

    if (filters.spanId) {
      query.spanId = filters.spanId;
    }

    if (filters.commit) {
      query.commit = filters.commit;
    }

    // Date range filtering
    if (filters.from || filters.to) {
      query.timestamp = {};

      if (filters.from) {
        query.timestamp.$gte = filters.from;
      }

      if (filters.to) {
        query.timestamp.$lte = filters.to;
      }
    }

    return query;
  }

  /**
   * Get logs by resource ID
   */
  async getByResourceId(
    resourceId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<PaginatedResponse<LogDocument>> {
    return this.searchLogs({ resourceId }, page, limit);
  }

  /**
   * Get logs by level
   */
  async getByLevel(
    level: string,
    page: number = 1,
    limit: number = 50
  ): Promise<PaginatedResponse<LogDocument>> {
    return this.searchLogs({ level }, page, limit);
  }

  /**
   * Get logs by trace ID
   */
  async getByTraceId(
    traceId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<PaginatedResponse<LogDocument>> {
    return this.searchLogs({ traceId }, page, limit);
  }

  /**
   * Get logs in date range
   */
  async getByDateRange(
    from: Date,
    to: Date,
    page: number = 1,
    limit: number = 50
  ): Promise<PaginatedResponse<LogDocument>> {
    return this.searchLogs({ from, to }, page, limit);
  }

  /**
   * Get basic log statistics
   */
  async getStatistics(): Promise<{ total: number; levels: Record<string, number> }> {
    const total = await Log.countDocuments();
    const levels = await Log.aggregate([
      { $group: { _id: '$level', count: { $sum: 1 } } },
    ]);

    return {
      total,
      levels: levels.reduce((acc: Record<string, number>, item: any) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    };
  }
}
