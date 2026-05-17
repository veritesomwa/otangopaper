import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage.js';

/**
 * Manages the user's starred templates. Backed by localStorage today; switch
 * to a /starred endpoint via documentService once auth + persistence land.
 */
export function useStarred() {
  const [ids, setIds] = useLocalStorage('otango.starred', []);

  const isStarred = useCallback((id) => ids.includes(id), [ids]);

  const toggle = useCallback((id) => {
    setIds((prev) => prev.includes(id)
      ? prev.filter((x) => x !== id)
      : [...prev, id]
    );
  }, [setIds]);

  return { ids, isStarred, toggle };
}
