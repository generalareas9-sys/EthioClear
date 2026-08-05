// src/services/applicantService.js
// Thin wrapper around the existing Axios instance (services/api.js)
// for the Applicant endpoints exposed by the backend (see backend
// applicant.routes.js, mounted at /api/applicant). Pages import from
// here instead of calling `api` directly, keeping the HTTP contract
// in one place.

import api from './api.js';

/** POST /api/applicant/applications — create a new application. */
export async function createApplication(purpose) {
  const response = await api.post('/applicant/applications', { purpose });
  return response.data.data.application;
}

/** GET /api/applicant/applications — the caller's own applications, paginated. */
export async function listApplications({ page = 1, limit = 20 } = {}) {
  const response = await api.get('/applicant/applications', { params: { page, limit } });
  return response.data.data; // { applications, pagination }
}

/** GET /api/applicant/applications/:id — one application plus its documents. */
export async function getApplication(applicationId) {
  const response = await api.get(`/applicant/applications/${applicationId}`);
  return response.data.data; // { application, documents }
}

/**
 * POST /api/applicant/applications/:id/documents — uploads ONE file
 * per call (the backend accepts a single `document` field per
 * request — see backend upload.middleware.js). To upload several
 * documents, call this once per file.
 *
 * @param {string} applicationId
 * @param {File} file
 * @param {string} documentType
 * @param {(progressEvent: ProgressEvent) => void} [onUploadProgress]
 */
export async function uploadDocument(applicationId, file, documentType, onUploadProgress) {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('documentType', documentType);

  const response = await api.post(`/applicant/applications/${applicationId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
  return response.data.data; // { document, application }
}
