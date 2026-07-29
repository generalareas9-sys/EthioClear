/**
 * applicant.controller.js
 *
 * All handlers here assume `authenticate` + `authorize(ROLES.APPLICANT)`
 * have already run — req.user.id is the applicant's own user id, and
 * every query is scoped to it so applicants can never read or modify
 * another applicant's data.
 */

const path = require('path');
const fs = require('fs/promises');

const applicationModel = require('../models/application.model');
const documentModel = require('../models/document.model');
const auditLogModel = require('../models/auditLog.model');
const applicationService = require('../services/application.service');
const config = require('../config/env.config');
const { success } = require('../utils/responseFormatter');
const { AUDIT_ACTIONS } = require('../utils/constants');

/**
 * POST /api/applicant/applications
 * Submits a new certificate application. No documents are attached
 * at this point — they're uploaded via the separate documents route.
 */
async function createApplication(req, res, next) {
  try {
    const { purpose } = req.body;

    const application = await applicationModel.createApplication({
      applicantId: req.user.id,
      purpose,
    });

    await auditLogModel.record({
      actorId: req.user.id,
      action: AUDIT_ACTIONS.APPLICATION_SUBMITTED,
      entityType: 'application',
      entityId: application.id,
      metadata: { purpose: application.purpose },
      ipAddress: req.ip,
    });

    return success(res, {
      statusCode: 201,
      message: 'Application submitted successfully.',
      data: { application },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/applicant/applications
 * Lists applications belonging to the logged-in applicant, most
 * recent first. Supports basic pagination via ?page=&limit=.
 */
async function listApplications(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      applicationModel.findAllByApplicant(req.user.id, { limit, offset }),
      applicationModel.countByApplicant(req.user.id),
    ]);

    return success(res, {
      message: 'Applications retrieved successfully.',
      data: {
        applications,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/applicant/applications/:id
 * Returns a single application (only if it belongs to the caller)
 * along with its uploaded documents.
 */
async function getApplication(req, res, next) {
  try {
    const application = await applicationModel.findByIdForApplicant(req.params.id, req.user.id);
    applicationService.assertOwnedApplication(application);

    const documents = await documentModel.findByApplicationId(application.id);

    return success(res, {
      message: 'Application retrieved successfully.',
      data: { application, documents },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/applicant/applications/:id/documents
 * Uploads one supporting document for an application the applicant
 * owns. Only permitted while the application is 'submitted' (initial
 * upload) or 'rejected' (resubmission) — see application.service.js.
 * A rejected application is automatically moved back to 'submitted'
 * so it re-enters the officer review queue.
 */
async function uploadDocument(req, res, next) {
  try {
    const application = await applicationModel.findByIdForApplicant(req.params.id, req.user.id);
    applicationService.assertOwnedApplication(application);

    try {
      applicationService.assertDocumentsUploadable(application);
    } catch (err) {
      // Clean up the file Multer already wrote to disk before
      // rejecting the request, so nothing orphaned is left behind.
      await fs.unlink(req.file.path).catch(() => {});
      throw err;
    }

    const wasRejected = applicationService.isResubmission(application);

    const relativePath = path.join(config.storage.uploadDir, req.file.filename);

    const document = await documentModel.createDocument({
      applicationId: application.id,
      documentType: req.body.documentType,
      fileName: req.file.filename,
      originalFileName: req.file.originalname,
      filePath: relativePath,
      mimeType: req.file.mimetype,
      fileSizeBytes: req.file.size,
    });

    await auditLogModel.record({
      actorId: req.user.id,
      action: AUDIT_ACTIONS.DOCUMENT_UPLOADED,
      entityType: 'document',
      entityId: document.id,
      metadata: { applicationId: application.id, documentType: document.document_type },
      ipAddress: req.ip,
    });

    let updatedApplication = application;
    if (wasRejected) {
      updatedApplication = await applicationModel.resetForResubmission(application.id);
      await auditLogModel.record({
        actorId: req.user.id,
        action: AUDIT_ACTIONS.APPLICATION_RESUBMITTED,
        entityType: 'application',
        entityId: application.id,
        ipAddress: req.ip,
      });
    }

    return success(res, {
      statusCode: 201,
      message: wasRejected
        ? 'Document uploaded and application resubmitted for review.'
        : 'Document uploaded successfully.',
      data: { document, application: updatedApplication },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { createApplication, listApplications, getApplication, uploadDocument };
