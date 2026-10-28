// src/pages/admin/UserManagement.jsx
// Lists all system users with server-side role/status filters,
// a name/email search, and pagination. Each row links to
// UserDetails.jsx. Activate/deactivate actions are available
// inline via a confirmation dialog.

import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { listUsers, activateUser, deactivateUser } from '../../services/adminService.js';
import { parseApiError } from '../../utils/parseApiError.js';
import { formatDate } from '../../utils/format.js';
import { USER_STATUS_META, ROLE_LABELS } from '../../utils/constants.js';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

const PAGE_SIZE = 15;
const ROLE_OPTIONS   = ['', 'applicant', 'officer', 'admin'];
const STATUS_OPTIONS = ['', 'active', 'suspended', 'deactivated'];

// Confirmation dialog for activate / deactivate.
function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel, isSubmitting }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button variant="primary" onClick={onConfirm} isLoading={isSubmitting}>{confirmLabel}</Button>
        </>
      }
    >
      <p className="text-sm text-gray-600">{message}</p>
    </Modal>
  );
}

function UserManagement() {
  const [users, setUsers]           = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage]             = useState(1);
  const [roleFilter, setRoleFilter]     = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch]         = useState('');
  const [searchInput, setSearchInput]   = useState('');
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState('');
  const [actionError, setActionError]   = useState('');

  // Confirm dialog state
  const [confirmTarget, setConfirmTarget] = useState(null); // { user, action: 'activate'|'deactivate' }
  const [isActioning, setIsActioning]   = useState(false);

  const load = useCallback(async (targetPage, role, status, s) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await listUsers({ role: role || undefined, status: status || undefined,
                                     search: s || undefined, page: targetPage, limit: PAGE_SIZE });
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(page, roleFilter, statusFilter, search); },
    [load, page, roleFilter, statusFilter, search]);

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  }

  function handleRoleChange(e)   { setRoleFilter(e.target.value);   setPage(1); }
  function handleStatusChange(e) { setStatusFilter(e.target.value); setPage(1); }

  async function handleConfirmAction() {
    if (!confirmTarget) return;
    setIsActioning(true);
    setActionError('');
    try {
      const fn = confirmTarget.action === 'activate' ? activateUser : deactivateUser;
      const updated = await fn(confirmTarget.user.id);
      // Update the row in place so there's no full reload flash.
      setUsers((prev) => prev.map((u) => u.id === updated.id ? updated : u));
      setConfirmTarget(null);
    } catch (err) {
      setActionError(parseApiError(err).message);
      setConfirmTarget(null);
    } finally {
      setIsActioning(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">User Management</h1>
        <Link to="/admin/users/new-officer">
          <Button size="sm">+ New Officer</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name or email…"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          />
          <Button type="submit" size="sm" variant="outline">Search</Button>
        </form>

        <div>
          <label htmlFor="roleFilter" className="mb-1 block text-xs font-medium text-gray-600">Role</label>
          <select id="roleFilter" value={roleFilter} onChange={handleRoleChange}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm">
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>{r ? ROLE_LABELS[r] : 'All Roles'}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="statusFilter" className="mb-1 block text-xs font-medium text-gray-600">Status</label>
          <select id="statusFilter" value={statusFilter} onChange={handleStatusChange}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm">
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s ? USER_STATUS_META[s]?.label : 'All Statuses'}</option>
            ))}
          </select>
        </div>
      </div>

      {(error || actionError) && (
        <div role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error || actionError}
        </div>
      )}

      <Card bodyClassName="p-0">
        {isLoading ? (
          <div className="flex justify-center py-12"><LoadingSpinner size="lg" label="Loading users…" /></div>
        ) : users.length === 0 ? (
          <EmptyState icon="👥" message="No users found." />
        ) : (
          <>
            {/* Table — md+ */}
            <table className="hidden w-full text-left text-sm md:table">
              <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => {
                  const statusMeta = USER_STATUS_META[user.status];
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{user.full_name}</td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3 text-gray-600 capitalize">{ROLE_LABELS[user.role] || user.role}</td>
                      <td className="px-4 py-3">
                        <StatusBadge label={statusMeta?.label || user.status} badgeClass={statusMeta?.badgeClass} />
                      </td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(user.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-3">
                          <Link to={`/admin/users/${user.id}`}
                            className="text-sm font-medium text-primary-700 hover:underline">
                            View
                          </Link>
                          {user.status === 'active' ? (
                            <button type="button"
                              onClick={() => setConfirmTarget({ user, action: 'deactivate' })}
                              className="text-sm font-medium text-red-600 hover:underline">
                              Deactivate
                            </button>
                          ) : (
                            <button type="button"
                              onClick={() => setConfirmTarget({ user, action: 'activate' })}
                              className="text-sm font-medium text-secondary-700 hover:underline">
                              Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Card list — small screens */}
            <div className="divide-y divide-gray-100 md:hidden">
              {users.map((user) => {
                const statusMeta = USER_STATUS_META[user.status];
                return (
                  <div key={user.id} className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <Link to={`/admin/users/${user.id}`}
                        className="font-medium text-gray-900 hover:underline">{user.full_name}</Link>
                      <StatusBadge label={statusMeta?.label || user.status} badgeClass={statusMeta?.badgeClass} />
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">{user.email} · {ROLE_LABELS[user.role] || user.role}</p>
                    <div className="mt-1 flex gap-3 text-xs">
                      {user.status === 'active' ? (
                        <button type="button" onClick={() => setConfirmTarget({ user, action: 'deactivate' })}
                          className="font-medium text-red-600 hover:underline">Deactivate</button>
                      ) : (
                        <button type="button" onClick={() => setConfirmTarget({ user, action: 'activate' })}
                          className="font-medium text-secondary-700 hover:underline">Activate</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <Pagination page={pagination.page} totalPages={pagination.totalPages}
              onPageChange={(p) => setPage(p)} />
          </>
        )}
      </Card>

      <ConfirmDialog
        isOpen={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        onConfirm={handleConfirmAction}
        isSubmitting={isActioning}
        title={confirmTarget?.action === 'activate' ? 'Activate User' : 'Deactivate User'}
        message={
          confirmTarget?.action === 'activate'
            ? `Activate "${confirmTarget?.user?.full_name}"? They will be able to log in again.`
            : `Deactivate "${confirmTarget?.user?.full_name}"? They will no longer be able to log in.`
        }
        confirmLabel={confirmTarget?.action === 'activate' ? 'Activate' : 'Deactivate'}
      />
    </div>
  );
}

export default UserManagement;
