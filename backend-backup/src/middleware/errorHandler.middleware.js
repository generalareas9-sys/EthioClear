/**
 * errorHandler.middleware.js
 *
 * Centralized error-handling middleware. Must be registered LAST in
 * app.js (after all routes) — Express identifies error middleware by
 * its four-argument signature (err, req, res, next).
 *
 * - Operational errors (AppError, isOperational = true) are safe to
 *   return to the client as-is.
 * - Unexpected errors are logged in full but the client only ever
 *   receives a generic message, so internals are never leaked.
 */

const logger = require('../utils/logger');
const { failure } = require('../utils/responseFormatter');
const config = require('../config/env.config');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational === true;

  if (!isOperational) {
    logger.error(`Unhandled error on ${req.method} ${req.originalUrl}`, {
      message: err.message,
      stack: err.stack,
    });
  } else {
    logger.warn(`${req.method} ${req.originalUrl} → ${statusCode}: ${err.message}`);
  }

  return failure(res, {
    statusCode,
    message: isOperational ? err.message : 'Internal server error. Please try again later.',
    errors: !config.isProduction && !isOperational ? { stack: err.stack } : null,
  });
}

/** 404 handler for any route that doesn't match — registered before errorHandler. */
function notFoundHandler(req, res) {
  return failure(res, {
    statusCode: 404,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

module.exports = { errorHandler, notFoundHandler };
