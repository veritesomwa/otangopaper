// Auth routes.
//
//   POST   /auth/register  — create an email/password account
//   POST   /auth/login     — log in with email/password
//   POST   /auth/google    — exchange a Google ID token for our session JWT
//   GET    /auth/me        — return the current user
//   POST   /auth/logout    — best-effort sign-out (stateless JWT)
//
// Identity is keyed by email — signing in with Google when an email/password
// account exists for the same email merges them into a single user record.

import { Router } from 'express';
import { verifyGoogleIdToken } from '../services/googleVerify.js';
import { signSessionToken }    from '../services/jwt.js';
import {
  upsertGoogle, registerWithEmail, loginWithEmail, updateProfile, publicProfile,
} from '../services/userStore.js';
import { requireAuth }         from '../middleware/requireAuth.js';

export const authRouter = Router();

/* ── Email + password ─────────────────────────────────────────────────────── */

authRouter.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(String(email))) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    const user  = await registerWithEmail({ email, password, name });
    const token = signSessionToken(user.id);
    res.json({ token, user: publicProfile(user) });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error('Register failed:', err);
    res.status(500).json({ error: 'Could not create account.' });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const user  = await loginWithEmail({ email, password });
    const token = signSessionToken(user.id);
    res.json({ token, user: publicProfile(user) });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error('Login failed:', err);
    res.status(500).json({ error: 'Could not sign in.' });
  }
});

/* ── Google sign-in ───────────────────────────────────────────────────────── */

authRouter.post('/google', async (req, res) => {
  const idToken = req.body?.idToken;
  if (!idToken) return res.status(400).json({ error: 'idToken is required.' });
  try {
    const profile = await verifyGoogleIdToken(idToken);
    const user    = await upsertGoogle(profile);
    const token   = signSessionToken(user.id);
    res.json({ token, user: publicProfile(user) });
  } catch (err) {
    console.warn('Google sign-in failed:', err.message);
    res.status(401).json({ error: 'Google sign-in failed.' });
  }
});

/* ── Session ──────────────────────────────────────────────────────────────── */

authRouter.get('/me', requireAuth, (req, res) => {
  res.json(publicProfile(req.user));
});

authRouter.post('/logout', requireAuth, (_req, res) => {
  // Stateless JWT — nothing to do server-side until we add a blacklist.
  res.status(204).end();
});

/* ── Profile (reusable resume seed) ───────────────────────────────────────── */

authRouter.patch('/profile', requireAuth, async (req, res) => {
  try {
    const user = await updateProfile(req.user.id, req.body || {});
    res.json(publicProfile(user));
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error('Profile update failed:', err);
    res.status(500).json({ error: 'Could not save profile.' });
  }
});
