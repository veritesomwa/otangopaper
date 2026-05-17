// Tiny fetch wrapper used by every service. Reads VITE_API_URL from env.
// When VITE_API_URL is unset, isOffline() returns true and services fall back
// to local seed data — meaning the UI works with no backend at all.

const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const TOKEN_KEY = 'otango.auth.token';

export const isOffline = () => !BASE_URL;

export const getToken  = () => localStorage.getItem(TOKEN_KEY);
export const setToken  = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

/**
 * Issue an authenticated request to the backend.
 *
 * @param {string} path          path appended to VITE_API_URL (e.g. "/auth/login")
 * @param {object} [opts]
 * @param {string} [opts.method] HTTP verb. Default GET.
 * @param {object} [opts.body]   JSON body (will be serialised).
 * @param {object} [opts.headers] Extra headers.
 * @returns {Promise<any>}       parsed JSON response
 */
export async function apiFetch(path, { method = 'GET', body, headers = {} } = {}) {
  if (isOffline()) {
    throw new ApiOfflineError(`Backend not configured (VITE_API_URL is empty); falling back to local data for "${path}".`);
  }

  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new ApiError(`API ${method} ${path} failed: ${res.status} ${message}`, res.status);
  }

  // 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export class ApiOfflineError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ApiOfflineError';
  }
}
