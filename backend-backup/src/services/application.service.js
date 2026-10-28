/**
 * application.service.js
 *
 * Business rules for applications that don't belong in the
 * controller (request/response handling) or the model (raw SQL).
 * Centralizing the status state-machine rules here means every entry
 * point (applicant module now, officer/admin modules later) enforces
 * the same rules consistently.
 */

const AppError = require('../utils/AppError');
const { APPLICATION_STATUS } = require('../utils/constants');

/**
 * Statuses during which an applicant is allowed to upload documents:
 * - SUBMITTED: initial state, before an officer has started review.
 * - REJECTED: applicant is fixing/resubmitting after a rejection.
 * Once review has started (UNDER_REVIEW) or concluded positively
 * (APPROVED / CERTIFICATE_ISSUED), the document set is locked.
 */
const UPLOADABLE_STATUSES = [APPLICATION_STATUS.SUBMITTED, APPLICATION_STATUS.REJECTED];

/** Throws a 404 (not a 403) so an applicant cannot distinguish "not mine" from "doesn't exist". */
function assertOwnedApplication(application) {
  if (!application) {
    throw new AppError('Application not found.', 404);
  }
  return application;
}

function assertDocumentsUploadable(application) {
  if (!UPLOADABLE_STATUSES.includes(application.status)) {
    throw new AppError(
      `Documents cannot be uploaded while the application status is '${application.status}'.`,
      409
    );
  }
}

function isResubmission(application) {
  return application.status === APPLICATION_STATUS.REJECTED;
}

/** Statuses from which an officer may approve or reject an application. */
const REVIEWABLE_STATUSES = [APPLICATION_STATUS.SUBMITTED, APPLICATION_STATUS.UNDER_REVIEW];

function assertApplicationExists(application) {
  if (!application) {
    throw new AppError('Application not found.', 404);
  }
  return application;
}

/**
 * Called when an approve/reject UPDATE affects zero rows — either the
 * application never existed (caller should have already checked via
 * assertApplicationExists) or, more likely, it was already moved out
 * of a reviewable state (already approved/rejected/certificate_issued,
 * possibly by a concurrent request). currentStatus is only used to
 * produce a clearer error message — the UPDATE itself is the actual
 * source of truth for the transition.
 */
function assertTransitionSucceeded(updatedApplication, currentStatus) {
  if (!updatedApplication) {
    throw new AppError(
      `Application cannot be reviewed while its status is '${currentStatus}'. It may have already been processed.`,
      409
    );
  }
  return updatedApplication;
}

module.exports = {
  UPLOADABLE_STATUSES,
  REVIEWABLE_STATUSES,
  assertOwnedApplication,
  assertDocumentsUploadable,
  isResubmission,
  assertApplicationExists,
  assertTransitionSucceeded,
};
