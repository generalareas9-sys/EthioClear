/**
 * auth.middleware.js
 *
 * Verifies the JWT access token on protected routes and attaches the
 * decoded identity to req.user. Does not hit the database on every
 * request by design (stateless access tokens) — role/status changes
 * take effect on the user's next login or token refresh.
 */

const authService = require('../services/auth.service');
const { failure } = require('../utils/responseFormatter');

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return failure(res, { statusCode: 401, message: 'Authentication required.' });
  }

  try {
    const payload = authService.verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    return next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Access token expired.' : 'Invalid access token.';
    return failure(res, { statusCode: 401, message });
  }
}

module.exports = authenticate;
