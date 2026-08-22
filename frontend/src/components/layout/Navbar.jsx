// src/components/layout/Navbar.jsx
// Top navigation bar.
// Module 6: "Verify Certificate" link in public nav.
// Module 7: Notification bell (🔔) and Profile link for authenticated users.
// Public nav (logged-out state) is unchanged.

import { Link, useNavigate } from 'react-router-dom';
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

function Navbar({ onMenuClick, unreadNotifications = 0, variant = 'dashboard' }) {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage, languages, t } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const isPublicMode = variant === 'public';

  const [langOpen, setLangOpen] = useState(false);
  const containerRef = useRef(null);
  const langButtonRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (langOpen && containerRef.current && !containerRef.current.contains(e.target)) setLangOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [langOpen]);

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
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="Toggle navigation menu"
              className="rounded-md p-2 text-gray-600 transition hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <Link to="/" className="flex items-center gap-2 font-semibold text-primary-700" aria-label="EthioClear home">
            <span className="rounded bg-primary-700 px-1.5 py-0.5 text-xs font-bold text-white">EC</span>
            <span className="text-lg dark:text-white">EthioClear</span>
          </Link>
        </div>

        {isPublicMode && (
          <nav className="flex items-center gap-1 overflow-x-auto" aria-label="Public navigation">
            {publicNavItems.map(({ label, path, icon: Icon }) => (
              <Link
                key={label}
                to={path}
                className="inline-flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-primary-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-primary-400"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative" ref={containerRef}>
            <div className="relative flex items-center rounded-md border border-gray-200 bg-white px-2 py-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <GlobeIcon className="mr-2 h-4 w-4 text-gray-600 dark:text-slate-200" />

              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                onClick={() => setLangOpen((s) => !s)}
                className="text-sm font-medium text-gray-700 dark:text-slate-100"
                id="language-selector-button"
                ref={langButtonRef}
              >
                {language === 'en' ? `${language.toUpperCase()} / English` : languages.find((l) => l.code === language)?.nativeName}
              </button>

              <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4 text-gray-500 dark:text-slate-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
              </svg>

              {langOpen && (
                              <div className="absolute right-0 mt-10 w-44 max-h-56 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800 z-50">
                  <ul role="listbox" aria-labelledby="language-selector-button">
                                  {languages.map((item, idx) => (
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
                              'w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center justify-between',
                              language === item.code ? 'bg-primary-50 dark:bg-primary-900/30 font-semibold text-gray-900 dark:text-slate-100' : 'text-gray-900 dark:text-slate-100'
                            ].join(' ')}
                          >
                            <span>{item.code === 'en' ? `${item.code.toUpperCase()} / ${item.name}` : item.nativeName}</span>
                            <span className="ml-2 text-xs text-gray-500 dark:text-slate-400">{item.code === 'en' ? null : item.name}</span>
                          </button>
                        </li>
                                  ))}
                                </ul>
                              </div>
                            )}
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
                <path d="M21 12.8A9 9 0 0 1 11.2 3a9 9 0 1 0 9.8 9.8Z" />
              </svg>
            )}
          </button>

          {isPublicMode ? (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-700 transition hover:text-primary-700 dark:text-slate-200 dark:hover:text-primary-400">
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
                className="relative rounded-md p-2 text-gray-600 transition hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800"
                aria-label={unreadNotifications > 0 ? `${unreadNotifications} unread notifications` : t('nav.notifications')}
              >
                <BellIcon className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </Link>

              <Link
                to="/profile"
                className="hidden text-sm font-medium text-gray-700 hover:text-primary-700 dark:text-slate-200 dark:hover:text-primary-400 sm:inline"
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
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary-700 dark:text-slate-200 dark:hover:text-primary-400">
                {t('nav.login')}
              </Link>
              <Link to="/register">
                <Button size="sm">{t('nav.register')}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
