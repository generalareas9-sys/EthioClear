// src/utils/constants.js
// Shared constants used across the frontend. ROLES mirrors the
// backend's user_role enum (see backend schema.sql) so route guards
// and UI logic reference the same string values everywhere instead
// of repeating literals.

export const ROLES = Object.freeze({
  APPLICANT: 'applicant',
  OFFICER: 'officer',
  ADMIN: 'admin',
});

// Convenience array of all role values — used by ProtectedRoute for
// routes accessible to every authenticated role (e.g. /profile, /notifications).
export const ALL_ROLES = Object.freeze(Object.values(ROLES));

// Where each role lands immediately after logging in (see
// pages/auth/Login.jsx). Centralized here so any future code that
// needs "the dashboard for this role" references the same mapping.
export const ROLE_DASHBOARD_PATHS = Object.freeze({
  [ROLES.APPLICANT]: '/applicant',
  [ROLES.OFFICER]: '/officer',
  [ROLES.ADMIN]: '/admin',
});

// Keys used when persisting auth state to localStorage (see
// contexts/AuthContext.jsx and services/api.js). Centralized here so
// both files always agree on the exact key names.
export const STORAGE_KEYS = Object.freeze({
  ACCESS_TOKEN: 'ethioclear_access_token',
  REFRESH_TOKEN: 'ethioclear_refresh_token',
  CURRENT_USER: 'ethioclear_current_user',
});

// ---------------------------------------------------------------------
// Applicant module (frontend Module 3)
// ---------------------------------------------------------------------

// Mirrors the backend's application_status enum (backend schema.sql).
// label = human-readable text, badgeClass = Tailwind classes for
// components/ui/StatusBadge.jsx.
export const APPLICATION_STATUS_META = Object.freeze({
  submitted: { label: 'Submitted', badgeClass: 'bg-blue-100 text-blue-800' },
  under_review: { label: 'Under Review', badgeClass: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Approved', badgeClass: 'bg-secondary-100 text-secondary-800' },
  rejected: { label: 'Rejected', badgeClass: 'bg-red-100 text-red-800' },
  certificate_issued: { label: 'Certificate Issued', badgeClass: 'bg-primary-100 text-primary-800' },
});

// Mirrors the backend's document_status enum.
export const DOCUMENT_STATUS_META = Object.freeze({
  pending: { label: 'Pending', badgeClass: 'bg-gray-100 text-gray-700' },
  verified: { label: 'Verified', badgeClass: 'bg-secondary-100 text-secondary-800' },
  rejected: { label: 'Rejected', badgeClass: 'bg-red-100 text-red-800' },
});

// documents.document_type is free text on the backend (no enum) — this
// is just a friendly starting list for the upload form's dropdown; an
// "Other" option lets the applicant type any value.
export const DOCUMENT_TYPE_OPTIONS = Object.freeze([
  'National ID',
  'Passport',
  'Passport Photo',
  'Birth Certificate',
  'Other',
]);

// applications.purpose is likewise free text (varchar(255)) — same
// dropdown-plus-"Other" pattern as document types.
export const CERTIFICATE_PURPOSE_OPTIONS = Object.freeze([
  'Employment',
  'Visa Application',
  'University Enrollment',
  'Travel',
  'Other',
]);

// Must match the backend's MAX_UPLOAD_SIZE_MB (.env) so the frontend
// rejects an oversized file before spending a network round trip.
export const MAX_UPLOAD_SIZE_MB = 5;

// Must match the backend's ALLOWED_DOCUMENT_MIME_TYPES (utils/constants.js).
export const ALLOWED_DOCUMENT_MIME_TYPES = Object.freeze(['application/pdf', 'image/jpeg', 'image/png']);

// ---------------------------------------------------------------------
// Officer module (frontend Module 4)
// ---------------------------------------------------------------------

// The backend's queue endpoint (GET /officer/applications) filters by
// exactly one status per request — this is the officer-facing list of
// selectable statuses, in workflow order, for the queue's status filter.
export const OFFICER_QUEUE_STATUS_OPTIONS = Object.freeze([
  'submitted',
  'under_review',
  'approved',
  'rejected',
  'certificate_issued',
]);

// ---------------------------------------------------------------------
// Admin module (frontend Module 5)
// ---------------------------------------------------------------------

// User status values — mirror the backend's user_status enum
// (backend schema.sql). Used in UserManagement filters and badges.
export const USER_STATUS_META = Object.freeze({
  active:      { label: 'Active',      badgeClass: 'bg-secondary-100 text-secondary-800' },
  suspended:   { label: 'Suspended',   badgeClass: 'bg-yellow-100 text-yellow-800' },
  deactivated: { label: 'Deactivated', badgeClass: 'bg-gray-100 text-gray-700' },
});

// Role display labels reused in admin tables.
export const ROLE_LABELS = Object.freeze({
  applicant: 'Applicant',
  officer:   'Officer',
  admin:     'Admin',
});
