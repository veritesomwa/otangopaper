import { useEffect, useState } from 'react';
import { templateService } from '@services/templateService.js';

/**
 * Loads the template catalog. Today this resolves synchronously from local
 * seed data; once /templates exists on the backend it'll fetch from there.
 *
 * Returns { templates, loading, error }.
 */
export function useTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await templateService.list();
        if (!cancelled) setTemplates(list);
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { templates, loading, error };
}
