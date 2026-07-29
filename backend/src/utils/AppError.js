/**
 * AppError.js
 *
 * Custom error class for predictable, operational errors (bad input,
 * not found, unauthorized, etc.) as opposed to unexpected programming
 * errors/bugs. The global error handler treats `isOperational` errors
 * as safe to describe to the client; anything else is logged in full
 * detail server-side but returned to the client as a generic message.
 */

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
