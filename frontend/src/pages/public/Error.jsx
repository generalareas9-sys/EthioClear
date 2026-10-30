// src/pages/public/Error.jsx
// Generic error page (Feature 9). Used when an unexpected error
// occurs that isn't a 404 or 403 — e.g. a network failure at the
// app level. Wire into AppRoutes as a fallback and call
// navigate('/error') from error boundaries in the future.

import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';

function Error() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <span className="text-5xl" role="img" aria-label="Error">⚠️</span>
      <h1 className="mt-4 text-xl font-semibold text-gray-900">Something Went Wrong</h1>
      <p className="mt-2 text-sm text-gray-600">
        An unexpected error occurred. Please try again, or return to the home page.
      </p>
      <div className="mt-6 flex gap-3">
        <Button variant="outline" onClick={() => navigate(-1)} aria-label="Go back">
          Go Back
        </Button>
        <Link to="/">
          <Button aria-label="Go to home page">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}

export default Error;
