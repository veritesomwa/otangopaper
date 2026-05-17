import { useEffect, useState } from 'react';

/**
 * Persistent state. Behaves like useState but mirrors to localStorage.
 *
 *   const [count, setCount] = useLocalStorage('counter', 0);
 */
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initial;
    } catch (_) {
      return initial;
    }
  });

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  }, [key, value]);

  return [value, setValue];
}
