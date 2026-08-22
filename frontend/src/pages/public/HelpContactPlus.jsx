import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import { useTranslation } from '../../i18n/LanguageContext.jsx';

const socialLinks = [
  { label: 'YouTube', href: '#placeholder' },
  { label: 'Instagram', href: '#placeholder' },
  { label: 'LinkedIn', href: '#placeholder' },
  { label: 'Telegram', href: '#placeholder' },
  { label: 'Facebook', href: '#placeholder' },
];

function SectionCard({ title, children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 ${className}`}>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function HelpContactPlus() {
  const { t } = useTranslation();

  const faqs = [
    { q: t('help.q1'), a: t('help.q1a') },
    { q: t('help.q2'), a: t('help.q2a') },
    { q: t('help.q3'), a: t('help.q3a') },
    { q: t('help.q4'), a: t('help.q4a') },
    { q: t('help.q5'), a: t('help.q5a') },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 text-gray-900 dark:text-slate-100">
      <div className="mb-8 rounded-2xl border border-primary-200 bg-primary-50 p-8 dark:border-primary-900/60 dark:bg-primary-950/20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">{t('help.pageTitle')}</p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">{t('help.faqTitle')}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <SectionCard title={t('help.faqTitle')}>
          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item.q} className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
                <p className="font-semibold text-gray-900 dark:text-white">{item.q}</p>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">{item.a}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={t('help.supportTitle')}>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">{t('help.phone')}</p>
              <a href="tel:0986446282" className="mt-2 block text-base font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-400">0986446282</a>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">{t('help.email')}</p>
              <a href="mailto:oseidebrahim@gmail.com" className="mt-2 block text-base font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-400">oseidebrahim@gmail.com</a>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">{t('help.address')}</p>
              <p className="mt-2 text-base font-medium text-gray-900 dark:text-white">Harar, Haramaya</p>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        {socialLinks.map(({ label, href }) => (
          <a key={label} href={href} className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-primary-600">
            <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
            <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">{t('help.placeholder')}</p>
          </a>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <SectionCard title={t('help.contactTitle')}>
          <p className="text-sm leading-6 text-gray-600 dark:text-slate-300">{t('help.contactText')}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href="tel:0986446282">
              <Button size="md">{t('help.callSupport')}</Button>
            </a>
            <a href="mailto:oseidebrahim@gmail.com">
              <Button variant="outline" size="md">{t('help.emailSupport')}</Button>
            </a>
          </div>
        </SectionCard>

        <SectionCard title={t('help.socialsTitle')}>
          <div className="space-y-2">
            {socialLinks.map(({ label }) => (
              <div key={label} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/80">
                <span className="font-medium text-gray-900 dark:text-white">{label}</span>
                <span className="text-xs text-gray-500 dark:text-slate-400">Placeholder</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-8 text-center">
        <Link to="/register">
          <Button size="lg">{t('landing.getStarted')}</Button>
        </Link>
      </div>
    </div>
  );
}

export default HelpContactPlus;
