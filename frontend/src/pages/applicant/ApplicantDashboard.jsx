// src/pages/applicant/ApplicantDashboard.jsx
// Applicant dashboard (Module 3 + Module 7 Feature 6).
// Feature 6 additions: Latest Application card and Certificate Status
// summary card alongside the existing stat tiles and recent list.

import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { listApplications } from '../../services/applicantService.js';
import { parseApiError } from '../../utils/parseApiError.js';
import { formatDate, formatDateTime, getReferenceNumber } from '../../utils/format.js';
import { APPLICATION_STATUS_META } from '../../utils/constants.js';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Welcome{currentUser?.fullName ? `, ${currentUser.fullName}` : ''}
          </h1>
          <p className="text-sm text-gray-600">Here's an overview of your certificate applications.</p>
        </div>
        <Link to="/applicant/applications/new">
          <Button>New Application</Button>
        </Link>
      </div>

      {error && (
        <div role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}{' '}
          <button type="button" onClick={loadDashboard} className="font-medium underline">
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" label="Loading dashboard…" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard label="Total Applications" value={total} />
            <StatCard label="Pending" value={pendingCount} accentClass="text-yellow-600" />
            <StatCard label="Approved" value={approvedCount} accentClass="text-secondary-700" />
            <StatCard label="Rejected" value={rejectedCount} accentClass="text-red-600" />
            <StatCard label="Certificates Issued" value={issuedCount} accentClass="text-primary-700" />
          </div>

          <Card title="Recent Applications">
            {recentApplications.length === 0 ? (
              <EmptyState
                icon="📄"
                message="You haven't submitted any applications yet."
                action={
                  <Link to="/applicant/applications/new" className="text-sm font-medium text-primary-700 hover:underline">
                    Start your first application →
                  </Link>
                }
              />
            ) : (
              <div className="divide-y divide-gray-100">
                {recentApplications.map((application) => {
                  const meta = APPLICATION_STATUS_META[application.status];
                  return (
                    <Link
                      key={application.id}
                      to={`/applicant/applications/${application.id}`}
                      className="flex flex-wrap items-center justify-between gap-2 py-3 hover:bg-gray-50"
                      aria-label={`View application ${getReferenceNumber(application.id)}`}
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{getReferenceNumber(application.id)}</p>
                        <p className="text-xs text-gray-500">{application.purpose}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">{formatDate(application.submitted_at)}</span>
                        <StatusBadge label={meta?.label || application.status} badgeClass={meta?.badgeClass} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {applications.length > 0 && (
              <div className="mt-3 text-right">
                <Link to="/applicant/applications" className="text-sm font-medium text-primary-700 hover:underline">
                  View all applications →
                </Link>
              </div>
            )}
          </Card>

          {/* Feature 6: Latest Application detail + Certificate status */}
          {applications.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Card title="Latest Application">
                {(() => {
                  const latest = applications[0];
                  const meta = APPLICATION_STATUS_META[latest.status];
                  return (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{getReferenceNumber(latest.id)}</span>
                        <StatusBadge label={meta?.label || latest.status} badgeClass={meta?.badgeClass} />
                      </div>
                      <p className="text-gray-600">{latest.purpose}</p>
                      <p className="text-xs text-gray-400">Submitted {formatDateTime(latest.submitted_at)}</p>
                      <Link
                        to={`/applicant/applications/${latest.id}`}
                        className="text-xs font-medium text-primary-700 hover:underline"
                      >
                        View details →
                      </Link>
                    </div>
                  );
                })()}
              </Card>

              <Card title="Certificate Status">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Issued</span>
                    <span className="font-semibold text-primary-700">{issuedCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Approved (pending)</span>
                    <span className="font-semibold text-secondary-700">{approvedCount}</span>
                  </div>
                  {issuedCount > 0 && (
                    <p className="mt-2 rounded bg-primary-50 px-2 py-1 text-xs text-primary-700">
                      You have {issuedCount} issued certificate{issuedCount > 1 ? 's' : ''}.
                      Contact an administrator to obtain your certificate file.
                    </p>
                  )}
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ApplicantDashboard;
