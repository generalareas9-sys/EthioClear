// src/components/layout/Navbar.jsx
// Top navigation bar with responsive mobile drawer, accessible toggles, and unified themes.

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useTranslation } from '../../i18n/LanguageContext.jsx';
import { useTheme } from '../../theme/ThemeContext.jsx';
import Button from '../common/Button.jsx';

function HomeIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M10 20v-6h4v6" />
    </svg>
  );
}

function InfoIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10.5v5" />
      <path d="M12 7.5h.01" />
    </svg>
  );
}

function DocumentIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M7 3.5h7l5 5V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z" />
      <path d="M14 3.5v5h5" />
      <path d="M8 13h8M8 17h8" />
    </svg>
  );
}

function ContactIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z" />
      <path d="m5 7 7 5 7-5" />
    </svg>
  );
}

function HelpIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.2A2.7 2.7 0 0 1 12 7.5a2.8 2.8 0 0 1 2.8 2.9c0 2-2 2.3-2.5 3.4" />
      <path d="M12 17.2h.01" />
    </svg>
  );
}

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const langButtonRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setLangOpen(false);
  }, [location.pathname]);

  // Click outside language selector
  useEffect(() => {
    function onDoc(e) {
      if (langOpen && containerRef.current && !containerRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [langOpen]);

  // Close mobile drawer on Escape key
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setLangOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const publicNavItems = [
    { label: 'Home', path: '/', icon: HomeIcon },
    { label: 'About', path: '/about', icon: InfoIcon },
    { label: 'Information', path: '/information', icon: DocumentIcon },
    { label: 'Contact', path: '/contact', icon: ContactIcon },
    { label: 'Help / Contact Plus', path: '/help', icon: HelpIcon },
  ];

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border-theme bg-header/95 backdrop-blur-md shadow-sm transition-colors duration-150">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand Logo & Optional Dashboard Drawer Trigger */}
        <div className="flex items-center gap-3">
          {/* Dashboard mobile menu trigger (only when onMenuClick provided) */}
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="Toggle dashboard menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary hover:bg-card-subtle md:hidden focus-visible:outline-primary-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <Link to="/" aria-label="EthioClear home" className="flex items-center rounded focus-visible:outline-primary-600">
            <img
              src="/logo.svg"
              alt="EthioClear — Your Criminal Record Certificate, Simplified."
              className="h-8 sm:h-9 w-auto object-contain transition-opacity hover:opacity-95"
              style={{ maxWidth: '210px' }}
            />
          </Link>
        </div>

        {/* Center: Desktop Public Navigation Links */}
        {isPublicMode && (
          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Public navigation">
            {publicNavItems.map(({ label, path, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={label}
                  to={path}
                  className={[
                    'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 font-semibold'
                      : 'text-text-secondary hover:bg-card-subtle hover:text-text-primary',
                  ].join(' ')}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right: Actions, Language, Theme, Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Language Selector Dropdown */}
          <div className="relative" ref={containerRef}>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              onClick={() => setLangOpen((s) => !s)}
              ref={langButtonRef}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border-theme bg-surface px-2.5 text-xs sm:text-sm font-medium text-text-secondary hover:bg-card-subtle hover:text-text-primary transition-colors shadow-sm focus-visible:outline-primary-600"
              id="language-selector-button"
            >
              <GlobeIcon className="h-4 w-4 shrink-0 text-text-muted" />
              <span className="hidden xs:inline">
                {language === 'en' ? 'EN' : language.toUpperCase()}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-text-muted" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
              </svg>
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-48 max-h-60 overflow-y-auto rounded-xl border border-border-theme bg-surface p-1 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                <ul role="listbox" aria-labelledby="language-selector-button">
                  {languages.map((item) => (
                    <li key={item.code}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={language === item.code}
                        onClick={() => {
                          setLanguage(item.code);
                          setLangOpen(false);
                          langButtonRef.current?.focus();
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

          {/* Desktop Auth Actions */}
          <div className="hidden sm:flex items-center gap-2">
            {isPublicMode ? (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-card-subtle hover:text-text-primary transition-colors"
                >
                  Log in
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            ) : isAuthenticated ? (
              <>
                <Link
                  to="/notifications"
                  className="relative rounded-lg p-2 text-text-secondary hover:bg-card-subtle transition-colors"
                  aria-label={unreadNotifications > 0 ? `${unreadNotifications} unread notifications` : t('nav.notifications')}
                >
                  <BellIcon className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute 1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </Link>

                <Link
                  to="/profile"
                  className="text-sm font-medium text-text-secondary hover:text-primary-600 transition-colors"
                  aria-label={t('nav.myProfile')}
                >
                  {currentUser?.fullName || currentUser?.email}
                </Link>

                <Button variant="outline" size="sm" onClick={handleLogout} aria-label={t('nav.logout')}>
                  {t('nav.logout')}
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-primary-600 transition-colors">
                  {t('nav.login')}
                </Link>
                <Link to="/register">
                  <Button size="sm">{t('nav.register')}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button for Public Navigation */}
          {isPublicMode && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
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

      {/* Mobile Drawer Overlay & Panel for Public Navigation */}
      {isPublicMode && mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 md:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-16 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Menu */}
          <div className="relative border-b border-border-theme bg-surface px-4 py-6 shadow-2xl space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="flex flex-col space-y-1.5" aria-label="Mobile navigation">
              {publicNavItems.map(({ label, path, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={label}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={[
                      'flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-base font-medium transition-colors min-h-[44px]',
                      isActive
                        ? 'bg-primary-50 text-primary-700 font-semibold dark:bg-primary-950/60 dark:text-primary-300'
                        : 'text-text-primary hover:bg-card-subtle',
                    ].join(' ')}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-border-theme flex flex-col gap-2.5">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" fullWidth size="lg">
                  Log in
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button fullWidth size="lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
