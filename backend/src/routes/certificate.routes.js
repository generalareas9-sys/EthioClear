/**
 * certificate.routes.js
 *
 * Mounted at /api/certificates in routes/index.js. Three distinct
 * access levels on one router:
 *   - generate: officer or admin only
 *   - download: any authenticated user (ownership/staff check inside the controller)
 *   - verify:   fully public, no authentication at all
 */

const express = require('express');
const { param } = require('express-validator');

const certificateController = require('../controllers/certificate.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/rbac.middleware');
const validate = require('../middleware/validate.middleware');
const { ROLES } = require('../utils/constants');

const router = express.Router();

const applicationIdParamValidator = [param('applicationId').isUUID().withMessage('A valid application id is required.')];
const certificateIdParamValidator = [param('certificateId').isUUID().withMessage('A valid certificate id is required.')];

router.post(
  '/applications/:applicationId/generate',
  authenticate,
  authorize(ROLES.OFFICER, ROLES.ADMIN),
  applicationIdParamValidator,
  validate,
  certificateController.generateCertificate
);

// Public — no authenticate middleware. This is the endpoint the QR
// code embedded in the certificate PDF links to.
router.get('/verify/:certificateId', certificateIdParamValidator, validate, certificateController.verifyCertificate);

router.get(
  '/:certificateId/download',
  authenticate,
  certificateIdParamValidator,
  validate,
  certificateController.downloadCertificate
);

module.exports = router;
