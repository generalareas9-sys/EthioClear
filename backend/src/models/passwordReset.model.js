const { query } = require('../config/db.config');

async function create({ userId, tokenHash, expiresAt }) {
  const result = await query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, expires_at, used, created_at`,
    [userId, tokenHash, expiresAt]
  );
  return result.rows[0];
}

async function findActiveByHash(tokenHash) {
  const result = await query(
    `SELECT id, user_id, token_hash, expires_at, used, created_at
     FROM password_reset_tokens
     WHERE token_hash = $1
       AND used = FALSE
       AND expires_at > now()`,
    [tokenHash]
  );
  return result.rows[0] || null;
}

async function markUsedById(id) {
  await query(`UPDATE password_reset_tokens SET used = TRUE WHERE id = $1`, [id]);
}

module.exports = { create, findActiveByHash, markUsedById };
