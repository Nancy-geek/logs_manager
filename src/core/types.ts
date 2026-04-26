import { FastifyInstance } from 'fastify';

/**
 * Module Interface - Contract for all modules
 * Each module must export implementation of this interface
 */
export interface IModule {
  name: string;
  routes: (app: FastifyInstance) => Promise<void>;
  init?: () => Promise<void>;
  shutdown?: () => Promise<void>;
}

/**
 * Service Container Type
 */
export interface ServiceContainer {
  [key: string]: any;
}

/**
 * Module Metadata
 */
export interface ModuleMetadata {
  name: string;
  version: string;
  description: string;
}

/**
 * Request Context with user info
 */
export interface RequestContext {
  userId: string;
  role: 'admin' | 'viewer';
  username: string;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Log document type
 */
export interface LogDocument {
  _id?: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  resourceId: string;
  timestamp: Date;
  traceId?: string;
  spanId?: string;
  commit?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
}

/**
 * User document type
 */
export interface UserDocument {
  _id?: string;
  username: string;
  email?: string;
  passwordHash: string;
  role: 'admin' | 'viewer';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * JWT Payload
 */
export interface JwtPayload {
  userId: string;
  username: string;
  role: 'admin' | 'viewer';
  iat: number;
  exp: number;
}
