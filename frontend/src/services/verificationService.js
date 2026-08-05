// src/services/verificationService.js
// Wraps the public certificate verification endpoint exposed by the
// backend (see backend certificate.routes.js).
//
// GET /api/certificates/verify/:certificateId
// This is a fully public route — no JWT is required. The backend
// returns a shaped payload (see certificate.service.js on the
// backend: toPublicVerificationView) containing only the fields
// safe for public display; it never exposes server file paths or
// internal IDs beyond the certificate's own id.
//
// The backend identifies a certificate by its UUID id, NOT by its
// human-readable certificate number (e.g. "ECL-2026-ABCD1234").
// The verification form therefore accepts either:
//   a) A raw UUID — passed directly to the endpoint.
//   b) A full verification URL ending in a UUID — the UUID is
//      extracted client-side (see extractCertificateId below).
//   c) A certificate number (ECL-YYYY-XXXXXXXX format) — the
//      backend has no search-by-number endpoint, so this is handled
//      gracefully with a clear "not found by number" message.

import api from './api.js';

/**
 * Attempts to extract a UUID from either a bare UUID string or a
 * full verification URL (e.g. http://localhost:5173/verify/<uuid>).
 * Returns the UUID string if found, otherwise returns null.
 */
export function extractCertificateId(input) {
  if (!input) return null;
  const trimmed = input.trim();
  // UUID v4 pattern (8-4-4-4-12 hex groups).
  const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
  const match = trimmed.match(uuidPattern);
  return match ? match[0] : null;
}

/**
 * Calls GET /api/certificates/verify/:certificateId.
 * Returns the backend's public verification payload on success.
 * If the backend returns a 404-level not-found (the endpoint returns
 * 200 with isValid:false rather than a 404 HTTP status — see backend
 * certificate.controller.js verifyCertificate), the payload is still
 * returned so the UI can show a "not found" result panel.
 * Throws only on genuine network / server errors.
 */
export async function verifyCertificate(certificateId) {
  const response = await api.get(`/certificates/verify/${certificateId}`);
  return response.data.data;
  // Shape: {
  //   certificateId, certificateNumber, status, isValid,
  //   applicantName, purpose, issuedAt, notice
  // }
}
