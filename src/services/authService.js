// Auth controller. Talks to the Express backend (server/) when VITE_API_URL
// is configured; falls back to a stub user otherwise so the UI is still
// usable for offline / design work.

import { apiFetch, isOffline, setToken, clearToken } from './api.js';

const STUB_USER = {
  id: 'local-user',
  name: 'Alexandra Chen',
  email: 'alex.chen@email.com',
  givenName: 'Alexandra',
  picture: '',
  locale: 'en',
  isAdmin: false,
  hasPassword: false,
  hasGoogle: false,
};

export const authService = {
  /** Look up the current user from the stored token. */
  async me() {
    if (isOffline()) return STUB_USER;
    return apiFetch('/auth/me');
  },

  /**
   * Email + password registration. Returns the new user. The backend will
   * 409 if the email is already in use with a password set; if it's a
   * Google-only account, the password is *added* to the same record.
   */
  async register({ email, password, name }) {
    if (isOffline()) {
      setToken('stub-token');
      return { ...STUB_USER, email, name: name || STUB_USER.name };
    }
    const { token, user } = await apiFetch('/auth/register', {
      method: 'POST',
      body: { email, password, name },
    });
    setToken(token);
    return user;
  },

  /** Email + password login. */
  async passwordLogin({ email, password }) {
    if (isOffline()) {
      setToken('stub-token');
      return { ...STUB_USER, email };
    }
    const { token, user } = await apiFetch('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    setToken(token);
    return user;
  },

  /**
   * Exchange a Google ID token (from Google Identity Services) for a session
   * JWT. The backend verifies the credential, upserts the user record, and
   * returns { token, user }. We persist the token via api.setToken().
   */
  async googleLogin(idToken) {
    if (isOffline()) {
      setToken('stub-token');
      return STUB_USER;
    }
    const { token, user } = await apiFetch('/auth/google', {
      method: 'POST',
      body: { idToken },
    });
    setToken(token);
    return user;
  },

  /** Drop the current session both locally and (best-effort) on the server. */
  async logout() {
    if (!isOffline()) {
      try { await apiFetch('/auth/logout', { method: 'POST' }); } catch (_) {}
    }
    clearToken();
  },
};
