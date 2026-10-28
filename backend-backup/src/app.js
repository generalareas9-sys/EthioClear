/**
 * app.js
 *
 * Configures the Express application: security middleware, request
 * parsing, logging, rate limiting, routes, and error handling.
 * Kept separate from server.js so the app instance can be imported
 * directly in tests (via supertest) without binding a real port.
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const config = require('./config/env.config');
const logger = require('./utils/logger');
const { globalRateLimiter } = require('./middleware/rateLimiter.middleware');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler.middleware');
const routes = require('./routes');

const app = express();

// ---------------------------------------------------------------------
// Security headers
// ---------------------------------------------------------------------
app.use(helmet());

// ---------------------------------------------------------------------
// CORS — only allow the configured frontend origin(s)
// ---------------------------------------------------------------------
app.use(
  cors({
    origin: config.server.clientOrigins,
    credentials: true,
  })
);

// ---------------------------------------------------------------------
// Request body parsing
// ---------------------------------------------------------------------
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ---------------------------------------------------------------------
// HTTP request logging
// 'dev' format is concise and colorized for local development;
// 'combined' is the standard Apache-style format better suited to
// production log aggregation.
// ---------------------------------------------------------------------
app.use(morgan(config.isProduction ? 'combined' : 'dev', {
  stream: { write: (message) => logger.info(message.trim()) },
}));

// ---------------------------------------------------------------------
// Rate limiting — applied globally to all API routes
// ---------------------------------------------------------------------
app.use(config.server.apiBasePath, globalRateLimiter);

// ---------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------
app.use(config.server.apiBasePath, routes);

// ---------------------------------------------------------------------
// 404 + centralized error handling (must be registered last)
// ---------------------------------------------------------------------
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
