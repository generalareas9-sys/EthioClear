import { useTranslation } from '../../i18n/LanguageContext.jsx';

function ContactCard({ label, value, href }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">{label}</p>
      {href ? (
        <a href={href} className="mt-3 block text-lg font-medium text-gray-900 transition hover:text-primary-700 dark:text-white dark:hover:text-primary-400">
          {value}
        </a>
      ) : (
        <p className="mt-3 text-lg font-medium text-gray-900 dark:text-white">{value}</p>
      )}
    </div>
  );
}

function Contact() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 text-gray-900 dark:text-slate-100">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">{t('contact.pageTitle')}</p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">{t('contact.title')}</h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-600 dark:text-slate-300">{t('contact.helpText')}</p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <ContactCard label={t('help.phone')} value={t('contact.phone')} href={`tel:${t('contact.phone')}`} />
          <ContactCard label={t('help.email')} value={t('contact.email')} href={`mailto:${t('contact.email')}`} />
          <ContactCard label={t('help.address')} value={t('contact.address')} />
        </div>
      </div>
    </div>
  );
}

export default Contact;
