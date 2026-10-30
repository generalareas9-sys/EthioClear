// src/components/layout/Navbar.jsx
// Solid White Sticky Public & Dashboard Navbar matching Figma:
// - Always solid white (bg-white), sticky (sticky top-0 z-50), subtle bottom border and shadow.
// - Left: Official Brand Logo (dark text version on white)
// - Center: Desktop nav links (navy text, active item: soft blue pill with navy text)
// - Right: Language selector with 5 languages, "Sign In" link, Navy "Get Started" button (or Dashboard user menu)
// - Mobile: Responsive hamburger menu opening solid white drawer with clear links.
// - Single light-only theme (no moon/sun toggle).

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useTranslation } from '../../i18n/LanguageContext.jsx';
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

function CheckIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className} aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Navbar({ onMenuClick, unreadNotifications = 0, variant = 'dashboard' }) {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, languages, t } = useTranslation();
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

  // Escape key handler
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        setLangOpen(false);
        setAvatarOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

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

  // Public Navigation items with localized keys
  const publicNavItems = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.howItWorks'), path: '/how-it-works' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.verifyCertificate'), path: '/verify' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/90 shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand Logo or Portal Title */}
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="Toggle navigation menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden focus-visible:outline-[#0F2A6B]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {isPublicMode ? (
            <Link to="/" className="flex items-center">
              <Logo size={36} showSubtitle={true} variant="light" />
            </Link>
          ) : (
            <div className="flex items-center gap-2.5">
              <span className="hidden sm:inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#0F2A6B]">
                {portalTitle}
              </h2>
            </div>
          )}
        </div>

        {/* Center: Desktop Public Navigation Links with light blue pill for active item */}
        {isPublicMode && (
          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Public navigation">
            {publicNavItems.map(({ label, path }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={[
                    'rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all duration-150',
                    isActive
                      ? 'bg-blue-50 text-[#0F2A6B] border border-blue-200/60 shadow-xs'
                      : 'text-slate-700 hover:text-[#0F2A6B] hover:bg-slate-100',
                  ].join(' ')}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Section: Language, Auth CTAs or Dashboard controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Status pill in authenticated dashboard */}
          {!isPublicMode && isAuthenticated && (
            <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{currentUser?.role === ROLES.ADMIN ? 'Admin Access' : 'Online'}</span>
            </div>
          )}

          {/* Language Selector (5 languages, native names, checkmark, accessible) */}
          <div className="relative" ref={langContainerRef}>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label={t('nav.language')}
              onClick={() => setLangOpen((s) => !s)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 text-xs sm:text-sm font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#0F2A6B] transition-colors shadow-xs focus-visible:outline-[#0F2A6B]"
            >
              <GlobeIcon className="h-4 w-4 shrink-0 text-slate-500" />
              <span>{languages.find(l => l.code === language)?.nativeName || 'English'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
              </svg>
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                <ul role="listbox" className="space-y-0.5">
                  {languages.map((item) => {
                    const isSelected = language === item.code;
                    return (
                      <li key={item.code}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setLanguage(item.code);
                            setLangOpen(false);
                          }}
                          className={[
                            'w-full text-left px-3 py-2 text-xs sm:text-sm rounded-lg flex items-center justify-between transition-colors',
                            isSelected
                              ? 'bg-blue-50 text-[#0F2A6B] font-bold'
                              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
                          ].join(' ')}
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold">{item.nativeName}</span>
                            <span className="text-[11px] text-slate-500">{item.name}</span>
                          </div>
                          {isSelected && <CheckIcon className="h-4 w-4 text-[#0F2A6B]" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Public CTAs: "Sign In" + Navy "Get Started" */}
          {isPublicMode ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-bold text-slate-800 hover:text-[#0F2A6B] transition-colors">
                {t('nav.login')}
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-[#0F2A6B] hover:bg-[#1E3A8A] text-white font-bold shadow-xs px-4">
                  {t('nav.getStarted')}
                </Button>
              </Link>
            </div>
          ) : isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <Link
                to="/notifications"
                aria-label={t('nav.notifications')}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-xs focus-visible:outline-[#0F2A6B]"
              >
                <BellIcon className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-xs">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </Link>

              {/* User Avatar Menu */}
              <div className="relative" ref={avatarContainerRef}>
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={avatarOpen}
                  aria-label="User account menu"
                  onClick={() => setAvatarOpen((s) => !s)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F2A6B] text-xs font-bold text-[#D4A53A] ring-2 ring-slate-200 hover:ring-[#0F2A6B] transition-all shadow-xs focus-visible:outline-[#0F2A6B]"
                >
                  {userInitials}
                </button>

                {avatarOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {currentUser?.fullName || 'User'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {currentUser?.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setAvatarOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {t('nav.myProfile')}
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setAvatarOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="text-xs sm:text-sm font-bold text-slate-800 hover:text-[#0F2A6B]">
              {t('nav.login')}
            </Link>
          )}

          {/* Mobile hamburger toggle (public pages) */}
          {isPublicMode && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle navigation links"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 md:hidden focus-visible:outline-[#0F2A6B]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          )}

        </div>
      </div>

      {/* Mobile Drawer Navigation (Public Mode) - Solid White */}
      {isPublicMode && mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-5 shadow-xl space-y-4">
          <nav className="flex flex-col space-y-1">
            {publicNavItems.map(({ label, path }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={[
                    'rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                    isActive
                      ? 'bg-blue-50 text-[#0F2A6B] font-bold'
                      : 'text-slate-800 hover:bg-slate-100',
                  ].join(' ')}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          
          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" fullWidth size="md" className="font-bold text-slate-800">
                {t('nav.login')}
              </Button>
            </Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button fullWidth size="md" className="bg-[#0F2A6B] text-white font-bold">
                {t('nav.getStarted')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
