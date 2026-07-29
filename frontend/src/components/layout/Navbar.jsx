// src/components/layout/Navbar.jsx
// Top navigation bar. Shows sign-in/register links when logged out,
// and the current user's name plus a logout button when logged in.
// `onMenuClick` is optional — when provided (inside DashboardLayout),
// a hamburger button appears to open the mobile sidebar drawer.

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../common/Button.jsx';

function Navbar({ onMenuClick }) {
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
              {/* Simple inline hamburger icon — no icon library dependency */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <Link to="/" className="flex items-center gap-2 font-semibold text-primary-700">
            <span className="rounded bg-primary-700 px-1.5 py-0.5 text-xs font-bold text-white">EC</span>
            <span>EthioClear</span>
          </Link>
        </div>

        <nav className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-gray-600 sm:inline">
                {currentUser?.fullName || currentUser?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
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
