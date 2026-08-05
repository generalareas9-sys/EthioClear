// src/pages/officer/ApplicationsQueue.jsx
// Paginated applications queue (frontend Module 4). The Status filter
// is a real server-side query (the backend's GET /officer/applications
// only supports one status per request — see officerService.js).
//
// Date, applicant-name, and reference-number filters are NOT
// supported by the backend at all (no such query params exist on
// GET /officer/applications — see backend officer.routes.js). Rather
// than silently omit them, they're implemented here as client-side
// filters applied to the currently-fetched page of results, clearly
// labeled as such in the UI. This keeps the feature honest: a search
// term only narrows what's already loaded, it doesn't reach further
// pages until you page into them.

import { useEffect, useState, useCallback, useMemo } from 'react';
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

const PAGE_SIZE = 10;

function ApplicationsQueue() {
  const [status, setStatus] = useState('submitted');
  const [page, setPage] = useState(1);
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Client-side-only filters (see file header note).
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const load = useCallback(async (targetStatus, targetPage) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await listQueue({ status: targetStatus, page: targetPage, limit: PAGE_SIZE });
      setApplications(data.applications);
      setPagination(data.pagination);
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load(status, page);
  }, [load, status, page]);

  function handleStatusChange(newStatus) {
    setStatus(newStatus);
    setPage(1); // status is a real server-side filter — always restart at page 1
  }

  const visibleApplications = useMemo(() => {
    return applications.filter((application) => {
      if (search) {
        const term = search.trim().toLowerCase();
        const matchesName = application.applicant_name?.toLowerCase().includes(term);
        const matchesReference = getReferenceNumber(application.id).toLowerCase().includes(term);
        if (!matchesName && !matchesReference) return false;
      }
      if (dateFilter) {
        const submittedDate = application.submitted_at?.slice(0, 10); // YYYY-MM-DD
        if (submittedDate !== dateFilter) return false;
      }
      return true;
    });
  }, [applications, search, dateFilter]);

  const hasClientFilter = Boolean(search || dateFilter);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">Application Review Queue</h1>

      <Card>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div>
            <label htmlFor="statusFilter" className="mb-1 block text-xs font-medium uppercase text-gray-500">
              Status
            </label>
            <select
              id="statusFilter"
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              {OFFICER_QUEUE_STATUS_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {APPLICATION_STATUS_META[value]?.label || value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dateFilter" className="mb-1 block text-xs font-medium uppercase text-gray-500">
              Submission Date
            </label>
            <input
              id="dateFilter"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="searchFilter" className="mb-1 block text-xs font-medium uppercase text-gray-500">
              Search (applicant name or reference number)
            </label>
            <input
              id="searchFilter"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. Hana Worku or APP-B0000000"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm"
            />
          </div>
        </div>

        {hasClientFilter && (
          <p className="mt-2 text-xs text-gray-400">
            Date and search filters apply only to the applications currently loaded on this page — page through
            results to search further.
          </p>
        )}
      </Card>

      {error && (
        <div role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}{' '}
          <button type="button" onClick={() => load(status, page)} className="font-medium underline">
            Retry
          </button>
        </div>
      )}

      <Card bodyClassName="p-0">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" label="Loading queue…" />
          </div>
        ) : visibleApplications.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-gray-500">
            {applications.length === 0
              ? `No applications with status "${APPLICATION_STATUS_META[status]?.label || status}".`
              : 'No applications on this page match your filters.'}
          </p>
        ) : (
          <>
            <table className="hidden w-full text-left text-sm md:table">
              <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Reference Number</th>
                  <th className="px-4 py-3 font-medium">Applicant</th>
                  <th className="px-4 py-3 font-medium">Purpose</th>
                  <th className="px-4 py-3 font-medium">Submitted</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visibleApplications.map((application) => {
                  const meta = APPLICATION_STATUS_META[application.status];
                  return (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{getReferenceNumber(application.id)}</td>
                      <td className="px-4 py-3 text-gray-700">{application.applicant_name}</td>
                      <td className="px-4 py-3 text-gray-600">{application.purpose}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(application.submitted_at)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge label={meta?.label || application.status} badgeClass={meta?.badgeClass} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link to={`/officer/applications/${application.id}`}>
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="divide-y divide-gray-100 md:hidden">
              {visibleApplications.map((application) => {
                const meta = APPLICATION_STATUS_META[application.status];
                return (
                  <div key={application.id} className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{getReferenceNumber(application.id)}</span>
                      <StatusBadge label={meta?.label || application.status} badgeClass={meta?.badgeClass} />
                    </div>
                    <p className="mt-1 text-xs text-gray-600">{application.applicant_name} · {application.purpose}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">{formatDate(application.submitted_at)}</span>
                      <Link to={`/officer/applications/${application.id}`}>
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {!hasClientFilter && (
              <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
            )}
          </>
        )}
      </Card>
    </div>
  );
}

export default ApplicationsQueue;
