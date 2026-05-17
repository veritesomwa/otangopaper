import { useEffect, useState } from 'react';

/**
 * Returns a copy of `value` that only updates after `delay` ms of quiet.
 * Useful for autosave & search-as-you-type.
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}
