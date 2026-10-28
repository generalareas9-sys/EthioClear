// src/pages/public/Landing.jsx
// Public home page ('/'). Simple welcome screen with a clear
// prototype disclaimer and links into the (placeholder) auth pages.

import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import { useTranslation } from '../../i18n/LanguageContext.jsx';
import { useTheme } from '../../theme/ThemeContext.jsx';

function Landing() {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  // Explicit text classes to guarantee readable text over the banner regardless of
  // surrounding layout/theme mismatches. Uses isDark from ThemeContext to pick
  // the correct foreground color.
  const headingClass = `relative z-10 text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} sm:text-4xl`;
  const leadClass = `relative z-10 mt-3 text-lg ${isDark ? 'text-slate-200' : 'text-gray-600'}`;
  const badgeClass = `relative z-10 mb-4 inline-block rounded-full bg-secondary-100 px-3 py-1 text-xs font-semibold ${isDark ? 'text-secondary-200 dark:bg-secondary-900/30' : 'text-secondary-800'}`;
  const disclaimerClass = `relative z-10 mt-10 text-xs ${isDark ? 'text-slate-400' : 'text-gray-400'}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center relative overflow-hidden hero-banner">
      {/* Overlay to ensure readable text over the banner */}
      <div className={`absolute inset-0 pointer-events-none ${isDark ? 'bg-gradient-to-b from-slate-900/80 to-transparent' : 'bg-gradient-to-b from-white/80 to-transparent'}`} aria-hidden="true" />

      <span className={badgeClass}>
        {t('landing.badge')}
      </span>
      <h1 className={headingClass}>{t('landing.title')}</h1>
      <p className={leadClass}>{t('landing.intro')}</p>

      <div className="relative z-10 mt-8 flex justify-center gap-3">
        <Link to="/register">
          <Button size="lg">{t('landing.getStarted')}</Button>
        </Link>
        <Link to="/login">
          <Button variant="outline" size="lg">
            {t('landing.login')}
          </Button>
        </Link>
      </div>

      <p className={disclaimerClass}>{t('landing.disclaimer')}</p>
    </div>
  );
}

export default Landing;
