/**
 * notification.controller.js
 *
 * Handles the request/response lifecycle for authenticated
 * notification endpoints. All handlers assume `authenticate`
 * middleware has already run (req.user.id is the caller's user id).
 *
 * Security guarantee: every query in notification.model.js is
 * scoped to req.user.id — a user can never read or modify another
 * user's notifications.
 *
 * Applicants cannot CREATE notifications through these endpoints;
 * notifications are only created server-side (e.g. by
 * certificate.controller when a certificate is issued).
 */

const notificationModel = require('../models/notification.model');
const { success, failure } = require('../utils/responseFormatter');
const AppError = require('../utils/AppError');

/**
 * GET /api/notifications
 * Returns the authenticated user's notifications, newest first,
 * paginated. Response shape matches what the frontend
 * notificationService.listNotifications() expects:
 *   { notifications: [...], pagination: { page, limit, total, totalPages } }
 */
async function list(req, res, next) {
  try {
    const page  = Math.max(parseInt(req.query.page,  10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      notificationModel.findByUserId(req.user.id, { limit, offset }),
      notificationModel.countByUserId(req.user.id),
    ]);

    return success(res, {
      message: 'Notifications retrieved successfully.',
      data: {
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/notifications/unread-count
 * Returns { count: N } — used by the navbar bell badge.
 * Must be registered BEFORE the /:id/read route so Express
 * does not try to interpret "unread-count" as a notification UUID.
 */
async function unreadCount(req, res, next) {
  try {
    const count = await notificationModel.countUnread(req.user.id);
    return success(res, {
      message: 'Unread notification count retrieved.',
      data: { count },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * PATCH /api/notifications/read-all
 * Marks ALL of the authenticated user's notifications as read.
 * Must be registered before /:id/read so "read-all" is not
 * interpreted as a UUID.
 */
async function markAllRead(req, res, next) {
  try {
    await notificationModel.markAllRead(req.user.id);
    return success(res, { message: 'All notifications marked as read.' });
  } catch (err) {
    return next(err);
  }
}

/**
 * PATCH /api/notifications/:id/read
 * Marks a single notification as read. The model scopes the UPDATE
 * to req.user.id, so a user cannot mark another user's notification.
 * Returns 404 if the notification doesn't exist or belongs to
 * someone else.
 */
async function markOneRead(req, res, next) {
  try {
    const updated = await notificationModel.markOneRead(req.params.id, req.user.id);
    if (!updated) {
      return next(new AppError('Notification not found.', 404));
    }
    return success(res, {
      message: 'Notification marked as read.',
      data: { notification: updated },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { list, unreadCount, markAllRead, markOneRead };
