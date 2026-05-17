// Express middleware that pulls a Bearer token off the Authorization header,
// verifies it, hydrates `req.user` from the user store, and 401s otherwise.

import { verifySessionToken } from '../services/jwt.js';
import { findById }           from '../services/userStore.js';

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header.' });
  }
  try {
    const claims = verifySessionToken(token);
    const user = await findById(claims.sub);
    if (!user) return res.status(401).json({ error: 'User no longer exists.' });
    req.user  = user;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

/** Stricter variant: requires the user to also be flagged as admin. */
export async function requireAdmin(req, res, next) {
  await requireAuth(req, res, () => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ error: 'Admin access required.' });
    }
    next();
  });
}
