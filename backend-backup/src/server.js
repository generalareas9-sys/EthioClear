/**
 * server.js
 *
 * Application entry point. Verifies the database is reachable, then
 * starts the HTTP server. Kept separate from app.js so app.js can be
 * imported by tests without opening a real network port.
 */

const app = require('./app');
const config = require('./config/env.config');
const logger = require('./utils/logger');
const { checkConnection, pool } = require('./config/db.config');

async function startServer() {
  try {
    const dbHealthy = await checkConnection();
    if (!dbHealthy) {
      throw new Error('Database health check returned an unexpected result');
    }
    logger.info('Database connection established.');

    const server = app.listen(config.server.port, () => {
      logger.info(
        `EthioClear API (${config.env}) listening on port ${config.server.port} — base path ${config.server.apiBasePath}`
      );
      logger.info('This is a university prototype. No real government systems are connected.');
    });

    // ---------------------------------------------------------------
    // Graceful shutdown — close HTTP server and DB pool cleanly on
    // termination signals (e.g. from the deployment platform).
    // ---------------------------------------------------------------
    const shutdown = (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await pool.end();
        logger.info('HTTP server and database pool closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    logger.error('Failed to start server — could not connect to the database.', err);
    process.exit(1);
  }
}

startServer();
