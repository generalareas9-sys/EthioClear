/**
 * env.config.js
 *
 * Loads environment variables from `.env` and exposes them as a single
 * validated, typed configuration object. Centralizing this here means
 * the rest of the app never touches `process.env` directly, and the
 * app fails fast at startup if a required variable is missing rather
 * than failing unpredictably later.
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

// Variables that MUST be present for the app to start safely.
// (Auth-related secrets are required now so Module 4 doesn't silently
// run with insecure defaults; they are not yet used by any route.)
const DEFAULT_ENV = {
  PORT: '5000',
  PGHOST: 'localhost',
  PGPORT: '5432',
  PGUSER: 'ethioclear_user',
  PGPASSWORD: 'change_me',
  PGDATABASE: 'ethioclear_db',
  JWT_SECRET: 'development_jwt_secret_change_me',
  JWT_REFRESH_SECRET: 'development_jwt_refresh_secret_change_me',
};

const REQUIRED_VARS = Object.keys(DEFAULT_ENV);

function getMissingVars() {
  return REQUIRED_VARS.filter((key) => !process.env[key] || process.env[key].trim() === '');
}

function validateEnv() {
  const missing = getMissingVars();

  if (missing.length > 0) {
    missing.forEach((key) => {
      process.env[key] = DEFAULT_ENV[key];
    });

    if (process.env.NODE_ENV === 'production') {
      // Fail fast in production to avoid starting with insecure defaults.
      // eslint-disable-next-line no-console
      console.error(
        `[env.config] Missing required environment variables: ${missing.join(', ')}\n` +
          'Set real values in your environment or .env before running in production.'
      );
      process.exit(1);
    }

    // eslint-disable-next-line no-console
    console.warn(
      `[env.config] Missing environment variables: ${missing.join(', ')}. Falling back to development defaults.`
    );
  }
}

validateEnv();

const config = {
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',

  server: {
    port: parseInt(process.env.PORT, 10) || 5000,
    apiBasePath: process.env.API_BASE_PATH || '/api',
    clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:4173')
      .split(',')
      .map((origin) => origin.trim()),
  },

  db: {
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT, 10) || 5432,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    connectionString: process.env.DATABASE_URL || undefined,
    ssl: process.env.PG_SSL === 'true',
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },

  storage: {
    uploadDir: process.env.UPLOAD_DIR || 'storage/uploads',
    certificateDir: process.env.CERTIFICATE_DIR || 'storage/certificates',
    tempDir: process.env.TEMP_DIR || 'storage/temp',
    maxUploadSizeMb: parseInt(process.env.MAX_UPLOAD_SIZE_MB, 10) || 5,
  },

  verification: {
    baseUrl: process.env.VERIFICATION_BASE_URL || 'http://localhost:4173/verify',
  },
};

module.exports = config;
