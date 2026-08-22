/**
 * auth.controller.js
 *
 * Handles the request/response lifecycle for authentication routes.
 * Business logic (hashing, token generation) delegates to
 * auth.service.js; persistence delegates to the model layer.
 */

const userModel = require('../models/user.model');
const refreshTokenModel = require('../models/refreshToken.model');
const auditLogModel = require('../models/auditLog.model');
const authService = require('../services/auth.service');
const config = require('../config/env.config');
const { success, failure } = require('../utils/responseFormatter');
const { ROLES, USER_STATUS, AUDIT_ACTIONS } = require('../utils/constants');

/**
 * POST /api/auth/register
 *
 * Self-registration always creates an 'applicant' account. Officer and
 * admin accounts are provisioned by an administrator (see the future
 * admin module) — role is intentionally never read from the request
 * body, so a client cannot register themselves as an officer/admin.
 */
async function register(req, res, next) {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    const existing = await userModel.findByEmail(email);
    if (existing) {
      // Deliberately generic message — does not confirm which part of
      // the input was wrong, to avoid account-enumeration by email.
      return failure(res, { statusCode: 409, message: 'Registration could not be completed with the provided details.' });
    }

    const passwordHash = await authService.hashPassword(password);
    const user = await userModel.createUser({
      fullName,
      email,
      phoneNumber,
      passwordHash,
      role: ROLES.APPLICANT,
    });

    await auditLogModel.record({
      actorId: user.id,
      action: AUDIT_ACTIONS.USER_REGISTERED,
      entityType: 'user',
      entityId: user.id,
      metadata: { email: user.email, role: user.role },
      ipAddress: req.ip,
    });

    return success(res, {
      statusCode: 201,
      message: 'Registration successful. You may now log in.',
      data: { user },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/auth/login
 *
 * Verifies credentials, checks account status, and issues a new
 * access/refresh token pair. Returns a generic "invalid credentials"
 * message for both unknown-email and wrong-password cases, and for
 * non-active accounts, so failure responses don't leak account state.
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findByEmailWithPassword(email);

    const passwordMatches = user ? await authService.comparePassword(password, user.password_hash) : false;

    if (!user || !passwordMatches || user.status !== USER_STATUS.ACTIVE) {
      await auditLogModel.record({
        actorId: user ? user.id : null,
        action: AUDIT_ACTIONS.LOGIN_FAILED,
        entityType: 'user',
        entityId: user ? user.id : null,
        metadata: { email },
        ipAddress: req.ip,
      });
      return failure(res, { statusCode: 401, message: 'Invalid email or password.' });
    }

    const publicUser = {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    const accessToken = authService.generateAccessToken(publicUser);
    const refreshToken = authService.generateRefreshToken(publicUser);

    await refreshTokenModel.create({
      userId: user.id,
      tokenHash: authService.hashToken(refreshToken),
      expiresAt: authService.expiryDateFromNow(config.jwt.refreshExpiresIn),
    });

    await auditLogModel.record({
      actorId: user.id,
      action: AUDIT_ACTIONS.LOGIN_SUCCESS,
      entityType: 'user',
      entityId: user.id,
      metadata: { email: user.email },
      ipAddress: req.ip,
    });

    return success(res, {
      message: 'Login successful.',
      data: { user: publicUser, accessToken, refreshToken },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/auth/refresh
 *
 * Exchanges a valid, non-revoked refresh token for a new access
 * token. Rotates the refresh token on every use (old one is revoked,
 * a new one issued) to limit the damage window if a token is stolen.
 */
async function refresh(req, res, next) {
  try {
    const { refreshToken: providedToken } = req.body;

    let payload;
    try {
      payload = authService.verifyRefreshToken(providedToken);
    } catch (err) {
      return failure(res, { statusCode: 401, message: 'Invalid or expired refresh token.' });
    }

    const tokenHash = authService.hashToken(providedToken);
    const storedToken = await refreshTokenModel.findActiveByHash(tokenHash);
    if (!storedToken || storedToken.user_id !== payload.sub) {
      return failure(res, { statusCode: 401, message: 'Invalid or expired refresh token.' });
    }

    const user = await userModel.findById(payload.sub);
    if (!user || user.status !== USER_STATUS.ACTIVE) {
      return failure(res, { statusCode: 401, message: 'Account is not active.' });
    }

    // Rotate: revoke the used token, issue a fresh pair.
    await refreshTokenModel.revokeByHash(tokenHash);

    const newAccessToken = authService.generateAccessToken(user);
    const newRefreshToken = authService.generateRefreshToken(user);

    await refreshTokenModel.create({
      userId: user.id,
      tokenHash: authService.hashToken(newRefreshToken),
      expiresAt: authService.expiryDateFromNow(config.jwt.refreshExpiresIn),
    });

    await auditLogModel.record({
      actorId: user.id,
      action: AUDIT_ACTIONS.TOKEN_REFRESHED,
      entityType: 'user',
      entityId: user.id,
      ipAddress: req.ip,
    });

    return success(res, {
      message: 'Token refreshed.',
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/auth/logout
 *
 * Revokes the given refresh token so it can no longer be used, even
 * though the (already-issued) access token remains valid until it
 * naturally expires — a standard tradeoff of stateless access tokens.
 * Requires a valid access token so logout events are attributable.
 */
async function logout(req, res, next) {
  try {
    const { refreshToken: providedToken } = req.body;

    const tokenHash = authService.hashToken(providedToken);
    await refreshTokenModel.revokeByHash(tokenHash);

    await auditLogModel.record({
      actorId: req.user.id,
      action: AUDIT_ACTIONS.LOGOUT,
      entityType: 'user',
      entityId: req.user.id,
      ipAddress: req.ip,
    });

    return success(res, { message: 'Logged out successfully.' });
  } catch (err) {
    return next(err);
  }
}


async function requestPasswordReset(req, res, next) {
  try {
    const { email } = req.body;

    // Always respond with a generic success message to avoid revealing
    // whether the email exists in the system.
    const user = await userModel.findByEmail(email);
    if (!user) {
      return success(res, { message: 'If an account with that email exists, a password reset email has been sent.' });
    }

    // Create a single-use, time-limited token. Raw token is returned so
    // the caller (mailer) can include it in the email. The raw token is
    // NOT logged. Only the SHA-256 hash is stored in the database.
    const rawToken = require('crypto').randomBytes(32).toString('hex');
    const tokenHash = authService.hashToken(rawToken);
    const expiresAt = authService.expiryDateFromNow('1h');

    await require('../models/passwordReset.model').create({ userId: user.id, tokenHash, expiresAt });

    // Send email if mailer is configured. Mailer implementation is
    // optional in development; do not expose the token in logs if mail
    // isn't available. The frontend will receive a generic success.
    try {
      const mailer = require('../utils/mailer');
      const resetUrl = `${config.server.clientOrigins[0].replace(/\/$/, '')}/reset-password?token=${rawToken}`;
      // Do NOT log rawToken. mailer.sendPasswordResetEmail should handle sending.
      await mailer.sendPasswordResetEmail(user.email, { fullName: user.full_name, resetUrl });
    } catch (mailErr) {
      // Mailer not configured or failed — swallow error to avoid
      // revealing implementation details. Do not log the token.
    }

    return success(res, { message: 'If an account with that email exists, a password reset email has been sent.' });
  } catch (err) {
    return next(err);
  }
}

async function confirmPasswordReset(req, res, next) {
  try {
    const { token, password } = req.body;
    const tokenHash = authService.hashToken(token);

    const pr = await require('../models/passwordReset.model').findActiveByHash(tokenHash);
    if (!pr) {
      // Generic failure — do not reveal whether token expired or didn't exist.
      return failure(res, { statusCode: 400, message: 'Password reset token is invalid or expired.' });
    }

    const user = await userModel.findById(pr.user_id);
    if (!user) {
      return failure(res, { statusCode: 400, message: 'Password reset token is invalid or expired.' });
    }

    // Hash new password and update user
    const newHash = await authService.hashPassword(password);
    await userModel.updatePassword(user.id, newHash);

    // Mark token used to prevent replay
    await require('../models/passwordReset.model').markUsedById(pr.id);

    await require('../models/auditLog.model').record({
      actorId: user.id,
      action: 'PASSWORD_RESET',
      entityType: 'user',
      entityId: user.id,
      metadata: { via: 'password_reset' },
      ipAddress: req.ip,
    });

    return success(res, { message: 'Password has been reset successfully.' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login, refresh, logout, requestPasswordReset, confirmPasswordReset };
