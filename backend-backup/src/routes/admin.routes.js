/**
 * admin.routes.js
 *
 * All routes here require a valid access token AND the 'admin' role.
 * Mounted at /api/admin in routes/index.js.
 */

const express = require('express');
const { body, param, query } = require('express-validator');

const adminController = require('../controllers/admin.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/rbac.middleware');
const validate = require('../middleware/validate.middleware');
const { ROLES, ALL_ROLES, USER_STATUS } = require('../utils/constants');

const router = express.Router();

// Every route in this file is an admin-only, authenticated route.
router.use(authenticate, authorize(ROLES.ADMIN));

const listUsersValidators = [
  query('role').optional().isIn(ALL_ROLES).withMessage(`role must be one of: ${ALL_ROLES.join(', ')}`),
  query('status')
    .optional()
    .isIn(Object.values(USER_STATUS))
    .withMessage(`status must be one of: ${Object.values(USER_STATUS).join(', ')}`),
  query('search').optional().trim().isLength({ max: 150 }).withMessage('search must be at most 150 characters.'),
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100.'),
];

const createOfficerValidators = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required.')
    .isLength({ min: 2, max: 150 })
    .withMessage('Full name must be between 2 and 150 characters.'),
  body('email').trim().notEmpty().withMessage('Email is required.').isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('phoneNumber').optional({ checkFalsy: true }).isLength({ max: 20 }).withMessage('Phone number is too long.'),
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

const userIdParamValidator = [param('id').isUUID().withMessage('A valid user id is required.')];

const listAuditLogsValidators = [
  query('actorId').optional().isUUID().withMessage('actorId must be a valid UUID.'),
  query('action').optional().trim().isLength({ max: 100 }).withMessage('action must be at most 100 characters.'),
  query('entityType').optional().trim().isLength({ max: 50 }).withMessage('entityType must be at most 50 characters.'),
  query('dateFrom').optional().isISO8601().withMessage('dateFrom must be a valid ISO 8601 date.'),
  query('dateTo').optional().isISO8601().withMessage('dateTo must be a valid ISO 8601 date.'),
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100.'),
];

router.get('/users', listUsersValidators, validate, adminController.listUsers);
router.post('/officers', createOfficerValidators, validate, adminController.createOfficer);
router.patch('/users/:id/activate', userIdParamValidator, validate, adminController.activateUser);
router.patch('/users/:id/deactivate', userIdParamValidator, validate, adminController.deactivateUser);
router.get('/audit-logs', listAuditLogsValidators, validate, adminController.listAuditLogs);
router.get('/dashboard/stats', adminController.getDashboardStats);

module.exports = router;
