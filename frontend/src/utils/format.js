// src/utils/format.js
// Small formatting helpers used across the Applicant pages.

/** e.g. "Jul 29, 2026" */
export function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** e.g. "Jul 29, 2026, 3:45 PM" */
export function formatDateTime(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Applications don't have a dedicated "reference number" column on
 * the backend (see backend schema.sql — applications.id is the only
 * identifier). This derives a short, human-friendly display code from
 * the UUID purely for the UI; it is NOT a value the backend generates
 * or recognizes on its own.
 */
export function getReferenceNumber(applicationId) {
  if (!applicationId) return '—';
  return `APP-${applicationId.slice(0, 8).toUpperCase()}`;
}

/** e.g. 2_500_000 -> "2.5 MB" — used in upload validation messages. */
export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}
