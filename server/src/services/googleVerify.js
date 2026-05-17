// Verifies Google-issued ID tokens against Google's signing keys.
//
// The frontend uses Google Identity Services to obtain a `credential` (an ID
// token JWT signed by Google). We verify it server-side — never trust a
// client-supplied claim — and pull the basic profile out.

import { OAuth2Client } from 'google-auth-library';
import { config } from '../config.js';

const client = new OAuth2Client(config.googleClientId);

/**
 * Verify a Google ID token. Throws if invalid; returns a plain profile
 * object on success.
 */
export async function verifyGoogleIdToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: config.googleClientId,
  });
  const payload = ticket.getPayload();
  if (!payload?.sub) throw new Error('Invalid Google credential');

  return {
    sub:        payload.sub,
    email:      payload.email,
    emailVerified: payload.email_verified,
    name:       payload.name || '',
    givenName:  payload.given_name || '',
    familyName: payload.family_name || '',
    picture:    payload.picture || '',
    locale:     payload.locale || '',
  };
}
