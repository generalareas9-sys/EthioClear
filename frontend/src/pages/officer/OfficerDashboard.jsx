// src/pages/officer/OfficerDashboard.jsx
// Upgraded Officer Dashboard matching Figma design:
// - Title & Welcome subtitle
// - Stat Cards with real counts and distinct colors (navy for total, amber for pending, green for approved, red for rejected, indigo for certificates)
// - Table of pending review items with applicant avatar initials circle, mono ID, colored status pill, and "Review" action button
// - Quick status queue links with live counts

import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { listQueue, getQueueCounts } from '../../services/officerService.js';
import { parseApiError } from '../../utils/parseApiError.js';
import { formatDate, getReferenceNumber } from '../../utils/format.js';
import { APPLICATION_STATUS_META } from '../../utils/constants.js';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

function TotalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function PendingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ApprovedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function RejectedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
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

function OfficerDashboard() {
  const { currentUser } = useAuth();
  const [counts, setCounts]           = useState({});
  const [totalApps, setTotalApps]     = useState(0);
  const [recentQueue, setRecentQueue] = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const [queueCounts, pendingData] = await Promise.all([
        getQueueCounts(),
        listQueue({ status: 'submitted', page: 1, limit: 5 }),
      ]);
      setCounts(queueCounts);
      setTotalApps(Object.values(queueCounts).reduce((s, v) => s + v, 0));
      setRecentQueue(pendingData.applications);
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      
      {/* Page Header with Welcome Line and CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            Verification Officer Portal
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Officer: <span className="font-semibold text-text-primary">{currentUser?.fullName || 'Verification Officer'}</span>. Review incoming applicant records, inspect supporting documents, and issue clearance decisions.
          </p>
        </div>

        <Link to="/officer/queue">
          <Button size="md" className="shadow-md">
            <span>Process Review Queue</span>
            <span>→</span>
          </Button>
        </Link>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          <span>{error}</span>{' '}
          <button type="button" onClick={load} className="font-bold underline ml-2">Retry</button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" label="Loading officer statistics…" />
        </div>
      ) : (
        <>
          {/* 5 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              label="Total Applications"
              value={totalApps}
              color="navy"
              icon={TotalIcon}
              caption="Overall received"
            />
            <StatCard
              label="Pending Review"
              value={counts['submitted'] ?? 0}
              color="amber"
              icon={PendingIcon}
              progress={totalApps > 0 ? ((counts['submitted'] ?? 0) / totalApps) * 100 : 0}
            />
            <StatCard
              label="Approved"
              value={counts['approved'] ?? 0}
              color="green"
              icon={ApprovedIcon}
              progress={totalApps > 0 ? ((counts['approved'] ?? 0) / totalApps) * 100 : 0}
            />
            <StatCard
              label="Rejected"
              value={counts['rejected'] ?? 0}
              color="red"
              icon={RejectedIcon}
            />
            <StatCard
              label="Certificates Issued"
              value={counts['certificate_issued'] ?? 0}
              color="navy"
              icon={CertificateIcon}
              caption="Completed issuance"
            />
          </div>

          {/* Pending Applications Review Table */}
          <Card
            title="Awaiting Verification Decision"
            headerRight={
              <Link
                to="/officer/queue"
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline"
              >
                View full queue ({counts['submitted'] ?? 0}) →
              </Link>
            }
          >
            {recentQueue.length === 0 ? (
              <EmptyState
                title="Review queue is clear"
                description="There are no applications currently pending initial review."
              />
            ) : (
              <div className="overflow-x-auto -mx-4 sm:-mx-6">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border-theme bg-card-subtle/50 text-xs font-bold uppercase tracking-wider text-text-muted">
                    <tr>
                      <th scope="col" className="px-6 py-3.5">Reference No.</th>
                      <th scope="col" className="px-6 py-3.5">Applicant Name</th>
                      <th scope="col" className="px-6 py-3.5">Purpose</th>
                      <th scope="col" className="px-6 py-3.5">Submitted</th>
                      <th scope="col" className="px-6 py-3.5">Status</th>
                      <th scope="col" className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-theme">
                    {recentQueue.map((app) => {
                      const meta = APPLICATION_STATUS_META[app.status];
                      const refNo = getReferenceNumber(app.id);
                      const appInitials = (app.applicant_name || 'A')
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase();

                      return (
                        <tr key={app.id} className="hover:bg-card-subtle/40 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-text-primary whitespace-nowrap">
                            {refNo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-bold text-xs">
                                {appInitials}
                              </div>
                              <span className="text-text-primary font-medium">{app.applicant_name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-text-secondary max-w-xs truncate">
                            {app.purpose}
                          </td>
                          <td className="px-6 py-4 text-text-muted whitespace-nowrap">
                            {formatDate(app.submitted_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge label={meta?.label || app.status} badgeClass={meta?.badgeClass} />
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <Link to={`/officer/applications/${app.id}`}>
                              <Button size="sm" className="h-8 px-3.5 text-xs font-semibold">
                                Review Application
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Quick Filters and Activity Overview */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Card title="Quick Queue Filters">
              <div className="space-y-2.5">
                {[
                  { status: 'submitted',    label: 'Pending Initial Review', count: counts['submitted'] ?? 0, bg: 'hover:bg-amber-50 dark:hover:bg-amber-950/30' },
                  { status: 'under_review', label: 'Under Detailed Review',  count: counts['under_review'] ?? 0, bg: 'hover:bg-blue-50 dark:hover:bg-blue-950/30' },
                  { status: 'approved',     label: 'Approved Submissions',   count: counts['approved'] ?? 0, bg: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/30' },
                  { status: 'rejected',     label: 'Rejected Submissions',   count: counts['rejected'] ?? 0, bg: 'hover:bg-red-50 dark:hover:bg-red-950/30' },
                ].map(({ status, label, count, bg }) => (
                  <Link
                    key={status}
                    to={`/officer/queue?status=${status}`}
                    className={`flex items-center justify-between rounded-xl border border-border-theme p-3 text-sm transition-colors ${bg}`}
                  >
                    <span className="font-medium text-text-primary">{label}</span>
                    <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-card-subtle px-2 text-xs font-bold text-text-primary">
                      {count}
                    </span>
                  </Link>
                ))}
              </div>
            </Card>

            <Card title="Review Decisions Breakdown">
              <dl className="space-y-3.5 text-sm">
                {[
                  ['Total Reviewed by Officers', (counts['approved'] ?? 0) + (counts['rejected'] ?? 0)],
                  ['Total Approved',              counts['approved'] ?? 0],
                  ['Total Rejected',              counts['rejected'] ?? 0],
                  ['Certificates Generated',      counts['certificate_issued'] ?? 0],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-border-theme pb-2.5 last:border-0">
                    <dt className="text-text-muted">{label}</dt>
                    <dd className="font-bold text-text-primary">{value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export default OfficerDashboard;
