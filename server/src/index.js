// OtangoPaper API server — Express, MongoDB, Google sign-in + email/password auth.
//
// Routes:
//   GET    /health         — uptime check
//   POST   /auth/register  — create email/password account
//   POST   /auth/login     — log in with email/password
//   POST   /auth/google    — exchange Google ID token for session JWT
//   GET    /auth/me        — current user (auth required)
//   POST   /auth/logout    — sign out (auth required)

import express from 'express';
import cors    from 'cors';
import { config }       from './config.js';
import { connectMongo } from './services/db.js';
import { authRouter }   from './routes/auth.js';

async function main() {
  // 1. Connect to MongoDB before binding the port — fail fast if it's unreachable.
  await connectMongo();

  // 2. Build the Express app
  const app = express();

  app.use(cors({ origin: config.allowedOrigins, credentials: true }));
  app.use(express.json({ limit: '256kb' }));

  // Tiny request logger — swap for pino/winston when needed.
  app.use((req, res, next) => {
    const t = Date.now();
    process.stdout.write(`→ ${req.method} ${req.url}\n`);
    res.on('finish', () => {
      process.stdout.write(`← ${req.method} ${req.url} ${res.statusCode} ${Date.now() - t}ms\n`);
    });
    next();
  });

  app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

  app.use('/auth', authRouter);

  // 404 + error fallthrough
  app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  });

  // 3. Start listening
  app.listen(config.port, () => {
    console.log(`✓ OtangoPaper API ready → http://localhost:${config.port}`);
    console.log(`  CORS allowed origins: ${config.allowedOrigins.join(', ')}`);
    if (config.adminEmails.length > 0) {
      console.log(`  Admin emails: ${config.adminEmails.join(', ')}`);
    }
  });
}

main().catch((err) => {
  console.error('Failed to start OtangoPaper API:', err);
  process.exit(1);
});
