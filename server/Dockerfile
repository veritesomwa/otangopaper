# Multi-stage Dockerfile for the OtangoPaper API server.
#
# Build:   docker build -t otangopaper-api .
# Run:     docker run --rm -p 4000:4000 --env-file .env otangopaper-api
#
# The first stage installs dev-deps (esbuild) and produces a bundled artefact.
# The runtime stage copies just node_modules (prod-only) and the bundle.

# ── Stage 1: build ────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Install all deps (build needs esbuild) — copy lockfile if you have one for
# reproducible installs.
COPY package*.json ./
RUN npm install --no-audit --no-fund

# Copy sources and bundle.
COPY . .
RUN npm run build

# ── Stage 2: runtime ──────────────────────────────────────────────────────
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

# Install prod-only deps so we don't ship esbuild to production.
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Copy the bundled server out of the build stage.
COPY --from=build /app/dist ./dist

# Run as the unprivileged `node` user that comes with the image.
USER node

EXPOSE 4000
CMD ["node", "dist/server.js"]
