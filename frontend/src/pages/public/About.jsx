import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext.jsx';
import Button from '../../components/common/Button.jsx';

function About() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 text-gray-900 dark:text-slate-100">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-400">
          {t('info.pageTitle')}
        </p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">{t('about.title')}</h1>
        <p className="mt-4 max-w-3xl text-lg text-gray-600 dark:text-slate-300">
          {t('info.whatText')}
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-slate-700 dark:bg-slate-800/70">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('about.purpose')}</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
              {t('info.purposeText')}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-slate-700 dark:bg-slate-800/70">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('about.scope')}</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
              {t('info.audienceText')}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-slate-700 dark:bg-slate-800/70">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('about.status')}</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
              {t('info.disclaimerText')}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/information">
            <Button size="lg">{t('about.learnMore')}</Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="lg">{t('landing.getStarted')}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default About;
