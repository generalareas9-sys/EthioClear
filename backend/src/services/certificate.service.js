/**
 * certificate.service.js
 *
 * Business rules for certificate issuance, download access, and the
 * public verification response shape — kept separate from the
 * controller (HTTP) and model (SQL) layers.
 */

const crypto = require('crypto');
const AppError = require('../utils/AppError');
const config = require('../config/env.config');
const { APPLICATION_STATUS, CERTIFICATE_STATUS, ROLES } = require('../utils/constants');

/**
 * Fast, pre-transaction check: only an approved application (not yet
 * issued) is eligible for certificate generation. This is a first
 * line of defense for a clear error message — the actual guarantee
 * against double-issuance is the atomic transaction in
 * certificate.model.js's issueWithTransaction().
 */
function assertApplicationReadyForCertificate(application) {
  if (!application) {
    throw new AppError('Application not found.', 404);
  }
  if (application.status === APPLICATION_STATUS.CERTIFICATE_ISSUED) {
    throw new AppError('A certificate has already been generated for this application.', 409);
  }
  if (application.status !== APPLICATION_STATUS.APPROVED) {
    throw new AppError(
      `A certificate can only be generated for an approved application (current status: '${application.status}').`,
      409
    );
  }
}

/** Applicants may only download their own certificate; officers/admins may download any. */
function assertDownloadAccess(certificateWithApplication, user) {
  if (!certificateWithApplication) {
    throw new AppError('Certificate not found.', 404);
  }
  const isOwner = certificateWithApplication.applicant_id === user.id;
  const isStaff = user.role === ROLES.OFFICER || user.role === ROLES.ADMIN;
  if (!isOwner && !isStaff) {
    throw new AppError('Certificate not found.', 404); // 404, not 403 — avoid confirming existence to non-owners
  }
  if (certificateWithApplication.status === CERTIFICATE_STATUS.REVOKED) {
    throw new AppError('This certificate has been revoked and is no longer available for download.', 410);
  }
}

/** Human-readable, reasonably-unique certificate number. The DB UNIQUE constraint is the actual guarantee. */
function generateCertificateNumber() {
  const year = new Date().getFullYear();
  const randomSegment = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `ECL-${year}-${randomSegment}`;
}

/** Internal-only verification URL — never an external or government endpoint. */
function buildVerificationUrl(certificateId) {
  return `${config.verification.baseUrl}/${certificateId}`;
}

/** Shapes the public verification response — deliberately excludes server file paths and any field not meant for public consumption. */
function toPublicVerificationView(certificateWithApplication) {
  return {
    certificateId: certificateWithApplication.id,
    certificateNumber: certificateWithApplication.certificate_number,
    status: certificateWithApplication.status,
    isValid: certificateWithApplication.status === CERTIFICATE_STATUS.ACTIVE,
    applicantName: certificateWithApplication.applicant_name,
    purpose: certificateWithApplication.purpose,
    issuedAt: certificateWithApplication.issued_at,
    notice: 'This is an academic prototype record, not a legally binding government certificate.',
  };
}

module.exports = {
  assertApplicationReadyForCertificate,
  assertDownloadAccess,
  generateCertificateNumber,
  buildVerificationUrl,
  toPublicVerificationView,
};
