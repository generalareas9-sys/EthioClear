/**
 * db.config.js
 *
 * Creates and exports a single shared PostgreSQL connection pool
 * (node-postgres). Models/services should import `query` (or `pool`
 * for transactions) from here rather than creating their own clients.
 */

const { Pool } = require('pg');
const config = require('./env.config');
const logger = require('../utils/logger');

const poolConfig = config.db.connectionString
  ? {
      connectionString: config.db.connectionString,
      ssl: config.db.ssl ? { rejectUnauthorized: false } : false,
    }
  : {
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      ssl: config.db.ssl ? { rejectUnauthorized: false } : false,
    };

const pool = new Pool({
  ...poolConfig,
  max: 20, // max concurrent clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  // Errors on idle clients (e.g. connection dropped by the DB server)
  // must be handled here or they crash the process.
  logger.error('Unexpected error on idle PostgreSQL client', err);
});

/**
 * Run a parameterized query against the pool.
 * Always use parameterized queries ($1, $2, ...) — never string-concatenate
 * user input into SQL — to prevent SQL injection.
 */
async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const durationMs = Date.now() - start;
  if (!config.isProduction) {
    logger.debug(`[db] ${text.replace(/\s+/g, ' ').trim()} — ${result.rowCount} row(s) in ${durationMs}ms`);
  }
  return result;
}

/**
 * Get a dedicated client for multi-statement transactions.
 * Caller is responsible for calling client.release() when done.
 */
async function getClient() {
  return pool.connect();
}

/** Verifies the database is reachable — used by the health check route. */
async function checkConnection() {
  const result = await pool.query('SELECT 1 AS ok');
  return result.rows[0].ok === 1;
}

module.exports = {
  pool,
  query,
  getClient,
  checkConnection,
};
