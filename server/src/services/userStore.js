// User-store façade. The HTTP layer goes through these functions only —
// swapping persistence (mongo → postgres → whatever) only touches this file.
//
// Merge rule: identity is keyed by email. A user can have a Google
// connection AND a password (or just one of them). Signing in with Google
// when an email-password account already exists *adds* the Google
// connection rather than creating a duplicate.

import { User } from '../models/User.js';
import { hashPassword, verifyPassword } from './password.js';
import { config } from '../config.js';

function isAdminFor(email) {
  if (!email) return false;
  return config.adminEmails.includes(email.toLowerCase());
}

/** Public-safe view of a user document. */
export function publicProfile(user) {
  if (!user) return null;
  const u = typeof user.toJSON === 'function' ? user.toJSON() : user;
  return {
    id:            u.id || u._id?.toString(),
    email:         u.email,
    name:          u.name,
    givenName:     u.givenName,
    picture:       u.picture,
    locale:        u.locale,
    isAdmin:       !!u.isAdmin,
    hasPassword:   !!u.passwordHash || !!user.passwordHash,
    hasGoogle:     !!u.googleSub,
    emailVerified: !!u.emailVerified,
    profile:       u.profile || {},
    createdAt:     u.createdAt,
  };
}

/* ──────────────────────────────────────────────────────────────────────────
 * Profile (reusable resume seed). Shallow-merge the patch into user.profile.
 * Nested arrays/objects in the patch fully replace the current value — caller
 * is responsible for splicing experience/education arrays before sending.
 * ────────────────────────────────────────────────────────────────────────── */
export async function updateProfile(userId, patch) {
  if (!userId) {
    const err = new Error('Not authenticated.'); err.status = 401; throw err;
  }
  if (!patch || typeof patch !== 'object') {
    const err = new Error('Invalid profile patch.'); err.status = 400; throw err;
  }
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found.'); err.status = 404; throw err;
  }
  user.profile = { ...(user.profile || {}), ...patch };
  // Tell Mongoose the Mixed field changed — otherwise it won't persist.
  user.markModified('profile');
  await user.save();
  return user;
}

export async function findById(id) {
  if (!id) return null;
  try { return await User.findById(id); }
  catch { return null; }
}

export async function findByEmail(email) {
  if (!email) return null;
  return User.findOne({ email: email.toLowerCase().trim() });
}

/* ──────────────────────────────────────────────────────────────────────────
 * Google sign-in: upsert by googleSub, falling back to email so an existing
 * password account gets the Google connection added (instead of duplicated).
 * ────────────────────────────────────────────────────────────────────────── */
export async function upsertGoogle(profile) {
  const email = profile.email?.toLowerCase().trim();

  let user = await User.findOne({ googleSub: profile.sub });
  if (!user && email) user = await User.findOne({ email });

  if (!user) {
    user = new User({
      email,
      googleSub:     profile.sub,
      name:          profile.name,
      givenName:     profile.givenName,
      familyName:    profile.familyName,
      picture:       profile.picture,
      locale:        profile.locale,
      emailVerified: profile.emailVerified,
    });
  } else {
    // Merge / refresh
    user.googleSub     = profile.sub;
    user.name          = profile.name      || user.name;
    user.givenName     = profile.givenName  || user.givenName;
    user.familyName    = profile.familyName || user.familyName;
    user.picture       = profile.picture    || user.picture;
    user.locale        = profile.locale     || user.locale;
    user.emailVerified = profile.emailVerified || user.emailVerified;
  }
  user.isAdmin = user.isAdmin || isAdminFor(user.email);
  await user.save();
  return user;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Email/password registration. If the email already exists with a password,
 * 409. If it exists without a password (Google-only account), let the user
 * "claim" the account by attaching a password.
 * ────────────────────────────────────────────────────────────────────────── */
export async function registerWithEmail({ email, password, name }) {
  email = email.toLowerCase().trim();
  const existing = await User.findOne({ email });

  if (existing) {
    if (existing.passwordHash) {
      const err = new Error('An account with that email already exists.');
      err.status = 409;
      throw err;
    }
    // Existing Google-only user — let them set a password to claim it.
    existing.passwordHash = await hashPassword(password);
    if (name) existing.name = existing.name || name;
    existing.isAdmin = existing.isAdmin || isAdminFor(email);
    await existing.save();
    return existing;
  }

  const user = new User({
    email,
    name:    name || '',
    isAdmin: isAdminFor(email),
  });
  user.passwordHash = await hashPassword(password);
  await user.save();
  return user;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Email/password login. Returns the user on success, throws 401 on bad
 * credentials. Distinguishes "no password set" so the UI can suggest
 * Google sign-in for users who registered that way.
 * ────────────────────────────────────────────────────────────────────────── */
export async function loginWithEmail({ email, password }) {
  email = email.toLowerCase().trim();
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('Invalid email or password.'); err.status = 401; throw err;
  }
  if (!user.passwordHash) {
    const err = new Error('This account uses Google sign-in. Click "Continue with Google".');
    err.status = 401;
    throw err;
  }
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    const err = new Error('Invalid email or password.'); err.status = 401; throw err;
  }
  return user;
}
