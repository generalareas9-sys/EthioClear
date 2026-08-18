/**
 * admin.controller.js
 *
 * All handlers assume `authenticate` + `authorize(ROLES.ADMIN)` have
 * already run.
 */

const userModel = require('../models/user.model');
const auditLogModel = require('../models/auditLog.model');
const dashboardModel = require('../models/dashboard.model');
const authService = require('../services/auth.service');
const AppError = require('../utils/AppError');
const { success } = require('../utils/responseFormatter');
const { ROLES, AUDIT_ACTIONS, USER_STATUS } = require('../utils/constants');

/**
 * GET /api/admin/users
 * Lists all users with optional role/status filters and a name/email
 * search, paginated.
 */
async function listUsers(req, res, next) {
  try {
    const { role, status, search } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const filters = { role, status, search };
    const [users, total] = await Promise.all([
      userModel.findAll({ ...filters, limit, offset }),
      userModel.countAll(filters),
    ]);

    return success(res, {
      message: 'Users retrieved successfully.',
      data: {
        users,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/admin/officers
 * Creates a new officer account. This is the only way officer
 * accounts come into existence — the public registration endpoint
 * (Module 4) can only ever create 'applicant' accounts.
 */
async function createOfficer(req, res, next) {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    const existing = await userModel.findByEmail(email);
    if (existing) {
      return next(new AppError('A user with this email already exists.', 409));
    }

    const passwordHash = await authService.hashPassword(password);
    const officer = await userModel.createUser({
      fullName,
      email,
      phoneNumber,
      passwordHash,
      role: ROLES.OFFICER,
    });

    await auditLogModel.record({
      actorId: req.user.id,
      action: AUDIT_ACTIONS.OFFICER_ACCOUNT_CREATED,
      entityType: 'user',
      entityId: officer.id,
      metadata: { email: officer.email },
      ipAddress: req.ip,
    });

    return success(res, {
      statusCode: 201,
      message: 'Officer account created successfully.',
      data: { user: officer },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * PATCH /api/admin/users/:id/activate
 */
async function activateUser(req, res, next) {
  try {
    const user = await setUserStatus(req, USER_STATUS.ACTIVE, AUDIT_ACTIONS.USER_ACTIVATED);
    return success(res, { message: 'User account activated.', data: { user } });
  } catch (err) {
    return next(err);
  }
}

/**
 * PATCH /api/admin/users/:id/deactivate
 * An admin cannot deactivate their own account, to prevent
 * accidental self-lockout with no other admin able to reverse it.
 */
async function deactivateUser(req, res, next) {
  try {
    if (req.params.id === req.user.id) {
      throw new AppError('You cannot deactivate your own account.', 400);
    }
    const user = await setUserStatus(req, USER_STATUS.DEACTIVATED, AUDIT_ACTIONS.USER_DEACTIVATED);
    return success(res, { message: 'User account deactivated.', data: { user } });
  } catch (err) {
    return next(err);
  }
}

/** Shared helper for the two status-change handlers above. */
async function setUserStatus(req, status, auditAction) {
  const existing = await userModel.findById(req.params.id);
  if (!existing) {
    throw new AppError('User not found.', 404);
  }

  const updated = await userModel.updateStatus(req.params.id, status);

  await auditLogModel.record({
    actorId: req.user.id,
    action: auditAction,
    entityType: 'user',
    entityId: updated.id,
    metadata: { email: updated.email, previousStatus: existing.status, newStatus: updated.status },
    ipAddress: req.ip,
  });

  return updated;
}

/**
 * GET /api/admin/audit-logs
 * Paginated, filterable view of the append-only audit trail.
 */
async function listAuditLogs(req, res, next) {
  try {
    const { actorId, action, entityType, dateFrom, dateTo } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const filters = { actorId, action, entityType, dateFrom, dateTo };
    const [logs, total] = await Promise.all([
      auditLogModel.findAll(filters, { limit, offset }),
      auditLogModel.countAll(filters),
    ]);

    return success(res, {
      message: 'Audit logs retrieved successfully.',
      data: {
        logs,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/admin/dashboard/stats
 * Aggregate counts for the admin dashboard: users by role/status,
 * applications by status, certificates by status, and overall totals.
 * Read-only — does not implement certificate generation (Module 8).
 */
async function getDashboardStats(req, res, next) {
  try {
    const [usersByRole, usersByStatus, applicationsByStatus, certificatesByStatus, totals] = await Promise.all([
      dashboardModel.getUserCountsByRole(),
      dashboardModel.getUserCountsByStatus(),
      dashboardModel.getApplicationCountsByStatus(),
      dashboardModel.getCertificateCountsByStatus(),
      dashboardModel.getTotals(),
    ]);

    return success(res, {
      message: 'Dashboard statistics retrieved successfully.',
      data: {
        totals: {
          users: totals.total_users,
          applications: totals.total_applications,
          certificates: totals.total_certificates,
        },
        usersByRole,
        usersByStatus,
        applicationsByStatus,
        certificatesByStatus,
      },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listUsers,
  createOfficer,
  activateUser,
  deactivateUser,
  listAuditLogs,
  getDashboardStats,
};
