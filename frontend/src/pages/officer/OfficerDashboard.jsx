// src/pages/officer/OfficerDashboard.jsx
// Officer dashboard (Module 4 + Module 7 Feature 7).
// Module 8: simplified to use getQueueCounts() from officerService
// instead of duplicating that logic inline.

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

const STATUS_TILES = [
  { status: 'submitted',          label: 'Pending Review',      accentClass: 'text-yellow-600' },
  { status: 'approved',           label: 'Approved',            accentClass: 'text-secondary-700' },
  { status: 'rejected',           label: 'Rejected',            accentClass: 'text-red-600' },
  { status: 'certificate_issued', label: 'Certificates Issued', accentClass: 'text-primary-700' },
];

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Officer Dashboard{currentUser?.fullName ? ` — ${currentUser.fullName}` : ''}
          </h1>
          <p className="text-sm text-gray-600">Review submitted applications and issue decisions.</p>
        </div>
        <Link to="/officer/queue">
          <Button>Review Queue</Button>
        </Link>
      </div>

      {error && (
        <div role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}{' '}
          <button type="button" onClick={load} className="font-medium underline">Retry</button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" label="Loading dashboard…" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard label="Total Applications" value={totalApps} />
            {STATUS_TILES.map(({ status, label, accentClass }) => (
              <StatCard key={status} label={label} value={counts[status] ?? 0} accentClass={accentClass} />
            ))}
          </div>

          <Card title="Pending Review">
            {recentQueue.length === 0 ? (
              <EmptyState icon="✅" message="No applications are currently awaiting review." />
            ) : (
              <>
                <div className="divide-y divide-gray-100">
                  {recentQueue.map((app) => {
                    const meta = APPLICATION_STATUS_META[app.status];
                    return (
                      <Link
                        key={app.id}
                        to={`/officer/applications/${app.id}`}
                        className="flex flex-wrap items-center justify-between gap-2 py-3 hover:bg-gray-50"
                        aria-label={`Review application ${getReferenceNumber(app.id)} from ${app.applicant_name}`}
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">{getReferenceNumber(app.id)}</p>
                          <p className="text-xs text-gray-500">{app.applicant_name} · {app.purpose}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">{formatDate(app.submitted_at)}</span>
                          <StatusBadge label={meta?.label || app.status} badgeClass={meta?.badgeClass} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <div className="mt-3 text-right">
                  <Link to="/officer/queue" className="text-sm font-medium text-primary-700 hover:underline">
                    View full queue →
                  </Link>
                </div>
              </>
            )}
          </Card>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card title="Quick Actions">
              <div className="space-y-2">
                {[
                  { status: 'submitted',    icon: '📥', label: 'Submitted applications', bg: 'bg-blue-50 text-blue-800 hover:bg-blue-100' },
                  { status: 'under_review', icon: '🔍', label: 'Under review',           bg: 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100' },
                  { status: 'approved',     icon: '✅', label: 'Recently approved',      bg: 'bg-secondary-50 text-secondary-800 hover:bg-secondary-100' },
                ].map(({ status, icon, label, bg }) => (
                  <Link key={status} to={`/officer/queue?status=${status}`}
                    className={`flex items-center justify-between rounded-md px-3 py-2 text-sm ${bg}`}
                    aria-label={`View ${label}`}>
                    <span>{icon} {label}</span>
                    <span className="font-bold">{counts[status] ?? 0}</span>
                  </Link>
                ))}
              </div>
            </Card>

            <Card title="Review Summary">
              <dl className="space-y-3 text-sm">
                {[
                  ['Total reviewed',   (counts['approved'] ?? 0) + (counts['rejected'] ?? 0)],
                  ['Approved',          counts['approved'] ?? 0],
                  ['Rejected',          counts['rejected'] ?? 0],
                  ['Certificates out',  counts['certificate_issued'] ?? 0],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-gray-100 pb-2 last:border-0">
                    <dt className="text-gray-600">{label}</dt>
                    <dd className="font-semibold text-gray-900">{value}</dd>
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
