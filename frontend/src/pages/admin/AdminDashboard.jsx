// src/pages/admin/AdminDashboard.jsx
// Upgraded Admin Dashboard matching Figma reference design:
// - Title & System Administration Subtitle
// - Quick SLA Status & Real-time Live Activity Stream
// - 4 Core System StatCards (Total Users, Applications, Certificates, Pending Review)
// - Breakdown sections with distinct color schemes (Navy, Amber, Green, Red, Purple)
// - Quick administrative actions and recent audit activity preview

import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, listAuditLogs } from '../../services/adminService.js';
import { parseApiError } from '../../utils/parseApiError.js';
import { formatDateTime } from '../../utils/format.js';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ApplicationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function CertificateIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <path d="M12 3s7 3 7 9c0 5-7 9-7 9s-7-4-7-9c0-6 7-9 7-9Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function AdminDashboard() {
  const [stats, setStats]         = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const [statsData, logsData] = await Promise.all([
        getDashboardStats(),
        listAuditLogs({ page: 1, limit: 5 }).catch(() => ({ logs: [] })),
      ]);
      setStats(statsData);
      setRecentLogs(logsData.logs || []);
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function getCount(arr = [], key, value) {
    const item = arr.find((r) => r[key] === value);
    return item ? item.count : 0;
  }

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            System Administration
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Global metrics, audit logs, officer account provisioning, and platform analytics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/admin/users/new-officer">
            <Button size="md" className="shadow-md">
              <span className="font-bold">+</span>
              <span>Create Officer</span>
            </Button>
          </Link>
          <Link to="/admin/reports">
            <Button variant="outline" size="md">
              Generate Reports
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span>{error}</span>{' '}
          <button type="button" onClick={load} className="font-bold underline ml-2">Retry</button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" label="Loading system telemetry..." />
        </div>
      ) : stats && (
        <>
          {/* Top 4 Core Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Users"
              value={stats.totals.users}
              color="purple"
              icon={UsersIcon}
              caption={`${getCount(stats.usersByRole, 'role', 'officer')} active officers`}
            />
            <StatCard
              label="Total Applications"
              value={stats.totals.applications}
              color="navy"
              icon={ApplicationIcon}
              caption="All-time submissions"
            />
            <StatCard
              label="Pending Review"
              value={getCount(stats.applicationsByStatus, 'status', 'submitted')}
              color="amber"
              icon={ClockIcon}
              progress={stats.totals.applications > 0 ? (getCount(stats.applicationsByStatus, 'status', 'submitted') / stats.totals.applications) * 100 : 0}
            />
            <StatCard
              label="Certificates Issued"
              value={stats.totals.certificates}
              color="green"
              icon={CertificateIcon}
              caption={`${getCount(stats.certificatesByStatus, 'status', 'active')} active valid`}
            />
          </div>

          {/* User Distribution and Application Processing Breakdowns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* User Distribution Card */}
            <Card title="User Accounts Breakdown">
              <div className="space-y-4">
                {[
                  { role: 'Applicants', count: getCount(stats.usersByRole, 'role', 'applicant'), bar: 'bg-blue-600', color: 'text-blue-700' },
                  { role: 'Verification Officers', count: getCount(stats.usersByRole, 'role', 'officer'), bar: 'bg-amber-500', color: 'text-amber-700' },
                  { role: 'System Administrators', count: getCount(stats.usersByRole, 'role', 'admin'), bar: 'bg-red-500', color: 'text-red-700' },
                ].map((item) => {
                  const pct = stats.totals.users > 0 ? Math.round((item.count / stats.totals.users) * 100) : 0;
                  return (
                    <div key={item.role} className="space-y-1.5">
                      <div className="flex justify-between text-xs sm:text-sm font-semibold">
                        <span className="text-text-primary">{item.role}</span>
                        <span className={item.color}>{item.count} ({pct}%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-card-subtle overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${item.bar}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-border-theme flex justify-end">
                <Link to="/admin/users" className="text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline">
                  Manage all users →
                </Link>
              </div>
            </Card>

            {/* Application Status Distribution */}
            <Card title="Application Workflow Decisions">
              <div className="space-y-4">
                {[
                  { status: 'Submitted (Pending)', count: getCount(stats.applicationsByStatus, 'status', 'submitted'), bar: 'bg-amber-500', color: 'text-amber-600' },
                  { status: 'Under Detailed Review', count: getCount(stats.applicationsByStatus, 'status', 'under_review'), bar: 'bg-blue-500', color: 'text-blue-600' },
                  { status: 'Approved', count: getCount(stats.applicationsByStatus, 'status', 'approved'), bar: 'bg-emerald-600', color: 'text-emerald-600' },
                  { status: 'Rejected', count: getCount(stats.applicationsByStatus, 'status', 'rejected'), bar: 'bg-red-600', color: 'text-red-600' },
                ].map((item) => {
                  const pct = stats.totals.applications > 0 ? Math.round((item.count / stats.totals.applications) * 100) : 0;
                  return (
                    <div key={item.status} className="space-y-1.5">
                      <div className="flex justify-between text-xs sm:text-sm font-semibold">
                        <span className="text-text-primary">{item.status}</span>
                        <span className={item.color}>{item.count} ({pct}%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-card-subtle overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${item.bar}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-border-theme flex justify-end">
                <Link to="/admin/reports" className="text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline">
                  View analytics report →
                </Link>
              </div>
            </Card>

          </div>

          {/* Live System Activity / Audit Log Preview */}
          <Card
            title="Live Audit Log Activity"
            headerRight={
              <Link
                to="/admin/audit-logs"
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline"
              >
                View full audit trail →
              </Link>
            }
          >
            {recentLogs.length === 0 ? (
              <EmptyState
                title="No recent logs"
                description="Security and operational events will appear here in real time."
              />
            ) : (
              <div className="overflow-x-auto -mx-4 sm:-mx-6">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border-theme bg-card-subtle/50 text-xs font-bold uppercase tracking-wider text-text-muted">
                    <tr>
                      <th scope="col" className="px-6 py-3.5">Action</th>
                      <th scope="col" className="px-6 py-3.5">Actor</th>
                      <th scope="col" className="px-6 py-3.5">Entity</th>
                      <th scope="col" className="px-6 py-3.5">Timestamp</th>
                      <th scope="col" className="px-6 py-3.5">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-theme font-mono text-xs">
                    {recentLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-card-subtle/40 transition-colors">
                        <td className="px-6 py-3.5 font-bold text-text-primary whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded bg-primary-50 text-primary-700 border border-primary-200">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-text-secondary whitespace-nowrap font-sans">
                          {log.actor_name || log.actor_id || 'System'}
                        </td>
                        <td className="px-6 py-3.5 text-text-muted whitespace-nowrap font-sans capitalize">
                          {log.entity_type} {log.entity_id ? `(${log.entity_id.slice(0, 8)}…)` : ''}
                        </td>
                        <td className="px-6 py-3.5 text-text-muted whitespace-nowrap">
                          {formatDateTime(log.created_at)}
                        </td>
                        <td className="px-6 py-3.5 text-text-muted whitespace-nowrap">
                          {log.ip_address || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
