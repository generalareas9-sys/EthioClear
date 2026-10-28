// src/pages/admin/Reports.jsx
// Reports dashboard (frontend Module 5). Built entirely from the
// data already returned by GET /api/admin/dashboard/stats, so it
// needs no extra backend endpoint. Displays: applications by status,
// user distribution by role, certificates summary, and recent
// activity counts — all as readable stat cards and simple inline
// bar charts using only Tailwind (no charting library dependency).

import { useEffect, useState, useCallback } from 'react';
import { getDashboardStats } from '../../services/adminService.js';
import { parseApiError } from '../../utils/parseApiError.js';
import { APPLICATION_STATUS_META } from '../../utils/constants.js';
import Card from '../../components/common/Card.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

// Simple inline percentage bar — pure Tailwind, no extra dependency.
function InlineBar({ label, count, total, colorClass = 'bg-primary-600' }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-700">{label}</span>
        <span className="font-medium text-gray-900">{count} <span className="text-gray-400 text-xs">({pct}%)</span></span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const STATUS_COLORS = {
  submitted:          'bg-blue-500',
  under_review:       'bg-yellow-500',
  approved:           'bg-secondary-600',
  rejected:           'bg-red-500',
  certificate_issued: 'bg-primary-600',
};

const ROLE_COLORS = { applicant: 'bg-yellow-500', officer: 'bg-primary-600', admin: 'bg-gray-500' };

function Reports() {
  const [stats, setStats]     = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]     = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try { setStats(await getDashboardStats()); }
    catch (err) { setError(parseApiError(err).message); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (isLoading) return <div className="flex justify-center py-16"><LoadingSpinner size="lg" label="Loading reports…" /></div>;
  if (error) return (
    <div role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
      {error} <button type="button" onClick={load} className="font-medium underline">Retry</button>
    </div>
  );
  if (!stats) return null;

  const totalApps  = stats.totals.applications;
  const totalUsers = stats.totals.users;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Reports</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Applications by status */}
        <Card title="Applications by Status">
          <div className="space-y-3">
            {stats.applicationsByStatus.length === 0
              ? <p className="text-sm text-gray-500">No application data yet.</p>
              : stats.applicationsByStatus.map(({ status, count }) => (
                  <InlineBar
                    key={status}
                    label={APPLICATION_STATUS_META[status]?.label || status}
                    count={count}
                    total={totalApps}
                    colorClass={STATUS_COLORS[status] || 'bg-gray-400'}
                  />
                ))
            }
            <p className="mt-2 text-xs text-gray-400">Total: {totalApps} application{totalApps !== 1 ? 's' : ''}</p>
          </div>
        </Card>

        {/* Users by role */}
        <Card title="Users by Role">
          <div className="space-y-3">
            {stats.usersByRole.length === 0
              ? <p className="text-sm text-gray-500">No user data yet.</p>
              : stats.usersByRole.map(({ role, count }) => (
                  <InlineBar
                    key={role}
                    label={role.charAt(0).toUpperCase() + role.slice(1)}
                    count={count}
                    total={totalUsers}
                    colorClass={ROLE_COLORS[role] || 'bg-gray-400'}
                  />
                ))
            }
            <p className="mt-2 text-xs text-gray-400">Total: {totalUsers} user{totalUsers !== 1 ? 's' : ''}</p>
          </div>
        </Card>

        {/* Certificates */}
        <Card title="Certificates Issued">
          <div className="space-y-3">
            {stats.certificatesByStatus.length === 0
              ? <p className="text-sm text-gray-500">No certificates issued yet.</p>
              : stats.certificatesByStatus.map(({ status, count }) => (
                  <InlineBar
                    key={status}
                    label={status.charAt(0).toUpperCase() + status.slice(1)}
                    count={count}
                    total={stats.totals.certificates}
                    colorClass={status === 'active' ? 'bg-secondary-600' : 'bg-red-500'}
                  />
                ))
            }
            <p className="mt-2 text-xs text-gray-400">Total issued: {stats.totals.certificates}</p>
          </div>
        </Card>

        {/* System summary */}
        <Card title="System Summary">
          <dl className="space-y-3 text-sm">
            {[
              ['Total Users',          stats.totals.users],
              ['Total Applications',   stats.totals.applications],
              ['Total Certificates',   stats.totals.certificates],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-gray-100 pb-2 last:border-0">
                <dt className="text-gray-600">{label}</dt>
                <dd className="font-semibold text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </div>
  );
}

export default Reports;
