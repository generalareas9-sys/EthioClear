/**
 * officer.routes.js
 *
 * All routes here require a valid access token AND the 'officer'
 * role. Mounted at /api/officer in routes/index.js.
 */

const express = require('express');
const { body, param, query } = require('express-validator');

const officerController = require('../controllers/officer.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/rbac.middleware');
const validate = require('../middleware/validate.middleware');
const { ROLES, APPLICATION_STATUS } = require('../utils/constants');

const router = express.Router();

// Every route in this file is an officer-only, authenticated route.
router.use(authenticate, authorize(ROLES.OFFICER));

const listQueueValidators = [
  query('status')
    .optional()
    .isIn(Object.values(APPLICATION_STATUS))
    .withMessage(`status must be one of: ${Object.values(APPLICATION_STATUS).join(', ')}`),
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100.'),
];

const applicationIdParamValidator = [param('id').isUUID().withMessage('A valid application id is required.')];

const rejectValidators = [
  param('id').isUUID().withMessage('A valid application id is required.'),
  body('rejectionReason')
    .trim()
    .notEmpty()
    .withMessage('rejectionReason is required when rejecting an application.')
    .isLength({ max: 1000 })
    .withMessage('rejectionReason must be at most 1000 characters.'),
];

router.get('/applications', listQueueValidators, validate, officerController.listQueue);
router.get('/applications/:id', applicationIdParamValidator, validate, officerController.getApplication);
router.patch('/applications/:id/approve', applicationIdParamValidator, validate, officerController.approveApplication);
router.patch('/applications/:id/reject', rejectValidators, validate, officerController.rejectApplication);

module.exports = router;
