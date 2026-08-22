/**
 * auth.routes.js
 *
 * POST /api/auth/register
 * POST /api/auth/login
 * POST /api/auth/refresh
 * POST /api/auth/logout
 *
 * Validation rule chains live alongside the routes (rather than in a
 * separate top-level folder) to keep the approved backend folder
 * structure unchanged; validate.middleware.js applies them uniformly.
 */

const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { authRateLimiter } = require('../middleware/rateLimiter.middleware');

const router = express.Router();

const registerValidators = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required.')
    .isLength({ min: 2, max: 150 })
    .withMessage('Full name must be between 2 and 150 characters.'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('A valid email is required.')
    .normalizeEmail(),

  body('phoneNumber')
    .optional({ checkFalsy: true })
    .isLength({ max: 20 })
    .withMessage('Phone number is too long.'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter.')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter.')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number.'),
];

const loginValidators = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('A valid email is required.')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

const refreshValidators = [body('refreshToken').notEmpty().withMessage('Refresh token is required.')];

const logoutValidators = [body('refreshToken').notEmpty().withMessage('Refresh token is required.')];

const passwordResetRequestValidators = [
  body('email').trim().notEmpty().withMessage('Email is required.').isEmail().withMessage('A valid email is required.').normalizeEmail(),
];

const passwordResetConfirmValidators = [
  body('token').notEmpty().withMessage('Reset token is required.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter.')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter.')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number.'),
];

router.post('/register', authRateLimiter, registerValidators, validate, authController.register);
router.post('/login', authRateLimiter, loginValidators, validate, authController.login);
router.post('/refresh', authRateLimiter, refreshValidators, validate, authController.refresh);
router.post('/logout', authenticate, logoutValidators, validate, authController.logout);

// Password reset flows
router.post('/password-reset/request', authRateLimiter, passwordResetRequestValidators, validate, authController.requestPasswordReset);
router.post('/password-reset/confirm', authRateLimiter, passwordResetConfirmValidators, validate, authController.confirmPasswordReset);

module.exports = router;
