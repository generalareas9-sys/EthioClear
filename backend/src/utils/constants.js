/**
 * constants.js
 *
 * Central source of truth for fixed value sets that must stay in sync
 * with the PostgreSQL enum types defined in schema.sql. Keeping these
 * as plain objects (not classes) keeps them cheap to import anywhere.
 */

const ROLES = Object.freeze({
  APPLICANT: 'applicant',
  OFFICER: 'officer',
  ADMIN: 'admin',
});

const ALL_ROLES = Object.freeze(Object.values(ROLES));

const USER_STATUS = Object.freeze({
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  DEACTIVATED: 'deactivated',
});

const APPLICATION_STATUS = Object.freeze({
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CERTIFICATE_ISSUED: 'certificate_issued',
});

const DOCUMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
});

const CERTIFICATE_STATUS = Object.freeze({
  ACTIVE: 'active',
  REVOKED: 'revoked',
});

const ALLOWED_DOCUMENT_MIME_TYPES = Object.freeze(['application/pdf', 'image/jpeg', 'image/png']);

const AUDIT_ACTIONS = Object.freeze({
  USER_REGISTERED: 'USER_REGISTERED',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  TOKEN_REFRESHED: 'TOKEN_REFRESHED',
  LOGOUT: 'LOGOUT',
  APPLICATION_SUBMITTED: 'APPLICATION_SUBMITTED',
  APPLICATION_RESUBMITTED: 'APPLICATION_RESUBMITTED',
  DOCUMENT_UPLOADED: 'DOCUMENT_UPLOADED',
  APPLICATION_APPROVED: 'APPLICATION_APPROVED',
  APPLICATION_REJECTED: 'APPLICATION_REJECTED',
  OFFICER_ACCOUNT_CREATED: 'OFFICER_ACCOUNT_CREATED',
  USER_ACTIVATED: 'USER_ACTIVATED',
  USER_DEACTIVATED: 'USER_DEACTIVATED',
  CERTIFICATE_GENERATED: 'CERTIFICATE_GENERATED',
  CERTIFICATE_DOWNLOADED: 'CERTIFICATE_DOWNLOADED',
  CERTIFICATE_VERIFIED: 'CERTIFICATE_VERIFIED',
});

module.exports = {
  ROLES,
  ALL_ROLES,
  USER_STATUS,
  APPLICATION_STATUS,
  DOCUMENT_STATUS,
  CERTIFICATE_STATUS,
  ALLOWED_DOCUMENT_MIME_TYPES,
  AUDIT_ACTIONS,
};
