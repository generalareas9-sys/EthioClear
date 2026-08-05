// src/services/officerService.js
// Thin wrapper around the existing Axios instance (services/api.js)
// for the Officer endpoints exposed by the backend (see backend
// officer.routes.js, mounted at /api/officer).
//
// Note: the backend's queue endpoint (GET /officer/applications) only
// filters by ONE status value per call (it defaults to 'submitted' —
// see backend officer.controller.js listQueue). There is no "all
// statuses at once" option. getQueueCounts() below works around that
// for dashboard summary cards by firing one lightweight request per
// status (limit=1, so only the exact `pagination.total` is read, not
// the actual rows) rather than pulling every application client-side.

import api from './api.js';

const ALL_STATUSES = ['submitted', 'under_review', 'approved', 'rejected', 'certificate_issued'];

/** GET /api/officer/applications — one status at a time, paginated. */
export async function listQueue({ status = 'submitted', page = 1, limit = 10 } = {}) {
  const response = await api.get('/officer/applications', { params: { status, page, limit } });
  return response.data.data; // { applications, pagination }
}

/** GET /api/officer/applications/:id — full application (any applicant) plus its documents. */
export async function getApplication(applicationId) {
  const response = await api.get(`/officer/applications/${applicationId}`);
  return response.data.data; // { application, documents }
}

/** PATCH /api/officer/applications/:id/approve */
export async function approveApplication(applicationId) {
  const response = await api.patch(`/officer/applications/${applicationId}/approve`);
  return response.data.data.application;
}

/** PATCH /api/officer/applications/:id/reject — rejectionReason is required by the backend. */
export async function rejectApplication(applicationId, rejectionReason) {
  const response = await api.patch(`/officer/applications/${applicationId}/reject`, { rejectionReason });
  return response.data.data.application;
}

/**
 * Exact per-status counts for the dashboard summary cards, using
 * `pagination.total` from five parallel limit=1 requests rather than
 * fetching (and counting) every row — cheap and always accurate,
 * unlike computing counts from a single fetched page.
 */
export async function getQueueCounts() {
  const results = await Promise.all(ALL_STATUSES.map((status) => listQueue({ status, page: 1, limit: 1 })));
  const totals = {};
  ALL_STATUSES.forEach((status, index) => {
    totals[status] = results[index].pagination.total;
  });
  return totals;
}
