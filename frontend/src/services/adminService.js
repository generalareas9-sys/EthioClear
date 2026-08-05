// src/services/adminService.js
// Wraps every backend admin endpoint (backend admin.routes.js,
// mounted at /api/admin). No admin page calls api.js (Axios) directly
// — all HTTP details stay here.

import api from './api.js';

// ------------------------------------------------------------------
// Dashboard statistics
// GET /api/admin/dashboard/stats
// Returns { totals, usersByRole, usersByStatus,
//           applicationsByStatus, certificatesByStatus }
// ------------------------------------------------------------------
export async function getDashboardStats() {
  const response = await api.get('/admin/dashboard/stats');
  return response.data.data;
}

// ------------------------------------------------------------------
// User management
// GET /api/admin/users
// Accepts: role, status, search, page, limit
// ------------------------------------------------------------------
export async function listUsers({ role, status, search, page = 1, limit = 20 } = {}) {
  const params = { page, limit };
  if (role)   params.role   = role;
  if (status) params.status = status;
  if (search) params.search = search;
  const response = await api.get('/admin/users', { params });
  return response.data.data; // { users, pagination }
}

// GET /api/admin/users/:id
// Note: the backend's admin module has no dedicated GET /users/:id
// endpoint (see backend admin.routes.js — it exposes list, create
// officer, activate, deactivate, audit logs, and dashboard stats).
// UserDetails.jsx therefore re-uses listUsers with a search filter
// and finds the matching user client-side rather than a dedicated
// route. This comment documents the gap so it's obvious if the
// backend ever adds that endpoint.
export async function getUserById(userId) {
  // Fetch the full list filtered by the id as a search term —
  // exact match on id isn't supported by the backend's search
  // param (which does ILIKE on name/email), so we fetch a small
  // page and find the user by id client-side.
  const { users } = await listUsers({ page: 1, limit: 100 });
  return users.find((u) => u.id === userId) || null;
}

// ------------------------------------------------------------------
// Officer management (uses the same listUsers endpoint filtered by role)
// ------------------------------------------------------------------
export async function listOfficers({ search, status, page = 1, limit = 20 } = {}) {
  return listUsers({ role: 'officer', search, status, page, limit });
}

// ------------------------------------------------------------------
// Create officer account
// POST /api/admin/officers
// ------------------------------------------------------------------
export async function createOfficer({ fullName, email, phoneNumber, password }) {
  const response = await api.post('/admin/officers', { fullName, email, phoneNumber, password });
  return response.data.data.user;
}

// ------------------------------------------------------------------
// Activate / deactivate users
// PATCH /api/admin/users/:id/activate
// PATCH /api/admin/users/:id/deactivate
// ------------------------------------------------------------------
export async function activateUser(userId) {
  const response = await api.patch(`/admin/users/${userId}/activate`);
  return response.data.data.user;
}

export async function deactivateUser(userId) {
  const response = await api.patch(`/admin/users/${userId}/deactivate`);
  return response.data.data.user;
}

// ------------------------------------------------------------------
// Audit logs
// GET /api/admin/audit-logs
// Accepts: actorId, action, entityType, dateFrom, dateTo, page, limit
// ------------------------------------------------------------------
export async function listAuditLogs({
  actorId,
  action,
  entityType,
  dateFrom,
  dateTo,
  page = 1,
  limit = 20,
} = {}) {
  const params = { page, limit };
  if (actorId)    params.actorId    = actorId;
  if (action)     params.action     = action;
  if (entityType) params.entityType = entityType;
  if (dateFrom)   params.dateFrom   = dateFrom;
  if (dateTo)     params.dateTo     = dateTo;
  const response = await api.get('/admin/audit-logs', { params });
  return response.data.data; // { logs, pagination }
}
