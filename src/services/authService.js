// Auth controller. Talks to the Express backend (server/) when VITE_API_URL
// is configured; falls back to a stub user otherwise so the UI is still
// usable for offline / design work.

import { apiFetch, isOffline, setToken, clearToken } from './api.js';

// localStorage key used for offline profile persistence. We store it under
// the same auth namespace as the token so signing out can clear it cleanly.
const OFFLINE_PROFILE_KEY = 'otango.auth.profile';

function readOfflineProfile() {
  try {
    const raw = localStorage.getItem(OFFLINE_PROFILE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}
function writeOfflineProfile(patch) {
  const next = { ...readOfflineProfile(), ...(patch || {}) };
  try { localStorage.setItem(OFFLINE_PROFILE_KEY, JSON.stringify(next)); } catch {}
  return next;
}

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
  profile: {},
};

export const authService = {
  /** Look up the current user from the stored token. */
  async me() {
    if (isOffline()) return { ...STUB_USER, profile: readOfflineProfile() };
    const me = await apiFetch('/auth/me');
    return { ...me, profile: me.profile || {} };
  },

  /**
   * Save the reusable resume profile. Merges shallowly into user.profile and
   * returns the updated user. In offline / design mode the profile is kept
   * in localStorage so the seeding still works without a backend.
   */
  async updateProfile(patch) {
    if (isOffline()) {
      const profile = writeOfflineProfile(patch);
      return { profile };
    }
    return apiFetch('/auth/profile', { method: 'PATCH', body: patch });
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

// Re-export for components that want raw offline access (e.g. seeding from
// localStorage before AuthContext has hydrated).
export { readOfflineProfile };
