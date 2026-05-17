# OtangoPaper API server

Tiny Express service that handles authentication for the OtangoPaper frontend.

**Auth model**: Google sign-in only. The browser uses Google Identity Services to obtain an ID token, sends it here, and we exchange it for our own signed JWT. No passwords, no per-app credentials. First sign-in creates the user record automatically.

## Quick start

```bash
cd server
cp .env.example .env       # then fill in GOOGLE_CLIENT_ID and JWT_SECRET
npm install
npm run dev                # http://localhost:4000
```

To generate a strong `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Google OAuth setup (one-time)

1. Open [console.cloud.google.com](https://console.cloud.google.com) and create / select a project.
2. APIs & Services → OAuth consent screen → configure as "External", app name "Otango".
3. APIs & Services → Credentials → "Create credentials" → "OAuth client ID":
   - Application type: **Web application**
   - Authorized JavaScript origins: `http://localhost:5173` (dev frontend), and your production origin later.
4. Copy the generated **Client ID** into both:
   - `server/.env`  → `GOOGLE_CLIENT_ID=…`
   - `.env` (root, for the frontend) → `VITE_GOOGLE_CLIENT_ID=…`

The same Client ID goes in both files — the frontend uses it to render the Google button, the backend uses it to verify the resulting credential.

## Routes

| Method | Path           | Auth | Description                                          |
|--------|----------------|------|------------------------------------------------------|
| GET    | `/health`      | —    | uptime probe                                         |
| POST   | `/auth/google` | —    | exchange a Google ID token for a session JWT         |
| GET    | `/auth/me`     | yes  | return the current user                              |
| POST   | `/auth/logout` | yes  | sign out (stateless — client just drops the token)   |

`/auth/google` body shape:

```json
{ "idToken": "<credential string from window.google.accounts.id>" }
```

Successful response:

```json
{
  "token": "eyJhbGciOi…",
  "user": {
    "id": "usr_abc123…",
    "email": "you@gmail.com",
    "name": "Your Name",
    "picture": "https://lh3.googleusercontent.com/…"
  }
}
```

The frontend persists `token` in localStorage and sends it as `Authorization: Bearer …` on every subsequent request.

## Project layout

```
server/
├── package.json
├── .env.example          ← copy to .env
└── src/
    ├── index.js          Express app + middleware setup
    ├── config.js         Env vars (validates required ones at boot)
    ├── routes/
    │   └── auth.js       /auth/google, /auth/me, /auth/logout
    ├── middleware/
    │   └── requireAuth.js  Bearer token → req.user
    └── services/
        ├── googleVerify.js  google-auth-library wrapper
        ├── jwt.js           sign / verify our session tokens
        └── userStore.js     in-memory user table (swap for a DB)
```

`userStore.js` is in-memory — it resets every time the server restarts. Replace it with Prisma / Drizzle / pg / Mongoose when you're ready; the rest of the codebase only depends on its three exports (`upsertGoogle`, `findById`, `publicProfile`).

## Production checklist

- [ ] Set a real `JWT_SECRET` (do not commit it).
- [ ] Add your production frontend origin to `ALLOWED_ORIGIN`.
- [ ] Replace `userStore.js` with a real database.
- [ ] Add a refresh-token / revocation list if you need server-side logout.
- [ ] Put the API behind HTTPS and set `Secure` cookies if you switch from Bearer to cookies.
