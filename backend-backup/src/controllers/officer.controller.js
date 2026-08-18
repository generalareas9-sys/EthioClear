/**
 * officer.controller.js
 *
 * All handlers assume `authenticate` + `authorize(ROLES.OFFICER)` have
 * already run. Unlike the applicant module, queries here are NOT
 * scoped to req.user.id — an officer must be able to review any
 * applicant's submission — but every approve/reject action still
 * records which officer (req.user.id) performed it.
 */

const applicationModel = require('../models/application.model');
const documentModel = require('../models/document.model');
const auditLogModel = require('../models/auditLog.model');
const applicationService = require('../services/application.service');
const { success } = require('../utils/responseFormatter');
const { AUDIT_ACTIONS, APPLICATION_STATUS } = require('../utils/constants');

/**
 * GET /api/officer/applications
 * Review queue. Defaults to applications awaiting review ('submitted'),
 * oldest first (FIFO), so officers work through the backlog in order.
 * An optional ?status= filter allows viewing other stages (e.g. to
 * look up already-approved/rejected applications).
 */
async function listQueue(req, res, next) {
  try {
    const status = req.query.status || APPLICATION_STATUS.SUBMITTED;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      applicationModel.findQueue({ status, limit, offset }),
      applicationModel.countByStatus(status),
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
 * GET /api/officer/applications/:id
 * View any single application (regardless of which applicant it
 * belongs to) along with its uploaded documents.
 */
async function getApplication(req, res, next) {
  try {
    const application = await applicationModel.findByIdAny(req.params.id);
    applicationService.assertApplicationExists(application);

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
 * PATCH /api/officer/applications/:id/approve
 * Approves an application currently in 'submitted' or 'under_review'.
 */
async function approveApplication(req, res, next) {
  try {
    const existing = await applicationModel.findByIdAny(req.params.id);
    applicationService.assertApplicationExists(existing);

    const updated = await applicationModel.approve(req.params.id, req.user.id);
    applicationService.assertTransitionSucceeded(updated, existing.status);

    await auditLogModel.record({
      actorId: req.user.id,
      action: AUDIT_ACTIONS.APPLICATION_APPROVED,
      entityType: 'application',
      entityId: updated.id,
      metadata: { applicantId: updated.applicant_id },
      ipAddress: req.ip,
    });

    return success(res, {
      message: 'Application approved successfully.',
      data: { application: updated },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * PATCH /api/officer/applications/:id/reject
 * Rejects an application currently in 'submitted' or 'under_review'.
 * A rejection reason is required (see officer.routes.js validators)
 * and satisfies the database's chk_rejection_reason constraint.
 */
async function rejectApplication(req, res, next) {
  try {
    const existing = await applicationModel.findByIdAny(req.params.id);
    applicationService.assertApplicationExists(existing);

    const { rejectionReason } = req.body;
    const updated = await applicationModel.reject(req.params.id, req.user.id, rejectionReason);
    applicationService.assertTransitionSucceeded(updated, existing.status);

    await auditLogModel.record({
      actorId: req.user.id,
      action: AUDIT_ACTIONS.APPLICATION_REJECTED,
      entityType: 'application',
      entityId: updated.id,
      metadata: { applicantId: updated.applicant_id, reason: rejectionReason },
      ipAddress: req.ip,
    });

    return success(res, {
      message: 'Application rejected.',
      data: { application: updated },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listQueue, getApplication, approveApplication, rejectApplication };
