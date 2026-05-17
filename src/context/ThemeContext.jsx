import { createContext, useEffect, useState, useCallback } from 'react';

export const ThemeContext = createContext(null);

const THEME_KEY = 'otango.theme';

export function ThemeProvider({ children, defaultTheme = 'dark' }) {
  const [theme, setTheme] = useState(() => {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(THEME_KEY) : null;
    return stored === 'light' || stored === 'dark' ? stored : defaultTheme;
  });

  // Reflect theme on <html> so CSS custom properties apply globally.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
