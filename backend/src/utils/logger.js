/**
 * logger.js
 *
 * Minimal, dependency-free leveled logger. Kept intentionally simple
 * for this academic prototype — swap in Winston/Pino later without
 * changing any call sites, since everything imports this module.
 */

const LEVELS = ['error', 'warn', 'info', 'debug'];

function timestamp() {
  return new Date().toISOString();
}

function log(level, message, meta) {
  const line = `[${timestamp()}] [${level.toUpperCase()}] ${message}`;
  if (level === 'error') {
    // eslint-disable-next-line no-console
    console.error(line, meta !== undefined ? meta : '');
  } else if (level === 'warn') {
    // eslint-disable-next-line no-console
    console.warn(line, meta !== undefined ? meta : '');
  } else {
    // eslint-disable-next-line no-console
    console.log(line, meta !== undefined ? meta : '');
  }
}

module.exports = LEVELS.reduce((logger, level) => {
  logger[level] = (message, meta) => log(level, message, meta);
  return logger;
}, {});
