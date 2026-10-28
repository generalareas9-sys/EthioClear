// src/routes/ProtectedRoute.jsx
// Route guard used to wrap role-specific route trees.
// - While auth state is still loading (checking localStorage), shows
//   a full-page spinner rather than flashing a redirect.
// - Unauthenticated users are redirected to /login.
// - Authenticated users whose role isn't in `allowedRoles` are
//   redirected to /403 (Access Denied).
// - Otherwise renders the nested route (<Outlet/>).

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

/**
 * @param {string[]} allowedRoles - roles permitted to access this route tree
 */
function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" label="Checking session…" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentUser?.role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
