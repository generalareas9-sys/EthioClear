/**
 * refreshToken.model.js
 *
 * Backs the revocable refresh-token mechanism (see migration
 * 001_create_refresh_tokens.sql). Only token HASHES are ever stored
 * or queried here — the raw token never touches the database.
 */

const { query } = require('../config/db.config');

async function create({ userId, tokenHash, expiresAt }) {
  const result = await query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, expires_at, created_at`,
    [userId, tokenHash, expiresAt]
  );
  return result.rows[0];
}

/** Find an active (not revoked, not expired) refresh token by its hash. */
async function findActiveByHash(tokenHash) {
  const result = await query(
    `SELECT id, user_id, token_hash, expires_at, revoked, created_at
     FROM refresh_tokens
     WHERE token_hash = $1
       AND revoked = FALSE
       AND expires_at > now()`,
    [tokenHash]
  );
  return result.rows[0] || null;
}

async function revokeByHash(tokenHash) {
  await query(`UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = $1`, [tokenHash]);
}

async function revokeById(id) {
  await query(`UPDATE refresh_tokens SET revoked = TRUE WHERE id = $1`, [id]);
}

module.exports = { create, findActiveByHash, revokeByHash, revokeById };
