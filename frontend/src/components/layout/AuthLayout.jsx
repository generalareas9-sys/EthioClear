// src/components/layout/AuthLayout.jsx
// Reusable Split-Screen Layout for Authentication pages (Login, Register, Forgot Password, Reset Password)
// Matching the Figma design specifications:
// - Left Panel (desktop lg+): Navy diagonal gradient, subtle grid/circle decorations, official dark-variant logo,
//   large serif quote, project caption, and Ethiopian national ribbon accent bar.
// - Right Panel: Light background (#F4F6FB), top bar with "Back to home" and Language selector,
//   responsive mobile logo header, centered form card area (max-w ~440px), and academic disclaimer.

import { Link } from 'react-router-dom';
import Logo from '../common/Logo.jsx';
import LanguageSelector from '../common/LanguageSelector.jsx';
import { useTranslation } from '../../i18n/LanguageContext.jsx';

export default function AuthLayout({ children }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F4F6FB] text-slate-900">
      
      {/* Left Panel (Desktop lg+ only) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 shrink-0 relative flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0F2A6B] via-[#123C94] to-[#1E3A8A] p-10 xl:p-14 text-white select-none">
        
        {/* Subtle Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />

        {/* Large Decorative Translucent Circles */}
        <div
          className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-1/4 -left-20 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Top: Brand Logo for dark background */}
        <div className="relative z-10">
          <Logo variant="dark" size={38} showSubtitle={true} />
        </div>

        {/* Bottom Section: Quote, Caption, and Accent Ribbon */}
        <div className="relative z-10 mt-auto pt-12">
          {/* Large Serif Quote */}
          <blockquote className="font-serif text-2xl xl:text-3xl font-normal leading-relaxed text-white text-pretty">
            “{t('auth.quote')}”
          </blockquote>

          {/* Honest Prototype Caption */}
          <p className="mt-4 text-xs xl:text-sm font-medium tracking-wide text-blue-200/90">
            {t('auth.quoteCaption')}
          </p>

          {/* Ethiopian Flag Accent Bar: long green segment, then yellow and red */}
          <div className="mt-8 flex h-1.5 w-full max-w-xs rounded-full overflow-hidden shadow-xs">
            <div className="w-7/12 bg-[#0E8A3E]" />
            <div className="w-3/12 bg-[#FCCB0B]" />
            <div className="w-2/12 bg-[#E11D1D]" />
          </div>
        </div>
      </div>

      {/* Right Panel: Light background with top utilities, mobile logo, and centered form card */}
      <div className="flex-1 flex flex-col justify-between min-h-screen px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        
        {/* Top Header Bar inside Right Panel */}
        <div className="w-full max-w-xl mx-auto flex items-center justify-between gap-4 pb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#0F2A6B] transition-colors focus-visible:outline-[#0F2A6B] rounded-lg px-2 py-1"
            aria-label={t('auth.backToHome')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>{t('auth.backToHome')}</span>
          </Link>

          {/* Language Selector */}
          <LanguageSelector />
        </div>

        {/* Center Content: Mobile Brand Header + Form Card */}
        <div className="flex-1 flex flex-col items-center justify-center my-auto w-full">
          
          {/* Mobile/Tablet Brand Header (< lg only) */}
          <div className="lg:hidden flex flex-col items-center text-center mb-6">
            <Logo variant="light" size={36} showSubtitle={true} />
            <p className="mt-2 text-xs text-slate-500 font-medium max-w-xs">
              {t('auth.quoteCaption')}
            </p>
          </div>

          {/* Form Card Container */}
          <div className="w-full max-w-[440px]">
            {children}
          </div>

          {/* Academic Prototype Disclaimer under Card */}
          <p className="mt-6 max-w-md text-center text-xs leading-normal text-slate-500 font-normal px-2">
            {t('auth.disclaimer')}
          </p>
        </div>

        {/* Bottom spacing helper */}
        <div className="h-4 sm:h-6" aria-hidden="true" />
      </div>
    </div>
  );
}

