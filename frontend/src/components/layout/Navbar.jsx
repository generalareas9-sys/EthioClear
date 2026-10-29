// src/components/layout/Navbar.jsx
// Upgraded Navbar matching Figma:
// - Left: Official Brand Logo
// - Center (Desktop): Home, How It Works, About, Verify Certificate, Contact (Active item: soft blue pill)
// - Right: Language selector, Light/Dark toggle, "Sign In" link, Navy "Get Started" button
// - Mobile: Responsive hamburger drawer with all items, accessible, smooth transitions

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useTranslation } from '../../i18n/LanguageContext.jsx';
import { useTheme } from '../../theme/ThemeContext.jsx';
import { ROLES } from '../../utils/constants.js';
import Button from '../common/Button.jsx';
import Logo from '../common/Logo.jsx';

function GlobeIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </svg>
  );
}

function BellIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

function SunIcon({ className = 'h-4 w-4' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className = 'h-4 w-4' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M21 12.8A9 9 0 0 1 11.2 3a9 9 0 1 0 9.8 9.8Z" />
    </svg>
  );
}

function Navbar({ onMenuClick, unreadNotifications = 0, variant = 'dashboard' }) {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, languages, t } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const isPublicMode = variant === 'public';

  const [langOpen, setLangOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const langContainerRef = useRef(null);
  const avatarContainerRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setLangOpen(false);
    setAvatarOpen(false);
  }, [location.pathname]);

  // Click outside handlers
  useEffect(() => {
    function onDoc(e) {
      if (langOpen && langContainerRef.current && !langContainerRef.current.contains(e.target)) {
        setLangOpen(false);
      }
      if (avatarOpen && avatarContainerRef.current && !avatarContainerRef.current.contains(e.target)) {
        setAvatarOpen(false);
      }
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [langOpen, avatarOpen]);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const portalTitle = {
    [ROLES.ADMIN]: 'System Administration',
    [ROLES.OFFICER]: 'Verification Officer Portal',
    [ROLES.APPLICANT]: 'Applicant Portal',
  }[currentUser?.role] || 'EthioClear Portal';

  const userInitials = (currentUser?.fullName || currentUser?.email || 'U')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Public Navigation items matching Figma
  const publicNavItems = [
    { label: 'Home', path: '/' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'About', path: '/about' },
    { label: 'Verify Certificate', path: '/verify' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-border-theme bg-surface/95 backdrop-blur-md shadow-sm transition-colors duration-150">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand Logo or Portal Title */}
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="Toggle navigation menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary hover:bg-card-subtle md:hidden focus-visible:outline-primary-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {isPublicMode ? (
            <Logo size={36} showSubtitle={true} />
          ) : (
            <div className="flex items-center gap-2.5">
              <span className="hidden sm:inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-text-primary">
                {portalTitle}
              </h2>
            </div>
          )}
        </div>

        {/* Center: Desktop Public Navigation Links with light blue pill for active item */}
        {isPublicMode && (
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2" aria-label="Public navigation">
            {publicNavItems.map(({ label, path }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={label}
                  to={path}
                  className={[
                    'rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold dark:bg-blue-950/70 dark:text-blue-300 shadow-xs'
                      : 'text-text-secondary hover:text-text-primary hover:bg-card-subtle/80',
                  ].join(' ')}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Section: Language, Theme, Auth CTAs */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Status pill in authenticated dashboard */}
          {!isPublicMode && isAuthenticated && (
            <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{currentUser?.role === ROLES.ADMIN ? 'Admin Access' : 'Online'}</span>
            </div>
          )}

          {/* Language Selector */}
          <div className="relative" ref={langContainerRef}>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              onClick={() => setLangOpen((s) => !s)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border-theme bg-surface px-2.5 text-xs sm:text-sm font-medium text-text-secondary hover:bg-card-subtle hover:text-text-primary transition-colors shadow-sm focus-visible:outline-primary-600"
            >
              <GlobeIcon className="h-4 w-4 shrink-0 text-text-muted" />
              <span className="hidden xs:inline">{language === 'en' ? 'EN' : language.toUpperCase()}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-text-muted" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
              </svg>
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-48 max-h-60 overflow-y-auto rounded-xl border border-border-theme bg-surface p-1 shadow-xl z-50">
                <ul role="listbox">
                  {languages.map((item) => (
                    <li key={item.code}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={language === item.code}
                        onClick={() => {
                          setLanguage(item.code);
                          setLangOpen(false);
                        }}
                        className={[
                          'w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between transition-colors',
                          language === item.code
                            ? 'bg-primary-50 text-primary-700 font-semibold dark:bg-primary-950/60 dark:text-primary-300'
                            : 'text-text-secondary hover:bg-card-subtle hover:text-text-primary',
                        ].join(' ')}
                      >
                        <span>{item.nativeName}</span>
                        <span className="text-xs text-text-muted">{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-theme bg-surface text-text-secondary hover:bg-card-subtle hover:text-text-primary transition-colors shadow-sm focus-visible:outline-primary-600"
          >
            {isDark ? <SunIcon className="h-4 w-4 text-amber-400" /> : <MoonIcon className="h-4 w-4 text-slate-700" />}
          </button>

          {/* Public CTAs: "Sign In" + Navy "Get Started" */}
          {isPublicMode ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-text-primary hover:text-primary-600 transition-colors">
                Sign In
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-[#0F2A6B] hover:bg-[#1E3A8A] text-white font-semibold shadow-sm px-4">
                  Get Started
                </Button>
              </Link>
            </div>
          ) : isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <Link
                to="/notifications"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-theme bg-surface text-text-secondary hover:bg-card-subtle transition-colors shadow-sm focus-visible:outline-primary-600"
                aria-label={unreadNotifications > 0 ? `${unreadNotifications} unread notifications` : t('nav.notifications')}
              >
                <BellIcon className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </Link>

              {/* User Avatar Menu Dropdown */}
              <div className="relative" ref={avatarContainerRef}>
                <button
                  type="button"
                  onClick={() => setAvatarOpen((o) => !o)}
                  aria-expanded={avatarOpen}
                  aria-label="User account menu"
                  className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-navy-800 to-navy-600 text-white font-bold text-xs shadow">
                    {userInitials}
                  </div>
                </button>

                {avatarOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border-theme bg-surface p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-border-theme mb-1">
                      <p className="text-sm font-semibold text-text-primary truncate">{currentUser?.fullName || 'User'}</p>
                      <p className="text-xs text-text-muted truncate">{currentUser?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setAvatarOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-text-secondary hover:bg-card-subtle hover:text-text-primary transition-colors"
                    >
                      <span>{t('nav.myProfile')}</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setAvatarOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    >
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : null}

          {/* Public Mobile Drawer Trigger */}
          {isPublicMode && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary hover:bg-card-subtle md:hidden focus-visible:outline-primary-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}

        </div>
      </div>

      {/* Mobile Drawer */}
      {isPublicMode && mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 md:hidden animate-in fade-in duration-200">
          <div className="fixed inset-0 top-16 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />
          <div className="relative border-b border-border-theme bg-surface px-4 py-6 shadow-2xl space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="flex flex-col space-y-1.5">
              {publicNavItems.map(({ label, path }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={label}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={[
                      'flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors min-h-[44px]',
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-bold dark:bg-blue-950/60 dark:text-blue-300'
                        : 'text-text-primary hover:bg-card-subtle',
                    ].join(' ')}
                  >
                    <span>{label}</span>
                    <span className="text-text-muted text-sm">›</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-border-theme flex flex-col gap-2.5">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" fullWidth size="lg">Sign In</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button fullWidth size="lg" className="bg-[#0F2A6B] hover:bg-[#1E3A8A] text-white">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
