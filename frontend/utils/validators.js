// src/utils/validators.js
// Client-side form validation helpers. Used to catch obvious problems
// (empty fields, malformed email, weak password) before making a
// network request — the backend remains the source of truth and
// re-validates everything server-side regardless.

/** Basic email shape check — not a full RFC 5322 validator, just enough to catch typos. */
export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');
}

/**
 * Mirrors the backend's password rule (see backend auth.routes.js):
 * at least 8 characters, with an uppercase letter, a lowercase
 * letter, and a number. Returns an array of unmet requirements —
 * empty array means the password is valid.
 */
export function getPasswordRequirementErrors(value) {
  const password = value || '';
  const unmet = [];
  if (password.length < 8) unmet.push('at least 8 characters');
  if (!/[A-Z]/.test(password)) unmet.push('an uppercase letter');
  if (!/[a-z]/.test(password)) unmet.push('a lowercase letter');
  if (!/[0-9]/.test(password)) unmet.push('a number');
  return unmet;
}

export function isRequired(value) {
  return typeof value === 'string' && value.trim().length > 0;
}
