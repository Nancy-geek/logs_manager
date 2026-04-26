import { z } from 'zod';

/**
 * Login request validation
 */
export const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginRequest = z.infer<typeof loginSchema>;

/**
 * Create user validation
 */
export const createUserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'viewer']).default('viewer'),
  email: z.string().email().optional(),
});

export type CreateUserRequest = z.infer<typeof createUserSchema>;

/**
 * Log ingestion validation
 */
export const logSchema = z.object({
  level: z.enum(['debug', 'info', 'warn', 'error']),
  message: z.string().min(1, 'Message is required'),
  resourceId: z.string().min(1, 'ResourceId is required'),
  timestamp: z.coerce.date(),
  traceId: z.string().optional(),
  spanId: z.string().optional(),
  commit: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type LogRequest = z.infer<typeof logSchema>;

/**
 * Bulk logs ingestion validation
 */
export const bulkLogsSchema = z.array(logSchema).min(1, 'At least one log is required');

export type BulkLogsRequest = z.infer<typeof bulkLogsSchema>;

/**
 * Log search query validation
 */
export const logSearchSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  level: z.enum(['debug', 'info', 'warn', 'error']).optional(),
  message: z.string().optional(),
  resourceId: z.string().optional(),
  traceId: z.string().optional(),
  spanId: z.string().optional(),
  commit: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export type LogSearchQuery = z.infer<typeof logSearchSchema>;
