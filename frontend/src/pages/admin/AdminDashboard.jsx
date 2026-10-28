// src/pages/admin/AdminDashboard.jsx
// Real admin dashboard (frontend Module 5). Replaces the Module 1
// placeholder. Calls GET /api/admin/dashboard/stats and displays
// user/application/certificate counts as responsive stat cards using
// the existing StatCard, Card, and LoadingSpinner components.

import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../services/adminService.js';
import { parseApiError } from '../../utils/parseApiError.js';
import Card from '../../components/common/Card.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import StatCard from '../../components/ui/StatCard.jsx';

function AdminDashboard() {
  const [stats, setStats]     = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]     = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      setStats(await getDashboardStats());
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Helper: sum counts from the by-role / by-status arrays the
  // backend returns (e.g. [{ role:'applicant', count:3 }, ...]).
  function getCount(arr = [], key, value) {
    const item = arr.find((r) => r[key] === value);
    return item ? item.count : 0;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">System-wide statistics and quick navigation.</p>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}{' '}
          <button type="button" onClick={load} className="font-medium underline">Retry</button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" label="Loading statistics…" />
        </div>
      ) : stats && (
        <>
          {/* User stats */}
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Users</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Total Users"   value={stats.totals.users} />
              <StatCard label="Applicants"    value={getCount(stats.usersByRole, 'role', 'applicant')}
                        accentClass="text-yellow-600" />
              <StatCard label="Officers"      value={getCount(stats.usersByRole, 'role', 'officer')}
                        accentClass="text-primary-700" />
              <StatCard label="Admins"        value={getCount(stats.usersByRole, 'role', 'admin')}
                        accentClass="text-gray-600" />
            </div>
          </section>

          {/* Application stats */}
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Applications</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <StatCard label="Total"            value={stats.totals.applications} />
              <StatCard label="Pending Review"   value={getCount(stats.applicationsByStatus, 'status', 'submitted')}
                        accentClass="text-blue-600" />
              <StatCard label="Under Review"     value={getCount(stats.applicationsByStatus, 'status', 'under_review')}
                        accentClass="text-yellow-600" />
              <StatCard label="Approved"         value={getCount(stats.applicationsByStatus, 'status', 'approved')}
                        accentClass="text-secondary-700" />
              <StatCard label="Rejected"         value={getCount(stats.applicationsByStatus, 'status', 'rejected')}
                        accentClass="text-red-600" />
            </div>
          </section>

          {/* Certificate stats */}
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Certificates</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <StatCard label="Total Issued"     value={stats.totals.certificates}
                        accentClass="text-primary-700" />
              <StatCard label="Active"           value={getCount(stats.certificatesByStatus, 'status', 'active')}
                        accentClass="text-secondary-700" />
              <StatCard label="Revoked"          value={getCount(stats.certificatesByStatus, 'status', 'revoked')}
                        accentClass="text-red-600" />
            </div>
          </section>

          {/* Quick links */}
          <Card title="Quick Navigation">
            <div className="flex flex-wrap gap-3 text-sm font-medium text-primary-700">
              <Link to="/admin/users"       className="hover:underline">→ User Management</Link>
              <Link to="/admin/audit-logs"  className="hover:underline">→ Audit Logs</Link>
              <Link to="/admin/reports"     className="hover:underline">→ Reports</Link>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
