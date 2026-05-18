import { createContext, useCallback, useEffect, useState } from 'react';
import { authService } from '@services/authService.js';
import { getToken, isOffline } from '@services/api.js';

export const AuthContext = createContext(null);

/**
 * Wraps the app and exposes:
 *   user, loading, error, isAuthenticated, isAuthRequired, isAdmin,
 *   googleLogin(idToken), passwordLogin({email,password}), register(...),
 *   logout()
 *
 * On mount, attempts to rehydrate the session from a stored token.
 *
 * `isAuthRequired` is true when a backend is configured (VITE_API_URL is set).
 * In offline / design mode the app keeps working with a stub user.
 */
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const isAuthRequired = !isOffline();

  // Rehydrate session
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Offline / design mode → instant stub user
      if (!isAuthRequired) {
        try {
          const me = await authService.me();
          if (!cancelled) setUser(me);
        } finally {
          if (!cancelled) setLoading(false);
        }
        return;
      }

      // Real backend mode — only hit /me if we have a token
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const me = await authService.me();
        if (!cancelled) setUser(me);
      } catch (e) {
        if (!cancelled) {
          setError(e);
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isAuthRequired]);

  /** Sign in with a Google ID token (from Google Identity Services). */
  const googleLogin = useCallback(async (googleIdToken) => {
    setError(null);
    const u = await authService.googleLogin(googleIdToken);
    setUser(u);
    return u;
  }, []);

  /** Sign in with email + password. */
  const passwordLogin = useCallback(async (creds) => {
    setError(null);
    const u = await authService.passwordLogin(creds);
    setUser(u);
    return u;
  }, []);

  /** Create a new email/password account. */
  const register = useCallback(async (info) => {
    setError(null);
    const u = await authService.register(info);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  /**
   * Save the reusable resume profile (name/title/email/phone/location/bio/...)
   * that's auto-seeded into every new template. Returns the merged profile.
   */
  const updateProfile = useCallback(async (patch) => {
    setError(null);
    const updated = await authService.updateProfile(patch);
    // Merge into our cached user so consumers re-render immediately.
    setUser((prev) => prev
      ? { ...prev, profile: updated.profile || { ...(prev.profile || {}), ...patch } }
      : prev,
    );
    return updated.profile || patch;
  }, []);

  const value = {
    user, loading, error,
    isAuthenticated: !!user,
    isAuthRequired,
    isAdmin: !!user?.isAdmin,
    profile: user?.profile || {},
    googleLogin, passwordLogin, register, logout, updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
