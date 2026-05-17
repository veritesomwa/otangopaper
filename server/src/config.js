// Centralised environment config. Anything that depends on env vars should
// read from here so the rest of the code stays import-clean.

import 'dotenv/config';

function required(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`✗ Missing required env var: ${name}`);
    console.error(`  Copy server/.env.example → server/.env and fill it in.`);
    process.exit(1);
  }
  return v;
}

export const config = {
  port:            parseInt(process.env.PORT || '4000', 10),
  allowedOrigins:  (process.env.ALLOWED_ORIGIN || 'http://localhost:5173')
                     .split(',').map((s) => s.trim()).filter(Boolean),
  googleClientId:  required('GOOGLE_CLIENT_ID'),
  jwtSecret:       required('JWT_SECRET'),
  jwtExpiresIn:    process.env.JWT_EXPIRES_IN || '30d',

  // MongoDB
  mongoUri:        required('MONGO_URI'),

  // Comma-separated list of email addresses that should be granted admin
  // privileges automatically the first time they sign in.
  adminEmails:     (process.env.ADMIN_EMAILS || '')
                     .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean),
};
