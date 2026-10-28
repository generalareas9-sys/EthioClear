/**
 * user.model.js
 *
 * All direct database access for the `users` table lives here.
 * Every query is parameterized ($1, $2, ...) — user input is never
 * concatenated into SQL strings — to prevent SQL injection.
 */

const { query } = require('../config/db.config');

/**
 * Create a new user. Role is always passed explicitly by the caller
 * (never taken directly from unauthenticated request bodies) so
 * self-registration cannot be used to grant elevated roles.
 */
async function createUser({ fullName, email, phoneNumber, passwordHash, role }) {
  const result = await query(
    `INSERT INTO users (full_name, email, phone_number, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, full_name, email, phone_number, role, status, created_at`,
    [fullName, email, phoneNumber || null, passwordHash, role]
  );
  return result.rows[0];
}

/** Find a user by email — includes password_hash, for use in login only. */
async function findByEmailWithPassword(email) {
  const result = await query(
    `SELECT id, full_name, email, phone_number, password_hash, role, status, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}

/** Find a user by email — public-safe fields only (no password hash). */
async function findByEmail(email) {
  const result = await query(
    `SELECT id, full_name, email, phone_number, role, status, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}

/** Find a user by primary key — public-safe fields only. */
async function findById(id) {
  const result = await query(
    `SELECT id, full_name, email, phone_number, role, status, created_at
     FROM users
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

// ---------------------------------------------------------------------
// Admin-facing queries
// ---------------------------------------------------------------------

/** List users with optional role/status filters and a name/email search, paginated. */
async function findAll({ role, status, search, limit = 20, offset = 0 } = {}) {
  const conditions = [];
  const params = [];

  if (role) {
    params.push(role);
    conditions.push(`role = $${params.length}`);
  }
  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(full_name ILIKE $${params.length} OR email ILIKE $${params.length})`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  params.push(limit);
  const limitParamIndex = params.length;
  params.push(offset);
  const offsetParamIndex = params.length;

  const result = await query(
    `SELECT id, full_name, email, phone_number, role, status, created_at, updated_at
     FROM users
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}`,
    params
  );
  return result.rows;
}

async function countAll({ role, status, search } = {}) {
  const conditions = [];
  const params = [];

  if (role) {
    params.push(role);
    conditions.push(`role = $${params.length}`);
  }
  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(full_name ILIKE $${params.length} OR email ILIKE $${params.length})`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await query(`SELECT COUNT(*)::int AS count FROM users ${whereClause}`, params);
  return result.rows[0].count;
}

async function updateStatus(id, status) {
  const result = await query(
    `UPDATE users
     SET status = $2
     WHERE id = $1
     RETURNING id, full_name, email, phone_number, role, status, created_at, updated_at`,
    [id, status]
  );
  return result.rows[0] || null;
}

async function updatePassword(id, passwordHash) {
  const result = await query(
    `UPDATE users
     SET password_hash = $2
     WHERE id = $1
     RETURNING id, full_name, email, phone_number, role, status, created_at, updated_at`,
    [id, passwordHash]
  );
  return result.rows[0] || null;
}

module.exports = {
  createUser,
  findByEmailWithPassword,
  findByEmail,
  findById,
  findAll,
  countAll,
  updateStatus,
  updatePassword,
};
