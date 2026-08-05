// src/services/notificationService.js
// Wraps the backend notifications endpoints. The backend schema.sql
// has a `notifications` table and the seed.sql inserts demo
// notifications. However, the backend Modules 3–8 did not build
// dedicated notification routes (no /api/notifications/* router was
// created). This service is therefore structured to call the most
// natural endpoint names; if the backend returns 404 the Notifications
// page shows a graceful "not available" message.
//
// If a notifications router is added to the backend later, these
// functions will work without any frontend change.

import api from './api.js';

/**
 * GET /api/notifications
 * Returns { notifications, pagination }
 */
export async function listNotifications({ page = 1, limit = 20 } = {}) {
  const response = await api.get('/notifications', { params: { page, limit } });
  return response.data.data;
}

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read.
 */
export async function markOneRead(notificationId) {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return response.data.data;
}

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read.
 */
export async function markAllRead() {
  const response = await api.patch('/notifications/read-all');
  return response.data.data;
}

/**
 * GET /api/notifications/unread-count
 * Returns the unread count for the navbar bell.
 */
export async function getUnreadCount() {
  const response = await api.get('/notifications/unread-count');
  return response.data.data?.count ?? 0;
}
