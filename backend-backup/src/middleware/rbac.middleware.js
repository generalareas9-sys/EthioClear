/**
 * rbac.middleware.js
 *
 * Role-based access control. Must run AFTER auth.middleware.js, since
 * it relies on req.user being already populated.
 *
 * Usage: router.get('/admin/users', authenticate, authorize(ROLES.ADMIN), handler)
 */

const { failure } = require('../utils/responseFormatter');

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      // Defensive check — indicates authorize() was used without authenticate() first.
      return failure(res, { statusCode: 401, message: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return failure(res, { statusCode: 403, message: 'You do not have permission to perform this action.' });
    }
    return next();
  };
}

module.exports = authorize;
