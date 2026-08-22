import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '../utils/constants.js';

const ThemeContext = createContext(undefined);

const THEME_VALUES = Object.freeze({
  LIGHT: 'light',
  DARK: 'dark',
});

function getInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEYS.APP_THEME);
  if (stored === THEME_VALUES.LIGHT || stored === THEME_VALUES.DARK) {
    return stored;
  }

  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? THEME_VALUES.DARK : THEME_VALUES.LIGHT;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.classList.toggle('dark', theme === THEME_VALUES.DARK);
    root.classList.toggle('light', theme === THEME_VALUES.LIGHT);
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;

    if (body) {
      body.classList.toggle('dark', theme === THEME_VALUES.DARK);
      body.classList.toggle('light', theme === THEME_VALUES.LIGHT);
    }

    localStorage.setItem(STORAGE_KEYS.APP_THEME, theme);
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    setTheme,
    isDark: theme === THEME_VALUES.DARK,
    toggleTheme: () => setTheme((current) => (current === THEME_VALUES.DARK ? THEME_VALUES.LIGHT : THEME_VALUES.DARK)),
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside a ThemeProvider');
  }
  return context;
}
