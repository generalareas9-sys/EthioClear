import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '../utils/constants.js';
import { DEFAULT_LANGUAGE, LANGUAGES, translations } from './translations.js';

const LanguageContext = createContext(undefined);

function getInitialLanguage() {
  const stored = localStorage.getItem(STORAGE_KEYS.APP_LANGUAGE);
  if (stored && LANGUAGES.some((language) => language.code === stored)) {
    return stored;
  }
  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APP_LANGUAGE, language);
    document.documentElement.lang = language;
    document.documentElement.dir = 'ltr';
  }, [language]);

  const t = useCallback((key, paramsOrFallback) => {
    const lookup = key.split('.');
    const dictionary = translations[language] || translations[DEFAULT_LANGUAGE];
    const fallbackDictionary = translations[DEFAULT_LANGUAGE];

    let value = dictionary;
    let fallbackValue = fallbackDictionary;

    for (const segment of lookup) {
      if (value && Object.prototype.hasOwnProperty.call(value, segment)) {
        value = value[segment];
      } else {
        value = undefined;
        break;
      }
    }

    for (const segment of lookup) {
      if (fallbackValue && Object.prototype.hasOwnProperty.call(fallbackValue, segment)) {
        fallbackValue = fallbackValue[segment];
      } else {
        fallbackValue = undefined;
        break;
      }
    }

    if (value === undefined || value === null) {
      return paramsOrFallback ?? fallbackValue ?? key;
    }

    if (typeof value === 'string' && paramsOrFallback && typeof paramsOrFallback === 'object') {
      return value.replace(/\{(\w+)\}/g, (_, token) => String(paramsOrFallback[token] ?? `{${token}}`));
    }

    return value;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    languages: LANGUAGES,
    t,
  }), [language, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslation() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useTranslation must be used inside a LanguageProvider');
  }

  return context;
}
