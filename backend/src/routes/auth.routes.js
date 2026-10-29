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
  body('firstName')
    .if((value, { req }) => !req.body.fullName)
    .trim()
    .notEmpty()
    .withMessage('First name is required.')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters.'),

  body('middleName')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 })
    .withMessage('Middle name is too long.'),

  body('lastName')
    .if((value, { req }) => !req.body.fullName)
    .trim()
    .notEmpty()
    .withMessage('Last name is required.')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters.'),

  body('fullName')
    .if((value, { req }) => !req.body.firstName && !req.body.lastName)
    .trim()
    .notEmpty()
    .withMessage('Full name is required.')
    .isLength({ min: 2, max: 150 })
    .withMessage('Full name must be between 2 and 150 characters.'),

  body('dateOfBirth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('A valid date of birth (YYYY-MM-DD) is required.')
    .custom((value) => {
      const dob = new Date(value);
      if (isNaN(dob.getTime())) throw new Error('Invalid date.');
      const today = new Date();
      if (dob >= today) throw new Error('Date of birth must be in the past.');
      const minAdult = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      if (dob > minAdult) throw new Error('Applicant must be at least 18 years of age.');
      return true;
    }),

  body('gender')
    .optional({ checkFalsy: true })
    .isIn(['Male', 'Female', 'male', 'female'])
    .withMessage('Gender must be Male or Female.'),

  body('region')
    .optional({ checkFalsy: true })
    .isIn([
      'Addis Ababa',
      'Afar',
      'Amhara',
      'Benishangul-Gumuz',
      'Dire Dawa',
      'Gambela',
      'Harari',
      'Oromia',
      'Sidama',
      'Somali',
      'South Ethiopia',
      'South West Ethiopia',
      'Tigray',
    ])
    .withMessage('Region must be a valid Ethiopian administrative region.'),

  body('nationalIdNumber')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^EID-\d{3}-\d{3}-\d{3}$/)
    .withMessage('National ID must match format EID-000-000-000.'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('A valid email is required.')
    .normalizeEmail(),

  body('phoneNumber')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone number is too long.'),

  body('address')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage('Address must be at least 3 characters.'),

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
