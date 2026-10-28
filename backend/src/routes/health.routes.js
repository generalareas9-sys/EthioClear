/**
 * health.routes.js
 *
 * GET /api/health
 * Lightweight endpoint to confirm the API is up and can reach the
 * database. Used by deployment platforms (Render/Railway) for health
 * checks, and useful for local smoke-testing during development.
 */

const express = require('express');
const { checkConnection } = require('../config/db.config');
const { success, failure } = require('../utils/responseFormatter');
const logger = require('../utils/logger');

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    const dbHealthy = await checkConnection();
    return success(res, {
      message: 'EthioClear API is running',
      data: {
        status: 'ok',
        database: dbHealthy ? 'connected' : 'unreachable',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    logger.error('Health check failed', err);
    return failure(res, {
      statusCode: 503,
      message: 'Service unavailable — database unreachable',
    });
  }
});

module.exports = router;
