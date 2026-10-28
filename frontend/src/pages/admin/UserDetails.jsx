// src/pages/admin/UserDetails.jsx
// Displays full details for one user. Because the backend admin
// module has no GET /admin/users/:id endpoint (see adminService.js),
// this page fetches the user by calling listUsers and finding the
// matching record client-side. All backend-returned fields are shown:
// full name, email, phone, national_id_number, role, status, dates.
// Activate/deactivate actions are available here too.

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserById, activateUser, deactivateUser } from '../../services/adminService.js';
import { parseApiError } from '../../utils/parseApiError.js';
import { formatDate, formatDateTime } from '../../utils/format.js';
import { USER_STATUS_META, ROLE_LABELS } from '../../utils/constants.js';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';

function UserDetails() {
  const { id } = useParams();

  const [user, setUser]             = useState(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState('');
  const [notFound, setNotFound]     = useState(false);

  const [showConfirm, setShowConfirm]   = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // 'activate' | 'deactivate'
  const [isActioning, setIsActioning]   = useState(false);
  const [actionError, setActionError]   = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setNotFound(false);
    try {
      const found = await getUserById(id);
      if (!found) { setNotFound(true); }
      else { setUser(found); }
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function handleAction() {
    setIsActioning(true);
    setActionError('');
    setActionSuccess('');
    try {
      const fn = pendingAction === 'activate' ? activateUser : deactivateUser;
      const updated = await fn(id);
      setUser(updated);
      setActionSuccess(pendingAction === 'activate' ? 'User activated.' : 'User deactivated.');
    } catch (err) {
      setActionError(parseApiError(err).message);
    } finally {
      setIsActioning(false);
      setShowConfirm(false);
      setPendingAction(null);
    }
  }

  if (isLoading) {
    return <div className="flex justify-center py-16"><LoadingSpinner size="lg" label="Loading user…" /></div>;
  }
  if (notFound) {
    return (
      <Card>
        <p className="text-sm text-gray-600">User not found.</p>
        <Link to="/admin/users" className="mt-3 inline-block text-sm font-medium text-primary-700 hover:underline">
          ← Back to Users
        </Link>
      </Card>
    );
  }
  if (error) {
    return (
      <div role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
        {error} <button type="button" onClick={load} className="font-medium underline">Retry</button>
      </div>
    );
  }

  const statusMeta = USER_STATUS_META[user.status];

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Link to="/admin/users" className="text-sm font-medium text-primary-700 hover:underline">
        ← Back to Users
      </Link>

      {actionError   && <div role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{actionError}</div>}
      {actionSuccess && <div className="rounded-md bg-secondary-50 px-3 py-2 text-sm text-secondary-800">{actionSuccess}</div>}

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{user.full_name}</h1>
            <p className="text-sm text-gray-600 capitalize">{ROLE_LABELS[user.role] || user.role}</p>
          </div>
          <StatusBadge label={statusMeta?.label || user.status} badgeClass={statusMeta?.badgeClass} />
        </div>

        <dl className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 text-sm sm:grid-cols-2">
          {[
            ['Email',             user.email],
            ['Phone Number',      user.phone_number || '—'],
            ['National ID',       user.national_id_number || '—'],
            ['Account Created',   formatDateTime(user.created_at)],
            ['Last Updated',      formatDateTime(user.updated_at)],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-medium uppercase text-gray-400">{label}</dt>
              <dd className="text-gray-900">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex gap-3 border-t border-gray-100 pt-4">
          {user.status === 'active' ? (
            <Button variant="danger" size="sm"
              onClick={() => { setPendingAction('deactivate'); setShowConfirm(true); }}>
              Deactivate Account
            </Button>
          ) : (
            <Button variant="secondary" size="sm"
              onClick={() => { setPendingAction('activate'); setShowConfirm(true); }}>
              Activate Account
            </Button>
          )}
        </div>
      </Card>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title={pendingAction === 'activate' ? 'Activate User' : 'Deactivate User'}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowConfirm(false)} disabled={isActioning}>Cancel</Button>
            <Button variant="primary" onClick={handleAction} isLoading={isActioning}>Confirm</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          {pendingAction === 'activate'
            ? `Activate "${user.full_name}"? They will be able to log in again.`
            : `Deactivate "${user.full_name}"? They will lose access immediately.`}
        </p>
      </Modal>
    </div>
  );
}

export default UserDetails;
