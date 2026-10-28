// src/pages/public/NotFound.jsx
// Catch-all page for any route that doesn't match (see the '/*' route
// in routes/AppRoutes.jsx).

import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';

function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <span className="text-5xl font-bold text-primary-700">404</span>
      <h1 className="mt-2 text-xl font-semibold text-gray-900 dark:text-slate-100">Page Not Found</h1>
      <p className="mt-2 text-sm text-gray-600">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="mt-6">
        <Button variant="outline">Back to home</Button>
      </Link>
    </div>
  );
}

export default NotFound;
