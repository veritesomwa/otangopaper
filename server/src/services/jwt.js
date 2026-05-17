// Sign + verify the JWTs we hand out to authenticated clients. The token
// payload is intentionally minimal — { sub: userId } — so revocation is just
// "drop the user".

import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function signSessionToken(userId) {
  return jwt.sign({ sub: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
    issuer:    'otango',
  });
}

export function verifySessionToken(token) {
  return jwt.verify(token, config.jwtSecret, { issuer: 'otango' });
}
