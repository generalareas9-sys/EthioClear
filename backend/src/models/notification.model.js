/**
 * notification.model.js
 *
 * Direct database access for the `notifications` table.
 * notification_type enum values (from schema.sql):
 *   'status_update' | 'document_request' | 'system_message'
 *
 * Security: every read/update query is scoped to a userId so one
 * user can never retrieve or modify another user's notifications.
 */

const { query } = require('../config/db.config');

/**
 * Insert a new notification row for a user.
 * Called by certificate.controller after successful certificate issuance.
 */
async function create({ userId, type, title, message, relatedEntityType = null, relatedEntityId = null }) {
  const result = await query(
    `INSERT INTO notifications (user_id, type, title, message, related_entity_type, related_entity_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, user_id, type, title, message, is_read, related_entity_type, related_entity_id, created_at`,
    [userId, type, title, message, relatedEntityType, relatedEntityId]
  );
  return result.rows[0];
}

/**
 * Paginated list of notifications belonging to a single user,
 * newest first. The WHERE clause guarantees strict user isolation.
 */
async function findByUserId(userId, { limit = 20, offset = 0 } = {}) {
  const result = await query(
    `SELECT id, user_id, type, title, message, is_read,
            related_entity_type, related_entity_id, created_at
     FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return result.rows;
}

/** Total notification count for a user — used for pagination. */
async function countByUserId(userId) {
  const result = await query(
    `SELECT COUNT(*)::int AS count FROM notifications WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0].count;
}

/** Unread count for the navbar bell badge. */
async function countUnread(userId) {
  const result = await query(
    `SELECT COUNT(*)::int AS count FROM notifications WHERE user_id = $1 AND is_read = FALSE`,
    [userId]
  );
  return result.rows[0].count;
}

/**
 * Mark a single notification as read.
 * The AND user_id = $2 clause ensures applicants can only mark
 * their own notifications — never another user's.
 * Returns null if the notification doesn't exist or belongs to
 * someone else (caller treats this as a 404).
 */
async function markOneRead(notificationId, userId) {
  const result = await query(
    `UPDATE notifications
     SET is_read = TRUE
     WHERE id = $1 AND user_id = $2
     RETURNING id, user_id, type, title, message, is_read, related_entity_type, related_entity_id, created_at`,
    [notificationId, userId]
  );
  return result.rows[0] || null;
}

/**
 * Mark ALL notifications for a user as read.
 * Scoped strictly to userId.
 */
async function markAllRead(userId) {
  await query(
    `UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE`,
    [userId]
  );
}

module.exports = { create, findByUserId, countByUserId, countUnread, markOneRead, markAllRead };
