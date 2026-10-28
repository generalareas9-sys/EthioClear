/**
 * notification.routes.js
 *
 * Mounted at /api/notifications in routes/index.js.
 * Every route requires authentication — users may only read and
 * update their own notifications (enforced in the model layer too).
 *
 * Routes (must match notificationService.js in the frontend exactly):
 *
 *   GET    /api/notifications                — list (paginated)
 *   GET    /api/notifications/unread-count   — badge count
 *   PATCH  /api/notifications/read-all       — mark all read
 *   PATCH  /api/notifications/:id/read       — mark one read
 *
 * Note: "unread-count" and "read-all" are registered before "/:id/read"
 * so Express does not interpret the literal strings as UUID parameters.
 */

const express = require('express');
const { param, query } = require('express-validator');

const notificationController = require('../controllers/notification.controller');
const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const router = express.Router();

// All notification routes require authentication.
router.use(authenticate);

const paginationValidators = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100.'),
];

const notificationIdValidator = [
  param('id').isUUID().withMessage('A valid notification id is required.'),
];

// Specific string routes first — before the /:id/read wildcard.
router.get('/',              paginationValidators, validate, notificationController.list);
router.get('/unread-count',  notificationController.unreadCount);
router.patch('/read-all',    notificationController.markAllRead);
router.patch('/:id/read',    notificationIdValidator, validate, notificationController.markOneRead);

module.exports = router;
