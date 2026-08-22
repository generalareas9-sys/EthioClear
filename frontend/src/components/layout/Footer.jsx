// src/components/layout/Footer.jsx
// Simple footer shown on every page. Repeats the prototype disclaimer
// so it's always visible, consistent with the certificate PDF footer.

import { useTranslation } from '../../i18n/LanguageContext.jsx';

function Footer() {
  const year = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="border-t border-gray-200 bg-white px-4 py-4 text-center text-xs text-gray-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
      <p>{t('footer.line1')}</p>
      <p className="mt-1">{t('footer.line2', { year })}</p>
    </footer>
  );
}

export default Footer;
