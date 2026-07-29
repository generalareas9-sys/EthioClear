/**
 * auditLog.model.js
 *
 * Append-only writes to the `audit_logs` table. No update/delete
 * functions are exposed on purpose — audit history must not be
 * mutable from application code.
 */

const { query } = require('../config/db.config');

/**
 * Record an audit log entry.
 * @param {object} params
 * @param {string|null} params.actorId - user performing the action (null for anonymous/failed-auth attempts)
 * @param {string} params.action - short action code, e.g. 'LOGIN_SUCCESS'
 * @param {string} params.entityType - e.g. 'user'
 * @param {string|null} params.entityId
 * @param {object|null} params.metadata - structured JSON detail
 * @param {string|null} params.ipAddress
 */
async function record({ actorId = null, action, entityType, entityId = null, metadata = null, ipAddress = null }) {
  await query(
    `INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, metadata, ip_address)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [actorId, action, entityType, entityId, metadata ? JSON.stringify(metadata) : null, ipAddress]
  );
}

// ---------------------------------------------------------------------
// Admin-facing read queries — audit_logs remains append-only; no
// update/delete is exposed anywhere in this model.
// ---------------------------------------------------------------------

function buildFilters({ actorId, action, entityType, dateFrom, dateTo }) {
  const conditions = [];
  const params = [];

  if (actorId) {
    params.push(actorId);
    conditions.push(`actor_id = $${params.length}`);
  }
  if (action) {
    params.push(action);
    conditions.push(`action = $${params.length}`);
  }
  if (entityType) {
    params.push(entityType);
    conditions.push(`entity_type = $${params.length}`);
  }
  if (dateFrom) {
    params.push(dateFrom);
    conditions.push(`created_at >= $${params.length}`);
  }
  if (dateTo) {
    params.push(dateTo);
    conditions.push(`created_at <= $${params.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  return { whereClause, params };
}

async function findAll(filters = {}, { limit = 20, offset = 0 } = {}) {
  const { whereClause, params } = buildFilters(filters);

  const limitParamIndex = params.length + 1;
  const offsetParamIndex = params.length + 2;
  const queryParams = [...params, limit, offset];

  const result = await query(
    `SELECT al.id, al.actor_id, u.full_name AS actor_name, u.email AS actor_email,
            al.action, al.entity_type, al.entity_id, al.metadata, al.ip_address, al.created_at
     FROM audit_logs al
     LEFT JOIN users u ON u.id = al.actor_id
     ${whereClause}
     ORDER BY al.created_at DESC
     LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}`,
    queryParams
  );
  return result.rows;
}

async function countAll(filters = {}) {
  const { whereClause, params } = buildFilters(filters);
  const result = await query(`SELECT COUNT(*)::int AS count FROM audit_logs al ${whereClause}`, params);
  return result.rows[0].count;
}

module.exports = { record, findAll, countAll };
