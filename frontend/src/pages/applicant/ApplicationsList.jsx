// src/pages/applicant/ApplicationsList.jsx
// Lists all of the logged-in applicant's certificate applications
// (GET /api/applicant/applications), paginated. Each row shows the
// (derived) reference number, submission date, current status, and
// last-updated date, per Module 3 requirement #8.

import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { listApplications } from '../../services/applicantService.js';
import { parseApiError } from '../../utils/parseApiError.js';
import { formatDate, getReferenceNumber } from '../../utils/format.js';
import { APPLICATION_STATUS_META } from '../../utils/constants.js';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import Pagination from '../../components/ui/Pagination.jsx';

const PAGE_SIZE = 10;

function ApplicationsList() {
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (targetPage) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await listApplications({ page: targetPage, limit: PAGE_SIZE });
      setApplications(data.applications);
      setPagination(data.pagination);
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [load, page]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">My Applications</h1>
        <Link to="/applicant/applications/new">
          <Button>New Application</Button>
        </Link>
      </div>

      {error && (
        <div role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}{' '}
          <button type="button" onClick={() => load(page)} className="font-medium underline">
            Retry
          </button>
        </div>
      )}

      <Card bodyClassName="p-0">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" label="Loading applications…" />
          </div>
        ) : applications.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-gray-500">
            You haven't submitted any applications yet.{' '}
            <Link to="/applicant/applications/new" className="font-medium text-primary-700 hover:underline">
              Start your first application
            </Link>
            .
          </p>
        ) : (
          <>
            {/* Table on md+ screens */}
            <table className="hidden w-full text-left text-sm md:table">
              <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Reference Number</th>
                  <th className="px-4 py-3 font-medium">Submitted</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Last Updated</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((application) => {
                  const meta = APPLICATION_STATUS_META[application.status];
                  return (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{getReferenceNumber(application.id)}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(application.submitted_at)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge label={meta?.label || application.status} badgeClass={meta?.badgeClass} />
                      </td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(application.updated_at)}</td>
                      <td className="px-4 py-3 text-right">
                        <Link to={`/applicant/applications/${application.id}`} className="font-medium text-primary-700 hover:underline">
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Card list on small screens */}
            <div className="divide-y divide-gray-100 md:hidden">
              {applications.map((application) => {
                const meta = APPLICATION_STATUS_META[application.status];
                return (
                  <Link
                    key={application.id}
                    to={`/applicant/applications/${application.id}`}
                    className="block px-4 py-3 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{getReferenceNumber(application.id)}</span>
                      <StatusBadge label={meta?.label || application.status} badgeClass={meta?.badgeClass} />
                    </div>
                    <div className="mt-1 flex justify-between text-xs text-gray-500">
                      <span>Submitted {formatDate(application.submitted_at)}</span>
                      <span>Updated {formatDate(application.updated_at)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
          </>
        )}
      </Card>
    </div>
  );
}

export default ApplicationsList;
