import { ApiResponse, PaginatedResponse } from '@core/types';

/**
 * Success response helper
 */
export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Paginated response helper
 */
export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> {
  const pages = Math.ceil(total / limit);
  const hasNextPage = page < pages;
  const hasPrevPage = page > 1;

  return {
    data,
    meta: {
      page,
      limit,
      total,
      pages,
      hasNextPage,
      hasPrevPage,
    },
  };
}

/**
 * Error response helper
 */
export function errorResponse(
  code: string,
  message: string,
  details?: any
): ApiResponse<null> {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Standard HTTP error codes
 */
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EXPIRED_TOKEN: 'EXPIRED_TOKEN',
} as const;
