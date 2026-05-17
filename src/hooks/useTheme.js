import { useContext } from 'react';
import { ThemeContext } from '@context/ThemeContext.jsx';

/** Read or change the current theme (dark/light). */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
