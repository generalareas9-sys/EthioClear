// src/pages/public/AccessDenied.jsx
// Shown when an authenticated user tries to access a route their
// role isn't permitted to view (see routes/ProtectedRoute.jsx).

import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';

function AccessDenied() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <span className="text-5xl font-bold text-red-600">403</span>
      <h1 className="mt-2 text-xl font-semibold text-gray-900 dark:text-slate-100">Access Denied</h1>
      <p className="mt-2 text-sm text-gray-600">
        You don&apos;t have permission to view this page with your current account role.
      </p>
      <Link to="/" className="mt-6">
        <Button variant="outline">Back to home</Button>
      </Link>
    </div>
  );
}

export default AccessDenied;
