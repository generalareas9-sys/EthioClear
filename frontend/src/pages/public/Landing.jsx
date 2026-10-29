// src/pages/public/Landing.jsx
// Responsive public landing page with theme tokens, WCAG AA contrast, and mobile-friendly tap targets.

import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import { useTranslation } from '../../i18n/LanguageContext.jsx';
import { useTheme } from '../../theme/ThemeContext.jsx';

function Landing() {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <div className="relative overflow-hidden hero-banner min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      {/* Dynamic theme overlay for guaranteed contrast over background SVG */}
      <div
        className={`absolute inset-0 pointer-events-none transition-colors duration-200 ${
          isDark
            ? 'bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950'
            : 'bg-gradient-to-b from-white/95 via-white/85 to-white/95'
        }`}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center space-y-6">
        
        {/* Prototype status badge */}
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary-300 dark:border-secondary-800 bg-secondary-50 dark:bg-secondary-950/60 px-3.5 py-1 text-xs font-semibold text-secondary-800 dark:text-secondary-300 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-secondary-500 animate-pulse" />
            {t('landing.badge')}
          </span>
        </div>

        {/* Hero title */}
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-text-primary">
          {t('landing.title')}
        </h1>

        {/* Lead subtitle */}
        <p className="mx-auto max-w-2xl text-base sm:text-lg lg:text-xl text-text-secondary leading-relaxed">
          {t('landing.intro')}
        </p>

        {/* Action CTAs */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link to="/register" className="w-full sm:w-auto">
            <Button size="lg" fullWidth className="sm:w-auto shadow-md">
              {t('landing.getStarted')}
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" fullWidth className="sm:w-auto">
              {t('landing.login')}
            </Button>
          </Link>
          <Link to="/verify" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" fullWidth className="sm:w-auto border-dashed">
              Verify Certificate
            </Button>
          </Link>
        </div>

        {/* Academic prototype disclaimer */}
        <p className="pt-8 text-xs text-text-muted leading-relaxed max-w-xl mx-auto">
          {t('landing.disclaimer')}
        </p>
      </div>
    </div>
  );
}

export default Landing;
