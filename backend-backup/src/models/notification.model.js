/**
 * notification.model.js
 *
 * Direct database access for the `notifications` table. Only a
 * `create()` function is exposed here — the notification is append-
 * only from the server side. Reading/marking-read is handled by
 * the notifications router (future module) or directly by the
 * frontend notification service against planned endpoints.
 *
 * notification_type enum values (from schema.sql):
 *   'status_update' | 'document_request' | 'system_message'
 */

const { query } = require('../config/db.config');

/**
 * Insert a new notification row for a user.
 * @param {object} params
 * @param {string} params.userId
 * @param {'status_update'|'document_request'|'system_message'} params.type
 * @param {string} params.title          max 150 chars
 * @param {string} params.message
 * @param {string|null} [params.relatedEntityType]   e.g. 'certificate'
 * @param {string|null} [params.relatedEntityId]     UUID of the related record
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

module.exports = { create };
