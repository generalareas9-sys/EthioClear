// src/pages/applicant/ApplicantDashboard.jsx
// Upgraded Applicant Dashboard matching Figma reference design:
// - Title & Welcome line
// - Info Banner ("Application ECL-... is under review", light blue alert style)
// - Stat Cards with real counts and distinct colors (navy, amber, green, red, indigo)
// - Table of recent applications with applicant avatar circle, mono ID, colored status pill, and "Review" action
// - Quick Action cards

import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { listApplications } from '../../services/applicantService.js';
import { parseApiError } from '../../utils/parseApiError.js';
import { formatDate, getReferenceNumber } from '../../utils/format.js';
import { APPLICATION_STATUS_META } from '../../utils/constants.js';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

// SVG Icons for StatCards
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

const RECENT_COUNT = 5;
const STATS_FETCH_LIMIT = 100;

function ApplicantDashboard() {
  const { currentUser } = useAuth();

  const [applications, setApplications] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const { applications: items, pagination } = await listApplications({ page: 1, limit: STATS_FETCH_LIMIT });
      setApplications(items);
      setTotal(pagination.total);
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const pendingCount = applications.filter((a) => a.status === 'submitted' || a.status === 'under_review').length;
  const approvedCount = applications.filter((a) => a.status === 'approved').length;
  const rejectedCount = applications.filter((a) => a.status === 'rejected').length;
  const issuedCount = applications.filter((a) => a.status === 'certificate_issued').length;
  const recentApplications = applications.slice(0, RECENT_COUNT);

  // Active review item for Figma banner
  const activeReviewApp = applications.find((a) => a.status === 'under_review' || a.status === 'submitted');

  const initials = (currentUser?.fullName || currentUser?.email || 'U')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="space-y-6">
      
      {/* Page Header with Welcome Line and CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            Applicant Dashboard
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Welcome back, <span className="font-semibold text-text-primary">{currentUser?.fullName || 'Applicant'}</span>. Manage and track your certificate applications in real time.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/applicant/applications/new">
            <Button size="md" className="shadow-md">
              <span className="text-base font-bold">+</span>
              <span>New Application</span>
            </Button>
          </Link>
          <Link to="/verify">
            <Button variant="outline" size="md">
              My Certificate
            </Button>
          </Link>
        </div>
      </div>

      {/* Info Alert Banner matching Figma style */}
      {activeReviewApp && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-blue-200 bg-blue-50/80 dark:border-blue-800/60 dark:bg-blue-950/40 p-4 shadow-sm animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                Application <span className="font-mono">{getReferenceNumber(activeReviewApp.id)}</span> is currently {activeReviewApp.status === 'under_review' ? 'under officer review' : 'submitted and awaiting review'}.
              </p>
              <p className="text-xs text-blue-700/80 dark:text-blue-300/80">
                Purpose: {activeReviewApp.purpose} • Submitted on {formatDate(activeReviewApp.submitted_at)}
              </p>
            </div>
          </div>
          <Link
            to={`/applicant/applications/${activeReviewApp.id}`}
            className="shrink-0 text-xs font-bold text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:underline"
          >
            Track Status →
          </Link>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          <span>{error}</span>{' '}
          <button type="button" onClick={loadDashboard} className="font-bold underline ml-2">
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" label="Loading dashboard data..." />
        </div>
      ) : (
        <>
          {/* Stat Cards Grid (Responsive: 1 col on mobile, 2 on tablet, 5 on desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              label="Total Applications"
              value={total}
              color="navy"
              icon={TotalIcon}
              caption="Lifetime submissions"
            />
            <StatCard
              label="Pending Review"
              value={pendingCount}
              color="amber"
              icon={PendingIcon}
              progress={total > 0 ? (pendingCount / total) * 100 : 0}
            />
            <StatCard
              label="Approved"
              value={approvedCount}
              color="green"
              icon={ApprovedIcon}
              progress={total > 0 ? (approvedCount / total) * 100 : 0}
            />
            <StatCard
              label="Rejected"
              value={rejectedCount}
              color="red"
              icon={RejectedIcon}
            />
            <StatCard
              label="Certificates Issued"
              value={issuedCount}
              color="navy"
              icon={CertificateIcon}
              caption="Ready for download"
            />
          </div>

          {/* Recent Applications Card with Table */}
          <Card
            title="Recent Applications"
            headerRight={
              applications.length > 0 && (
                <Link
                  to="/applicant/applications"
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline"
                >
                  View all applications →
                </Link>
              )
            }
          >
            {recentApplications.length === 0 ? (
              <EmptyState
                title="No applications yet"
                description="You haven't submitted any criminal record certificate applications."
                action={
                  <Link to="/applicant/applications/new">
                    <Button size="sm">Start your first application</Button>
                  </Link>
                }
              />
            ) : (
              <div className="overflow-x-auto -mx-4 sm:-mx-6">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border-theme bg-card-subtle/50 text-xs font-bold uppercase tracking-wider text-text-muted">
                    <tr>
                      <th scope="col" className="px-6 py-3.5">Reference No.</th>
                      <th scope="col" className="px-6 py-3.5">Applicant</th>
                      <th scope="col" className="px-6 py-3.5">Purpose</th>
                      <th scope="col" className="px-6 py-3.5">Submitted Date</th>
                      <th scope="col" className="px-6 py-3.5">Status</th>
                      <th scope="col" className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-theme">
                    {recentApplications.map((app) => {
                      const meta = APPLICATION_STATUS_META[app.status];
                      const refNo = getReferenceNumber(app.id);

                      return (
                        <tr key={app.id} className="hover:bg-card-subtle/40 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-text-primary whitespace-nowrap">
                            {refNo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 font-bold text-xs">
                                {initials}
                              </div>
                              <span className="text-text-primary font-medium">{currentUser?.fullName || 'Applicant'}</span>
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
                            <Link to={`/applicant/applications/${app.id}`}>
                              <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                                Review Details
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
        </>
      )}
    </div>
  );
}

export default ApplicantDashboard;
