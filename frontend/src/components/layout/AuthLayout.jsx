// src/components/layout/AuthLayout.jsx
// Shared full-screen split layout for auth pages (Login, Register, Forgot/Reset Password).
// Left panel: navy branded panel (hidden on mobile).
// Right panel: light background with centered form content.

import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext.jsx';
import Logo from '../common/Logo.jsx';

/* ---------- Inline SVG helpers ---------- */

function GlobeIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
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

function ArrowLeftIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

/* ---------- Language selector (compact) ---------- */

function LanguageSelector() {
  const { language, setLanguage, languages } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language"
        onClick={() => setOpen((s) => !s)}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs focus-visible:outline-[#0F2A6B]"
      >
        <GlobeIcon className="h-4 w-4 shrink-0 text-slate-500" />
        <span className="hidden sm:inline">{languages.find((l) => l.code === language)?.nativeName || 'English'}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50">
          <ul role="listbox" className="space-y-0.5">
            {languages.map((item) => {
              const isSelected = language === item.code;
              return (
                <li key={item.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => { setLanguage(item.code); setOpen(false); }}
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
  );
}

/* ---------- Main AuthLayout ---------- */

import React from 'react';

export default function AuthLayout() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen">

      {/* ── Left Brand Panel (lg+ only) ── */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] relative flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0F2A6B] to-[#1E3A8A]">

        {/* Decorative large translucent circle */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full bg-white/[0.04]" />
        {/* Subtle dot-grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Top: Logo */}
        <div className="relative z-10 p-8 pt-10">
          <Logo size={38} showSubtitle={true} variant="dark" className="pointer-events-auto" />
        </div>

        {/* Bottom: Quote + accent bar */}
        <div className="relative z-10 px-8 pb-0">
          <blockquote className="mb-6">
            <p className="font-serif text-2xl xl:text-[26px] leading-snug text-white/95 font-medium">
              "{t('auth.brandQuote')}"
            </p>
            <cite className="mt-4 block text-sm font-sans text-white/60 not-italic">
              EthioClear · {t('auth.brandCaption')}
            </cite>
          </blockquote>

          {/* Green–Yellow–Red accent bar */}
          <div className="flex h-1.5 rounded-t-sm overflow-hidden">
            <div className="flex-[5] bg-[#0E8A3E]" />
            <div className="flex-[2] bg-[#FCCB0B]" />
            <div className="flex-[2] bg-[#E11D1D]" />
          </div>
        </div>
      </div>

      {/* ── Right Content Panel ── */}
      <div className="flex flex-1 flex-col bg-[#F4F6FB] relative">

        {/* Top bar: Back link + Language selector */}
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-[#0F2A6B] transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>{t('auth.backToHome')}</span>
          </Link>

          <LanguageSelector />
        </div>

        {/* Mobile-only: logo + tagline (below lg) */}
        <div className="lg:hidden flex flex-col items-center pt-6 pb-2 px-4">
          <Logo size={36} showSubtitle={true} variant="light" />
          <p className="mt-2 text-center text-sm text-slate-500 max-w-xs">
            {t('auth.mobileTagline')}
          </p>
        </div>

        {/* Centered form content area */}
        <div className="flex flex-1 items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
          <div className="w-full max-w-[440px]">
            <Outlet />
          </div>
        </div>

        {/* Disclaimer at bottom */}
        <div className="px-4 pb-4 sm:pb-6 text-center">
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            {t('auth.disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
}
