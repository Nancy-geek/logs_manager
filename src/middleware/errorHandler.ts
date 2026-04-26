// src/middleware/errorHandler.ts

import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { errorResponse } from '@shared/utils/response';

/**
 * Global error handler for Fastify
 */
export async function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  console.error("Error:", {
    name: error.name,
    message: error.message,
    path: request.url,
    method: request.method,
    ip: request.ip,
  });

  // Handle Fastify validation errors
  if ("statusCode" in error && error.statusCode === 400) {
    return reply.status(400).send(
      errorResponse("VALIDATION_ERROR", "Invalid request body", {
        details: "message" in error ? error.message : undefined,
      })
    );
  }

  // Handle JWT errors from auth middleware
  if (error.name === "UnauthorizedError") {
    return reply.status(401).send(
      errorResponse("UNAUTHORIZED", "Unauthorized access")
    );
  }

  // Default error response
  const statusCode = "statusCode" in error ? error.statusCode ?? 500 : 500;
  reply.status(statusCode).send(
    errorResponse("INTERNAL_ERROR", "Internal server error", {
      message: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  );
}
