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
 * issued) is eligible for certificate generation.
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

/**
 * Download access: officers and admins only.
 * Applicants are NOT permitted to download certificate PDFs —
 * they receive an in-app notification with a verification URL instead.
 * Defense-in-depth: the route layer also enforces this via
 * authorize(ROLES.OFFICER, ROLES.ADMIN) before the controller runs.
 */
function assertDownloadAccess(certificateWithApplication, user) {
  if (!certificateWithApplication) {
    throw new AppError('Certificate not found.', 404);
  }
  const isStaff = user.role === ROLES.OFFICER || user.role === ROLES.ADMIN;
  if (!isStaff) {
    // Return 403 (not 404) — at this point the route layer already
    // blocked applicants, so this is a genuine permission denial for
    // any other unexpected role rather than an existence check.
    throw new AppError('You do not have permission to download certificate PDFs.', 403);
  }
  if (certificateWithApplication.status === CERTIFICATE_STATUS.REVOKED) {
    throw new AppError('This certificate has been revoked and is no longer available for download.', 410);
  }
}

/** Human-readable, reasonably-unique certificate number. DB UNIQUE constraint is the actual guarantee. */
function generateCertificateNumber() {
  const year = new Date().getFullYear();
  const randomSegment = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `ECL-${year}-${randomSegment}`;
}

/** Internal-only verification URL — never an external or government endpoint. */
function buildVerificationUrl(certificateId) {
  return `${config.verification.baseUrl}/${certificateId}`;
}

/** Shapes the public verification response — never exposes file_path or internal storage info. */
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
