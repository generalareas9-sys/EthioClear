/**
 * dashboard.model.js
 *
 * Read-only aggregate queries backing the admin dashboard. This does
 * not implement certificate generation (Module 8) — it only counts
 * rows already defined by the approved schema, including the
 * `certificates` table, which exists from Module 2 onward.
 */

const { query } = require('../config/db.config');

async function getUserCountsByRole() {
  const result = await query(`SELECT role, COUNT(*)::int AS count FROM users GROUP BY role`);
  return result.rows;
}

async function getUserCountsByStatus() {
  const result = await query(`SELECT status, COUNT(*)::int AS count FROM users GROUP BY status`);
  return result.rows;
}

async function getApplicationCountsByStatus() {
  const result = await query(`SELECT status, COUNT(*)::int AS count FROM applications GROUP BY status`);
  return result.rows;
}

async function getCertificateCountsByStatus() {
  const result = await query(`SELECT status, COUNT(*)::int AS count FROM certificates GROUP BY status`);
  return result.rows;
}

async function getTotals() {
  const result = await query(`
    SELECT
      (SELECT COUNT(*)::int FROM users) AS total_users,
      (SELECT COUNT(*)::int FROM applications) AS total_applications,
      (SELECT COUNT(*)::int FROM certificates) AS total_certificates
  `);
  return result.rows[0];
}

module.exports = {
  getUserCountsByRole,
  getUserCountsByStatus,
  getApplicationCountsByStatus,
  getCertificateCountsByStatus,
  getTotals,
};
