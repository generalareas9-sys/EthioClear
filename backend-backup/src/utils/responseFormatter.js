/**
 * responseFormatter.js
 *
 * Ensures every API response — success or error — has the same
 * predictable shape, so the frontend can handle responses generically.
 */

function success(res, { statusCode = 200, message = 'Success', data = null } = {}) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function failure(res, { statusCode = 500, message = 'Something went wrong', errors = null } = {}) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

module.exports = { success, failure };
