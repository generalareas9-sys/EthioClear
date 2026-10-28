/**
 * validate.middleware.js
 *
 * Runs after an array of express-validator checks on a route. If any
 * failed, responds with a standardized 422 error instead of letting
 * the request reach the controller.
 */

const { validationResult } = require('express-validator');
const { failure } = require('../utils/responseFormatter');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return failure(res, {
      statusCode: 422,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  return next();
}

module.exports = validate;
