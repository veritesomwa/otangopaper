// Password hashing helpers. We use bcryptjs (pure JS) so deploys don't need
// a native compile step. Cost factor 12 is the modern default — tune up to
// 14 if your hosting can afford it.

import bcrypt from 'bcryptjs';

const ROUNDS = 12;

export function hashPassword(plain) {
  return bcrypt.hash(plain, ROUNDS);
}

export function verifyPassword(plain, hash) {
  if (!hash) return Promise.resolve(false);
  return bcrypt.compare(plain, hash);
}
