# OtangoPaper

A Canva-style document builder — resumes, cover letters, newsletters, certificates, college apps, business cards, postcards, LinkedIn banners, and portfolios — built with **React + Vite** on the front and **Express + Google OAuth** on the back.

## Quick start

```bash
# 1. Install both halves
npm install:all                  # installs frontend + ./server deps

# 2. Configure (one-time)
cp .env.example .env             # frontend
cp server/.env.example server/.env

#    Then fill in:
#      .env          → VITE_API_URL, VITE_GOOGLE_CLIENT_ID
#      server/.env   → GOOGLE_CLIENT_ID, JWT_SECRET, ALLOWED_ORIGIN
#
#    See server/README.md for how to get a Google OAuth Client ID
#    (≈ 5 minutes at console.cloud.google.com).

# 3. Run — separate terminals (or use a process manager)
npm run dev                       # frontend, http://localhost:5173
npm run dev:server                # backend,  http://localhost:4000
```

If you leave `VITE_API_URL` blank, the app runs in **offline / design mode** — the auth gate is bypassed and a stub user is used. Useful while iterating on UI.

## Authentication

Google sign-in only. The flow:

1. The login screen renders the official Google Identity Services button.
2. The user signs in with their Google account; Google returns an ID token (a JWT signed by Google).
3. The frontend POSTs that ID token to `POST /auth/google` on the Express server.
4. The server verifies the token via `google-auth-library`, upserts the user record, signs a *new* JWT with our own secret, and returns it.
5. The frontend stores the JWT in localStorage and sends it as `Authorization: Bearer …` on every subsequent request.

There's no email/password path — first sign-in IS registration. See [`server/README.md`](./server/README.md) for the full setup.

## Project structure

```
otango-app/
├── public/                         Static assets served as-is
├── server/                         Express backend (auth + JWT)
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── index.js                Express app
│       ├── config.js               Env vars (validated at boot)
│       ├── routes/auth.js          POST /auth/google · GET /auth/me · POST /auth/logout
│       ├── middleware/requireAuth.js
│       └── services/
│           ├── googleVerify.js     Verifies Google ID tokens
│           ├── jwt.js              Signs/verifies our session tokens
│           └── userStore.js        In-memory user table (swap for a DB)
└── src/
    ├── main.jsx                    React entry — mounts <App/>, wraps providers
    ├── App.jsx                     Top-level routing + auth gate
    ├── styles/
    │   ├── globals.css             Reset + base styles + animations
    │   └── theme.css               CSS custom properties (light/dark)
    ├── data/                       Static seed data (templates, fonts, defaults)
    ├── services/                   API / controller layer
    │   ├── api.js                  fetch wrapper, base URL, auth header
    │   ├── authService.js          googleLogin / me / logout
    │   ├── documentService.js      CRUD for user designs
    │   ├── templateService.js      list / get templates
    │   ├── aiService.js            AI fill (stub)
    │   └── exportService.js        PDF / PNG / Word / share-link export
    ├── context/                    Theme · Auth · Document · Toast
    ├── hooks/                      useTheme, useAuth, useDocument, useTemplates,
    │                               useLocalStorage, useDebounce, useMagicTool, useToast, useStarred
    ├── components/
    │   ├── auth/                   LoginScreen + GoogleSignInButton
    │   ├── common/                 Icon, EditableText, SkillChip, ImageCropper, PhotoUploadControl
    │   ├── layout/                 Topbar, Sidebar, NotificationsDropdown, TweaksPanel
    │   ├── onboarding/             First-run modal
    │   ├── dashboard/              Home screen
    │   ├── magic/                  Magic Tool wizard (9 categories)
    │   ├── editor/                 Editor + toolbar + right panel + modals
    │   ├── canvas/                 TemplateCanvas dispatcher + thumbnail
    │   │   └── templates/          One file per group of template-style renderers
    │   ├── templates/              Templates gallery screen
    │   ├── designs/                My designs screen
    │   ├── starred/                Starred templates screen
    │   ├── settings/               Settings screen
    │   └── profile/                Profile screen + tabs
    └── utils/                      Tiny pure utilities
```

## Architecture

**Auth gate.** When `VITE_API_URL` is set, `<App/>` checks `useAuth()` first: if the user is null, it renders `<LoginScreen/>` and nothing else. Only after a successful Google sign-in does the rest of the chrome (sidebar, dashboard, editor) render. When `VITE_API_URL` is blank, the gate is skipped — useful for design iteration.

**Data flow.** State lives in four React contexts:

- `ThemeContext` — dark/light + accent, persisted to localStorage.
- `AuthContext` — current user + login/logout, talking to `services/authService.js`.
- `DocumentContext` — active document (template, sections, person, font pair, accent), with undo/redo history and a `markDirty()` autosaver.
- `ToastContext` — global toast notifications.

Components subscribe via matching hooks (`useTheme`, `useAuth`, `useDocument`, `useToast`).

**Services layer.** Anything that hits a backend lives in `src/services/`. Each module is a thin controller around `api.js`'s `apiFetch()`. When the API URL is empty, services return seeded local data so the UI keeps working offline. To wire a new endpoint: add a method to the appropriate service, point `VITE_API_URL` at the backend, done.

**Templates.** Each visual template is a pure React component under `src/components/canvas/templates/`. `TemplateCanvas` is the dispatcher that picks the right renderer for a template `style`. Adding a template = drop a renderer in `templates/<group>.jsx`, register it in `templates/index.jsx`, append metadata to `data/templates.js`.

## Roadmap

- [x] Real auth (Google OAuth + JWT)
- [ ] Persistence — swap `server/src/services/userStore.js` for Postgres/SQLite
- [ ] Cloud document storage (`/documents` endpoints)
- [ ] Real AI fill (Claude / OpenAI passthrough on the server)
- [ ] Server-side PDF/PNG export pipeline
- [ ] Multi-user sharing + permissions
