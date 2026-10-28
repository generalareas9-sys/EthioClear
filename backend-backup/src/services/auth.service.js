/**
 * auth.service.js
 *
 * Pure auth logic — password hashing/verification and JWT
 * generation/verification — kept separate from the controller so it
 * has no knowledge of Express req/res and can be unit tested in
 * isolation.
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/env.config');

// ---------------------------------------------------------------------
// Passwords
// ---------------------------------------------------------------------

async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, config.bcrypt.saltRounds);
}

async function comparePassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash);
}

// ---------------------------------------------------------------------
// Access tokens (short-lived, stateless — verified on every request)
// ---------------------------------------------------------------------

function generateAccessToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

function verifyAccessToken(token) {
  // Throws if invalid/expired — caller (middleware) handles the error.
  return jwt.verify(token, config.jwt.secret);
}

// ---------------------------------------------------------------------
// Refresh tokens (longer-lived, stateful — checked against DB so they
// can be revoked on logout or if compromised)
// ---------------------------------------------------------------------

function generateRefreshToken(user) {
  return jwt.sign({ sub: user.id }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, config.jwt.refreshSecret);
}

/**
 * Refresh tokens are hashed (SHA-256) before being stored, so a
 * database leak alone cannot be used to impersonate a user — bcrypt
 * is intentionally not used here since this is a lookup key, not a
 * password, and does not need to be slow.
 */
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/** Converts a JWT expiresIn-style duration (e.g. '7d', '1h') to a Date. */
function expiryDateFromNow(durationString) {
  const match = /^(\d+)([smhd])$/.exec(durationString);
  if (!match) {
    // Fallback: treat unparseable values as 7 days.
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
  const value = parseInt(match[1], 10);
  const unitMs = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 }[match[2]];
  return new Date(Date.now() + value * unitMs);
}

module.exports = {
  hashPassword,
  comparePassword,
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
  expiryDateFromNow,
};
