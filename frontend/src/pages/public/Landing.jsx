// src/pages/public/Landing.jsx
// Public home page ('/'). Simple welcome screen with a clear
// prototype disclaimer and links into the (placeholder) auth pages.

import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';

function Landing() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <span className="mb-4 inline-block rounded-full bg-secondary-100 px-3 py-1 text-xs font-semibold text-secondary-800">
        University Graduation Project — Academic Prototype
      </span>
      <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
        EthioClear
      </h1>
      <p className="mt-3 text-lg text-gray-600">
        A demonstration of how a criminal record certificate application process could be digitized —
        from submission and document upload through officer review to certificate issuance.
      </p>

      <div className="mt-8 flex justify-center gap-3">
        <Link to="/register">
          <Button size="lg">Get started</Button>
        </Link>
        <Link to="/login">
          <Button variant="outline" size="lg">
            Log in
          </Button>
        </Link>
      </div>

      <p className="mt-10 text-xs text-gray-400">
        This is not a real government system and does not connect to any official database.
      </p>
    </div>
  );
}

export default Landing;
