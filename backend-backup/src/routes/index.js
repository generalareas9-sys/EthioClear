/**
 * routes/index.js
 *
 * Single place where all route modules are mounted under the API
 * base path. Business-domain routers (auth, applicant, officer,
 * admin, certificate, report) will be added here in later modules —
 * only the health check exists at this stage.
 */

const express = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const applicantRoutes = require('./applicant.routes');
const officerRoutes = require('./officer.routes');
const adminRoutes = require('./admin.routes');
const certificateRoutes = require('./certificate.routes');
const notificationRoutes = require('./notification.routes');

const router = express.Router();

router.use(healthRoutes);
router.use('/auth', authRoutes);
router.use('/applicant', applicantRoutes);
router.use('/officer', officerRoutes);
router.use('/admin', adminRoutes);
router.use('/certificates', certificateRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
