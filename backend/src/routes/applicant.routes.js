/**
 * applicant.routes.js
 *
 * All routes here require a valid access token AND the 'applicant'
 * role — see authenticate / authorize middleware. Mounted at
 * /api/applicant in routes/index.js.
 */

const express = require('express');
const { body, param, query } = require('express-validator');

const applicantController = require('../controllers/applicant.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/rbac.middleware');
const validate = require('../middleware/validate.middleware');
const { uploadSingleDocument } = require('../middleware/upload.middleware');
const { ROLES } = require('../utils/constants');

const router = express.Router();

// Every route in this file is an applicant-only, authenticated route.
router.use(authenticate, authorize(ROLES.APPLICANT));

const createApplicationValidators = [
  body('purpose')
    .trim()
    .notEmpty()
    .withMessage('Purpose is required.')
    .isLength({ max: 255 })
    .withMessage('Purpose must be at most 255 characters.'),
];

const listApplicationsValidators = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100.'),
];

const applicationIdParamValidator = [param('id').isUUID().withMessage('A valid application id is required.')];

const uploadDocumentValidators = [
  param('id').isUUID().withMessage('A valid application id is required.'),
  body('documentType')
    .trim()
    .notEmpty()
    .withMessage('documentType is required (e.g. "National ID", "Passport Photo").')
    .isLength({ max: 100 })
    .withMessage('documentType must be at most 100 characters.'),
];

router.post('/applications', createApplicationValidators, validate, applicantController.createApplication);
router.get('/applications', listApplicationsValidators, validate, applicantController.listApplications);
router.get('/applications/:id', applicationIdParamValidator, validate, applicantController.getApplication);

// Multer runs before express-validator here because documentType is a
// multipart form field — it isn't parsed into req.body until Multer
// processes the request.
router.post(
  '/applications/:id/documents',
  uploadSingleDocument,
  uploadDocumentValidators,
  validate,
  applicantController.uploadDocument
);

module.exports = router;
