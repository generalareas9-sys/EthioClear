// src/pages/officer/ApplicationQueue.jsx
// Paginated, filterable list of all applications visible to the
// officer role (GET /api/officer/applications). Filters supported:
//   - status (dropdown)
//   - dateFrom / dateTo (date inputs)
//   - search (client-side name/reference filter on the current page,
//     since the backend queue endpoint has no free-text search param)

import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { listQueue } from '../../services/officerService.js';
import { parseApiError } from '../../utils/parseApiError.js';
import { formatDate, getReferenceNumber } from '../../utils/format.js';
import { APPLICATION_STATUS_META, OFFICER_QUEUE_STATUS_OPTIONS } from '../../utils/constants.js';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import Pagination from '../../components/ui/Pagination.jsx';

const PAGE_SIZE = 15;
const DEFAULT_STATUS = 'submitted';

function ApplicationQueue() {
  const [applications, setApplications]   = useState([]);
  const [pagination, setPagination]       = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage]                   = useState(1);
  const [filterStatus, setFilterStatus]   = useState(DEFAULT_STATUS);
  const [search, setSearch]               = useState('');
  const [isLoading, setIsLoading]         = useState(true);
  const [error, setError]                 = useState('');

  const load = useCallback(async (targetPage, status) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await listQueue({ status, page: targetPage, limit: PAGE_SIZE });
      setApplications(data.applications);
      setPagination(data.pagination);
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page, filterStatus);
  }, [load, page, filterStatus]);

  function handleStatusChange(e) {
    setFilterStatus(e.target.value);
    setPage(1);
    setSearch('');
  }

  function handlePageChange(newPage) {
    setPage(newPage);
    setSearch('');
  }

  // Client-side search over the current page.
  const searchLower = search.toLowerCase().trim();
  const displayed = searchLower
    ? applications.filter(
        (app) =>
          app.applicant_name?.toLowerCase().includes(searchLower) ||
          getReferenceNumber(app.id).toLowerCase().includes(searchLower) ||
          app.applicant_email?.toLowerCase().includes(searchLower)
      )
    : applications;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">Application Review Queue</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div>
          <label htmlFor="filterStatus" className="mb-1 block text-xs font-medium text-gray-600">Status</label>
          <select
            id="filterStatus"
            value={filterStatus}
            onChange={handleStatusChange}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            {OFFICER_QUEUE_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{APPLICATION_STATUS_META[s]?.label || s}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="queueSearch" className="mb-1 block text-xs font-medium text-gray-600">
            Search (name / reference)
          </label>
          <input
            id="queueSearch"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search current page…"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          />
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}{' '}
          <button type="button" onClick={() => load(page, filterStatus)} className="font-medium underline">
            Retry
          </button>
        </div>
      )}

      <Card bodyClassName="p-0">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" label="Loading queue…" />
          </div>
        ) : displayed.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-gray-500">
            {searchLower ? 'No results match your search.' : 'No applications found for this status.'}
          </p>
        ) : (
          <>
            {/* Table — md+ screens */}
            <table className="hidden w-full text-left text-sm md:table">
              <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 font-medium">Applicant</th>
                  <th className="px-4 py-3 font-medium">Purpose</th>
                  <th className="px-4 py-3 font-medium">Submitted</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayed.map((app) => {
                  const meta = APPLICATION_STATUS_META[app.status];
                  return (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{getReferenceNumber(app.id)}</td>
                      <td className="px-4 py-3">
                        <p className="text-gray-900">{app.applicant_name}</p>
                        <p className="text-xs text-gray-500">{app.applicant_email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{app.purpose}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(app.submitted_at)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge label={meta?.label || app.status} badgeClass={meta?.badgeClass} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/officer/applications/${app.id}`}
                          className="font-medium text-primary-700 hover:underline"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Card list — small screens */}
            <div className="divide-y divide-gray-100 md:hidden">
              {displayed.map((app) => {
                const meta = APPLICATION_STATUS_META[app.status];
                return (
                  <Link
                    key={app.id}
                    to={`/officer/applications/${app.id}`}
                    className="block px-4 py-3 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{getReferenceNumber(app.id)}</span>
                      <StatusBadge label={meta?.label || app.status} badgeClass={meta?.badgeClass} />
                    </div>
                    <p className="mt-0.5 text-sm text-gray-700">{app.applicant_name}</p>
                    <p className="text-xs text-gray-500">{app.purpose} · {formatDate(app.submitted_at)}</p>
                  </Link>
                );
              })}
            </div>

            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </Card>
    </div>
  );
}

export default ApplicationQueue;
