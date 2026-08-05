// src/components/layout/Navbar.jsx
// Top navigation bar.
// Module 6: "Verify Certificate" link in public nav.
// Module 7: Notification bell (🔔) and Profile link for authenticated users.
// Public nav (logged-out state) is unchanged.

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../common/Button.jsx';

function Navbar({ onMenuClick, unreadNotifications = 0 }) {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="Toggle navigation menu"
              className="rounded p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <Link to="/" className="flex items-center gap-2 font-semibold text-primary-700" aria-label="EthioClear home">
            <span className="rounded bg-primary-700 px-1.5 py-0.5 text-xs font-bold text-white">EC</span>
            <span>EthioClear</span>
          </Link>
        </div>

        <nav className="flex items-center gap-3" aria-label="Main navigation">
          {isAuthenticated ? (
            <>
              {/* Notification bell — Feature 4 of Module 7 */}
              <Link
                to="/notifications"
                className="relative rounded p-1.5 text-gray-600 hover:bg-gray-100"
                aria-label={unreadNotifications > 0 ? `${unreadNotifications} unread notifications` : 'Notifications'}
              >
                <span aria-hidden="true" className="text-lg leading-none">🔔</span>
                {unreadNotifications > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </Link>

              {/* Profile link */}
              <Link
                to="/profile"
                className="hidden text-sm font-medium text-gray-700 hover:text-primary-700 sm:inline"
                aria-label="My profile"
              >
                {currentUser?.fullName || currentUser?.email}
              </Link>

              <Button variant="outline" size="sm" onClick={handleLogout} aria-label="Log out">
                Log out
              </Button>
            </>
          ) : (
            <>
              {/* Verify Certificate — public nav only (Module 6) */}
              <Link to="/verify" className="hidden text-sm font-medium text-gray-700 hover:text-primary-700 sm:inline">
                Verify Certificate
              </Link>
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary-700">
                Log in
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
