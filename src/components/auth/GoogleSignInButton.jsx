import { useEffect, useRef, useState } from 'react';

const GIS_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

let gisLoadPromise = null;
function loadGoogleIdentityServices() {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'));
  if (window.google?.accounts?.id) return Promise.resolve();
  if (gisLoadPromise) return gisLoadPromise;

  gisLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src   = GIS_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload  = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
  return gisLoadPromise;
}

/**
 * Renders the official Google Identity Services button.
 *
 * Props:
 *   clientId             — Google OAuth Web Client ID (required)
 *   onCredential(idToken) — callback invoked with the ID token JWT after
 *                           the user successfully signs in
 *   theme                — 'outline' (default) or 'filled_blue' / 'filled_black'
 *   size                 — 'large' (default) | 'medium' | 'small'
 */
export function GoogleSignInButton({ clientId, onCredential, theme = 'outline', size = 'large' }) {
  const ref = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!clientId) { setError('Missing GOOGLE_CLIENT_ID'); return; }
    let cancelled = false;
    (async () => {
      try {
        await loadGoogleIdentityServices();
        if (cancelled || !ref.current) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response?.credential) onCredential?.(response.credential);
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          ux_mode: 'popup',
        });
        window.google.accounts.id.renderButton(ref.current, {
          theme, size, type: 'standard', shape: 'pill', text: 'continue_with',
          logo_alignment: 'left', width: 320,
        });
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    })();
    return () => { cancelled = true; };
  }, [clientId, onCredential, theme, size]);

  if (error) {
    return (
      <div style={{
        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
        color: '#EF4444', padding: '10px 14px', borderRadius: 10,
        fontSize: 12, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif",
      }}>
        Couldn't load Google sign-in: {error}.
      </div>
    );
  }
  return <div ref={ref} style={{ display: 'flex', justifyContent: 'center' }} />;
}
