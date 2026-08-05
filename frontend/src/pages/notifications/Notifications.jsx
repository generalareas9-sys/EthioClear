// src/pages/notifications/Notifications.jsx
// Notifications page (Feature 3 of Module 7).
// Calls /api/notifications, /api/notifications/:id/read, and
// /api/notifications/read-all. These routes do not exist in the
// backend (Modules 1–8 only built a notifications table and seed
// data; no router was created). The page detects 404 and shows a
// clear "not yet available" message — no broken UI.

import { useEffect, useState, useCallback } from 'react';
import { listNotifications, markOneRead, markAllRead } from '../../services/notificationService.js';
import { parseApiError } from '../../utils/parseApiError.js';
import { formatDateTime } from '../../utils/format.js';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

const PAGE_SIZE = 20;

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination]       = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage]                   = useState(1);
  const [isLoading, setIsLoading]         = useState(true);
  const [error, setError]                 = useState('');
  const [notAvailable, setNotAvailable]   = useState(false);
  const [isMarkingAll, setIsMarkingAll]   = useState(false);

  const load = useCallback(async (targetPage) => {
    setIsLoading(true);
    setError('');
    setNotAvailable(false);
    try {
      const data = await listNotifications({ page: targetPage, limit: PAGE_SIZE });
      setNotifications(data.notifications);
      setPagination(data.pagination);
    } catch (err) {
      if (err?.response?.status === 404) {
        setNotAvailable(true);
      } else {
        setError(parseApiError(err).message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(page); }, [load, page]);

  async function handleMarkOne(id) {
    try {
      await markOneRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch {
      // Silently ignore if the endpoint isn't available.
    }
  }

  async function handleMarkAll() {
    setIsMarkingAll(true);
    try {
      await markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {
      // Silently ignore.
    } finally {
      setIsMarkingAll(false);
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (notAvailable) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
        <Card>
          <EmptyState
            icon="🔔"
            message="The notifications feature is not yet enabled in this version of EthioClear. Check back after a backend update."
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">
          Notifications{unreadCount > 0 && <span className="ml-2 rounded-full bg-primary-600 px-2 py-0.5 text-xs font-bold text-white">{unreadCount}</span>}
        </h1>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAll} isLoading={isMarkingAll} aria-label="Mark all notifications as read">
            Mark all read
          </Button>
        )}
      </div>

      {error && (
        <div role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card bodyClassName="p-0">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" label="Loading notifications…" />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState icon="✅" message="You have no notifications." />
        ) : (
          <>
            <ul className="divide-y divide-gray-100" role="list" aria-label="Notifications list">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`flex items-start justify-between gap-3 px-4 py-3 text-sm ${n.is_read ? '' : 'bg-primary-50'}`}
                >
                  <div className="min-w-0 flex-1">
                    <p className={`font-medium ${n.is_read ? 'text-gray-700' : 'text-gray-900'}`}>
                      {n.title}
                    </p>
                    <p className="mt-0.5 text-gray-600">{n.message}</p>
                    <p className="mt-1 text-xs text-gray-400">{formatDateTime(n.created_at)}</p>
                  </div>
                  {!n.is_read && (
                    <button
                      type="button"
                      onClick={() => handleMarkOne(n.id)}
                      className="shrink-0 text-xs font-medium text-primary-700 hover:underline"
                      aria-label={`Mark "${n.title}" as read`}
                    >
                      Mark read
                    </button>
                  )}
                </li>
              ))}
            </ul>

            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>
    </div>
  );
}

export default Notifications;
