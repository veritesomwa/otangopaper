// Tiny hash-based router. Encodes the app's navigation state in window.location.hash
// so the browser's Back / Forward buttons (and refresh, and deep links from a
// share / chat link) all "just work" — including on mobile.
//
// Hash grammar:
//   '#/'                    → screen=home,  nav=home
//   '#/templates'           → screen=home,  nav=templates
//   '#/designs'             → screen=home,  nav=designs
//   '#/starred'             → screen=home,  nav=starred
//   '#/settings'            → screen=home,  nav=settings
//   '#/profile'             → screen=home,  nav=profile
//   '#/magic'               → screen=magic, magicCategory=null
//   '#/magic/<category>'    → screen=magic, magicCategory=<category>
//   '#/editor'              → screen=editor

import { useCallback, useEffect, useState } from 'react';

const HOME_NAVS = new Set(['home', 'templates', 'designs', 'starred', 'settings', 'profile']);

/** Parse a hash like '#/magic/resume' into a route object. */
export function parseHash(rawHash) {
  const hash = String(rawHash || '').replace(/^#\/?/, '');   // strip leading '#/' or '#'
  if (!hash || hash === '') {
    return { screen: 'home', activeNav: 'home', magicCategory: null };
  }
  const [first, second] = hash.split('/');
  if (first === 'magic') {
    return { screen: 'magic', activeNav: 'magic', magicCategory: second || null };
  }
  if (first === 'editor') {
    return { screen: 'editor', activeNav: null, magicCategory: null };
  }
  if (HOME_NAVS.has(first)) {
    return { screen: 'home', activeNav: first, magicCategory: null };
  }
  // Unknown — fall back to home.
  return { screen: 'home', activeNav: 'home', magicCategory: null };
}

/** Build the canonical hash for a route. */
export function buildHash({ screen, activeNav, magicCategory }) {
  if (screen === 'editor')                                 return '#/editor';
  if (screen === 'magic')                                  return magicCategory ? `#/magic/${magicCategory}` : '#/magic';
  if (screen === 'home' && activeNav && activeNav !== 'home') return `#/${activeNav}`;
  return '#/';
}

/**
 * Returns the current route + a `navigate(next, opts)` function.
 *
 * - navigate({screen, activeNav, magicCategory})  → pushState (back-button can return here)
 * - navigate({...}, { replace: true })            → replaceState (don't add history entry)
 *
 * Re-renders the host component whenever:
 *   • our own navigate() runs
 *   • the user clicks browser Back / Forward (popstate)
 *   • some other code changes the hash directly (hashchange)
 */
export function useAppRoute() {
  const read = () => parseHash(typeof window !== 'undefined' ? window.location.hash : '');
  const [route, setRoute] = useState(read);

  // Re-read the hash on browser navigation events.
  useEffect(() => {
    const onChange = () => setRoute(read());
    window.addEventListener('popstate',   onChange);
    window.addEventListener('hashchange', onChange);
    return () => {
      window.removeEventListener('popstate',   onChange);
      window.removeEventListener('hashchange', onChange);
    };
  }, []);

  const navigate = useCallback((next, opts = {}) => {
    const target = { ...read(), ...next };
    const hash   = buildHash(target);
    const url    = `${window.location.pathname}${window.location.search}${hash}`;
    if (opts.replace) window.history.replaceState({}, '', url);
    else              window.history.pushState({},  '', url);
    setRoute(parseHash(hash));
  }, []);

  return { route, navigate };
}
