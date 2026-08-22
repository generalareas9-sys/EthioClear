import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import { useTranslation } from '../../i18n/LanguageContext.jsx';

const stepIcons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

function InfoCard({ title, text }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">{text}</p>
    </div>
  );
}

function Information() {
  const { t } = useTranslation();

  const steps = [
    t('info.step1'),
    t('info.step2'),
    t('info.step3'),
    t('info.step4'),
    t('info.step5'),
    t('info.step6'),
    t('info.step7'),
    t('info.step8'),
    t('info.step9'),
    t('info.step10'),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 text-gray-900 dark:text-slate-100">
      <div className="mb-8 rounded-2xl border border-primary-200 bg-primary-50 p-8 text-gray-900 dark:border-primary-900/60 dark:bg-slate-800 dark:text-slate-100">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">{t('info.pageTitle')}</p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">{t('info.heroTitle')}</h1>
        <p className="mt-4 max-w-4xl text-lg text-gray-700 dark:text-slate-200">{t('info.heroText')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <InfoCard title={t('info.whatTitle')} text={t('info.whatText')} />
        <InfoCard title={t('info.purposeTitle')} text={t('info.purposeText')} />
        <InfoCard title={t('info.audienceTitle')} text={t('info.audienceText')} />
      </div>

      <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">{t('info.workflowTitle')}</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{t('info.stepsTitle')}</h2>
          </div>
          <Link to="/register">
            <Button size="md">{t('landing.getStarted')}</Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {steps.map((step, index) => (
            <div key={step} className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-700 text-sm font-bold text-white dark:bg-primary-500">
                {stepIcons[index]}
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-slate-100">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('info.certificateTitle')}</h2>
          <p className="mt-3 text-base leading-7 text-gray-600 dark:text-slate-300">{t('info.certificateText')}</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/20">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('info.disclaimerTitle')}</h2>
          <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-slate-200">{t('info.disclaimerText')}</p>
        </div>
      </div>
    </div>
  );
}

export default Information;
