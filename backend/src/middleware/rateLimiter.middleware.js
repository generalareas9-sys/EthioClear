/**
 * rateLimiter.middleware.js
 *
 * Global rate limiter applied to all /api routes to mitigate brute
 * force and abuse. Stricter, route-specific limiters (e.g. for
 * login) can be layered on top of this in the auth module.
 */

const rateLimit = require('express-rate-limit');
const config = require('../config/env.config');

const globalRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true, // return rate limit info in RateLimit-* headers
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    errors: null,
  },
});

// Stricter limiter for authentication endpoints (login/register) to
// slow down credential-stuffing and brute-force attempts specifically,
// independent of the general API rate limit.
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
    errors: null,
  },
});

module.exports = { globalRateLimiter, authRateLimiter };
