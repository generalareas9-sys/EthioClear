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

/** National ID format: EID-000-000-000 (prototype format, 3 digits - 3 digits - 3 digits). */
export function isValidNationalId(value) {
  return /^EID-\d{3}-\d{3}-\d{3}$/.test((value || '').trim());
}

/** Ethiopian phone number: 9 digits starting with 9 or 7. */
export function isValidEthiopianPhone(value) {
  const digits = (value || '').replace(/\D/g, '');
  return /^[79]\d{8}$/.test(digits);
}

/** Verifies birth date is valid, in the past, and age is at least 18 years. */
export function isAtLeast18(dateString) {
  if (!dateString) return false;
  const dob = new Date(dateString);
  if (isNaN(dob.getTime())) return false;
  const today = new Date();
  if (dob >= today) return false;
  const adultDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  return dob <= adultDate;
}

/**
 * 4-segment strength meter that reflects the real backend rules:
 * - min 8 chars
 * - uppercase letter
 * - lowercase letter
 * - number
 */
export function getPasswordStrength(value) {
  const password = value || '';
  if (!password) {
    return { score: 0, label: 'Too short', color: '#e8edf5' };
  }

  const hasMinLen = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const rulesMet = [hasMinLen, hasUpper, hasLower, hasNumber].filter(Boolean).length;

  if (!hasMinLen || rulesMet <= 1) {
    return { score: 1, label: 'Too short', color: '#dc2626' };
  }
  if (rulesMet === 2) {
    return { score: 2, label: 'Weak', color: '#f59e0b' };
  }
  if (rulesMet === 3) {
    return { score: 3, label: 'Fair', color: '#16a34a' };
  }
  return { score: 4, label: 'Strong', color: '#0f2d6b' };
}
