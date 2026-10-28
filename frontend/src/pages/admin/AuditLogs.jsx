// src/pages/admin/AuditLogs.jsx
// Paginated, filterable view of the system audit log
// (GET /api/admin/audit-logs). Filters: action keyword, entity type,
// date range. Shows actor, action, entity type/id, metadata, date.
// Metadata is displayed as a compact JSON preview expandable via a
// modal for full detail.

import { useEffect, useState, useCallback } from 'react';
import { listAuditLogs } from '../../services/adminService.js';
import { parseApiError } from '../../utils/parseApiError.js';
import { formatDateTime } from '../../utils/format.js';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

const PAGE_SIZE = 20;

const ENTITY_TYPE_OPTIONS = ['', 'user', 'application', 'document', 'certificate'];

function MetadataModal({ log, onClose }) {
  return (
    <Modal isOpen={Boolean(log)} onClose={onClose} title="Audit Entry Detail">
      {log && (
        <dl className="space-y-3 text-sm">
          {[
            ['Actor',       log.actor_name ? `${log.actor_name} (${log.actor_email})` : '—'],
            ['Action',      log.action],
            ['Entity Type', log.entity_type],
            ['Entity ID',   log.entity_id || '—'],
            ['IP Address',  log.ip_address || '—'],
            ['Date',        formatDateTime(log.created_at)],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-medium uppercase text-gray-400">{label}</dt>
              <dd className="break-all text-gray-900">{value}</dd>
            </div>
          ))}
          {log.metadata && (
            <div>
              <dt className="text-xs font-medium uppercase text-gray-400">Metadata</dt>
              <dd>
                <pre className="mt-1 overflow-auto rounded bg-gray-50 p-2 text-xs text-gray-800">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </dd>
            </div>
          )}
        </dl>
      )}
    </Modal>
  );
}

function AuditLogs() {
  const [logs, setLogs]             = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage]             = useState(1);

  // Filter state
  const [actionInput, setActionInput]       = useState('');
  const [actionFilter, setActionFilter]     = useState('');
  const [entityType, setEntityType]         = useState('');
  const [dateFrom, setDateFrom]             = useState('');
  const [dateTo, setDateTo]                 = useState('');

  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const load = useCallback(async (targetPage, filters) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await listAuditLogs({ ...filters, page: targetPage, limit: PAGE_SIZE });
      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const currentFilters = { action: actionFilter || undefined, entityType: entityType || undefined,
                            dateFrom: dateFrom || undefined, dateTo: dateTo || undefined };

  useEffect(() => { load(page, currentFilters); },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [load, page, actionFilter, entityType, dateFrom, dateTo]);

  function handleActionSearch(e) {
    e.preventDefault();
    setPage(1);
    setActionFilter(actionInput.trim().toUpperCase());
  }

  function handleEntityTypeChange(e) { setEntityType(e.target.value); setPage(1); }
  function handleDateFromChange(e)   { setDateFrom(e.target.value);   setPage(1); }
  function handleDateToChange(e)     { setDateTo(e.target.value);     setPage(1); }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">Audit Logs</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <form onSubmit={handleActionSearch} className="flex gap-2">
          <input
            type="text"
            value={actionInput}
            onChange={(e) => setActionInput(e.target.value)}
            placeholder="Filter by action…"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600"
          />
          <Button type="submit" size="sm" variant="outline">Search</Button>
        </form>

        <div>
          <label htmlFor="entityTypeFilter" className="mb-1 block text-xs font-medium text-gray-600">Entity Type</label>
          <select id="entityTypeFilter" value={entityType} onChange={handleEntityTypeChange}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm">
            {ENTITY_TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>{t || 'All Types'}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dateFrom" className="mb-1 block text-xs font-medium text-gray-600">From</label>
          <input id="dateFrom" type="date" value={dateFrom} onChange={handleDateFromChange}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm" />
        </div>

        <div>
          <label htmlFor="dateTo" className="mb-1 block text-xs font-medium text-gray-600">To</label>
          <input id="dateTo" type="date" value={dateTo} onChange={handleDateToChange}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm" />
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error} <button type="button"
            onClick={() => load(page, currentFilters)} className="font-medium underline">Retry</button>
        </div>
      )}

      <Card bodyClassName="p-0">
        {isLoading ? (
          <div className="flex justify-center py-12"><LoadingSpinner size="lg" label="Loading logs…" /></div>
        ) : logs.length === 0 ? (
          <EmptyState icon="📋" message="No audit log entries found." />
        ) : (
          <>
            {/* Table — md+ */}
            <table className="hidden w-full text-left text-sm md:table">
              <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Actor</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Entity</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">{formatDateTime(log.created_at)}</td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900">{log.actor_name || '—'}</p>
                      <p className="text-xs text-gray-500">{log.actor_email || 'anonymous'}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-800">{log.action}</td>
                    <td className="px-4 py-3 text-gray-600">{log.entity_type}</td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" onClick={() => setSelectedLog(log)}
                        className="text-sm font-medium text-primary-700 hover:underline">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Card list — small screens */}
            <div className="divide-y divide-gray-100 md:hidden">
              {logs.map((log) => (
                <button key={log.id} type="button" onClick={() => setSelectedLog(log)}
                  className="block w-full px-4 py-3 text-left hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-800">{log.action}</span>
                    <span className="text-xs text-gray-500">{formatDateTime(log.created_at)}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {log.actor_name || 'anonymous'} · {log.entity_type}
                  </p>
                </button>
              ))}
            </div>

            <Pagination page={pagination.page} totalPages={pagination.totalPages}
              onPageChange={(p) => setPage(p)} />
          </>
        )}
      </Card>

      <MetadataModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}

export default AuditLogs;
