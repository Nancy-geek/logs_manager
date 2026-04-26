import { Schema, model } from 'mongoose';
import { LogDocument } from '@core/types';

/**
 * Log Schema Definition
 */
const logSchema = new Schema<LogDocument>(
  {
    level: {
      type: String,
      enum: ['debug', 'info', 'warn', 'error'],
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      text: true, // Enable full-text search on message
    },
    resourceId: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      required: true,
      index: true,
    },
    traceId: {
      type: String,
      sparse: true,
      index: true,
    },
    spanId: {
      type: String,
      sparse: true,
      index: true,
    },
    commit: {
      type: String,
      sparse: true,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Create compound indexes for common queries
logSchema.index({ level: 1, timestamp: 1 });
logSchema.index({ resourceId: 1, timestamp: 1 });

// TTL index: auto-delete documents after 30 days
logSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

export const Log = model<LogDocument>('logs', logSchema);
