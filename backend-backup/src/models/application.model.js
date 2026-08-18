/**
 * application.model.js
 *
 * Direct database access for the `applications` table. All queries
 * are parameterized. Ownership enforcement (applicant can only see
 * their own applications) is done here by always scoping queries to
 * a given applicant_id, rather than trusting the controller layer
 * alone.
 */

const { query } = require('../config/db.config');

async function createApplication({ applicantId, purpose }) {
  const result = await query(
    `INSERT INTO applications (applicant_id, purpose)
     VALUES ($1, $2)
     RETURNING id, applicant_id, purpose, status, rejection_reason, submitted_at, reviewed_at, created_at, updated_at`,
    [applicantId, purpose]
  );
  return result.rows[0];
}

async function findAllByApplicant(applicantId, { limit = 20, offset = 0 } = {}) {
  const result = await query(
    `SELECT id, applicant_id, purpose, status, rejection_reason, submitted_at, reviewed_at, created_at, updated_at
     FROM applications
     WHERE applicant_id = $1
     ORDER BY submitted_at DESC
     LIMIT $2 OFFSET $3`,
    [applicantId, limit, offset]
  );
  return result.rows;
}

async function countByApplicant(applicantId) {
  const result = await query(`SELECT COUNT(*)::int AS count FROM applications WHERE applicant_id = $1`, [applicantId]);
  return result.rows[0].count;
}

/** Scoped to a specific applicant — returns null if the application doesn't exist or belongs to someone else. */
async function findByIdForApplicant(applicationId, applicantId) {
  const result = await query(
    `SELECT id, applicant_id, purpose, status, rejection_reason, submitted_at, reviewed_at, created_at, updated_at
     FROM applications
     WHERE id = $1 AND applicant_id = $2`,
    [applicationId, applicantId]
  );
  return result.rows[0] || null;
}

/**
 * Resets a rejected application back into the review pipeline after
 * the applicant resubmits documents: status → 'submitted', reviewer
 * fields cleared so the officer sees it as a fresh item in the queue.
 */
async function resetForResubmission(applicationId) {
  const result = await query(
    `UPDATE applications
     SET status = 'submitted', reviewed_by = NULL, reviewed_at = NULL, rejection_reason = NULL
     WHERE id = $1
     RETURNING id, applicant_id, purpose, status, rejection_reason, submitted_at, reviewed_at, created_at, updated_at`,
    [applicationId]
  );
  return result.rows[0];
}

// ---------------------------------------------------------------------
// Officer-scoped queries — not restricted to a single applicant_id,
// since officers must be able to review any applicant's submission.
// ---------------------------------------------------------------------

/** Queue of applications in a given status (default: awaiting review), oldest first (FIFO). */
async function findQueue({ status = 'submitted', limit = 20, offset = 0 } = {}) {
  const result = await query(
    `SELECT a.id, a.applicant_id, a.purpose, a.status, a.rejection_reason, a.submitted_at, a.reviewed_at,
            a.created_at, a.updated_at, u.full_name AS applicant_name, u.email AS applicant_email
     FROM applications a
     JOIN users u ON u.id = a.applicant_id
     WHERE a.status = $1
     ORDER BY a.submitted_at ASC
     LIMIT $2 OFFSET $3`,
    [status, limit, offset]
  );
  return result.rows;
}

async function countByStatus(status) {
  const result = await query(`SELECT COUNT(*)::int AS count FROM applications WHERE status = $1`, [status]);
  return result.rows[0].count;
}

/** Fetch any application by id, regardless of owner — for officer/admin use. */
async function findByIdAny(applicationId) {
  const result = await query(
    `SELECT a.id, a.applicant_id, a.purpose, a.status, a.rejection_reason, a.submitted_at, a.reviewed_at,
            a.created_at, a.updated_at, u.full_name AS applicant_name, u.email AS applicant_email
     FROM applications a
     JOIN users u ON u.id = a.applicant_id
     WHERE a.id = $1`,
    [applicationId]
  );
  return result.rows[0] || null;
}

/**
 * Atomically approve an application. The WHERE status IN (...) clause
 * makes this safe under concurrent requests: only one caller can win
 * the transition, and rowCount === 0 tells us either the application
 * doesn't exist or was already moved out of a reviewable state.
 */
async function approve(applicationId, officerId) {
  const result = await query(
    `UPDATE applications
     SET status = 'approved', reviewed_by = $2, reviewed_at = now()
     WHERE id = $1 AND status IN ('submitted', 'under_review')
     RETURNING id, applicant_id, purpose, status, rejection_reason, submitted_at, reviewed_at, created_at, updated_at`,
    [applicationId, officerId]
  );
  return result.rows[0] || null;
}

/** Atomically reject an application with a required reason (see approve() for the concurrency note). */
async function reject(applicationId, officerId, rejectionReason) {
  const result = await query(
    `UPDATE applications
     SET status = 'rejected', reviewed_by = $2, reviewed_at = now(), rejection_reason = $3
     WHERE id = $1 AND status IN ('submitted', 'under_review')
     RETURNING id, applicant_id, purpose, status, rejection_reason, submitted_at, reviewed_at, created_at, updated_at`,
    [applicationId, officerId, rejectionReason]
  );
  return result.rows[0] || null;
}

module.exports = {
  createApplication,
  findAllByApplicant,
  countByApplicant,
  findByIdForApplicant,
  resetForResubmission,
  findQueue,
  countByStatus,
  findByIdAny,
  approve,
  reject,
};
