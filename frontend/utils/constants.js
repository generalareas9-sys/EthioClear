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
