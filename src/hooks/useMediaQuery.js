// Reactive media query — re-renders the calling component when the query's
// match state changes. Used to swap the sidebar between inline (desktop) and
// drawer (mobile) modes.

import { useEffect, useState } from 'react';

export function useMediaQuery(query) {
  const get = () =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(query).matches
      : false;

  const [matches, setMatches] = useState(get);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    // Modern + Safari-legacy listener APIs.
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else if (mql.addListener) mql.addListener(onChange);
    setMatches(mql.matches);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else if (mql.removeListener) mql.removeListener(onChange);
    };
  }, [query]);

  return matches;
}

/** Returns true when the viewport is narrower than the desktop breakpoint. */
export function useIsMobile(breakpoint = 900) {
  return useMediaQuery(`(max-width: ${breakpoint - 1}px)`);
}
