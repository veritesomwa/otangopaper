// Production build for the OtangoPaper API server.
//
// What it does:
//   - Bundles every file under src/ into a single dist/server.js
//   - Targets Node 18 (the LTS your hosts most likely support)
//   - Keeps node_modules external so the bundle stays small and packages with
//     native code (bcrypt, mongoose) keep working
//   - Outputs ESM (matches package.json "type": "module")
//   - Minifies and emits a source map
//
// Run with:   npm run build
// Then run:   npm run start:prod
//
// Replace this script with esbuild's CLI if you prsefer:
//   esbuild src/index.js --bundle --platform=node --target=node18 \
//     --format=esm --packages=external --outfile=dist/servers.js \
//     --minify --sourcemap

import { build } from "esbuild"
import { rm } from "node:fs/promises"
import { existsSync } from "node:fs"

const outdir = "dist"

if (existsSync(outdir)) {
  await rm(outdir, { recursive: true, force: true })
}

const result = await build({
  entryPoints: ["src/index.js"],
  outfile: `${outdir}/server.js`,
  bundle: true,
  platform: "node",
  target: "node18",
  format: "esm",
  // Keep deps external — they live in node_modules at runtime. Bundling
  // packages with native bindings (bcrypt-style) is fragile; this also keeps
  // the artefact tiny.
  packages: "external",
  minify: true,
  sourcemap: true,
  legalComments: "none",
  logLevel: "info",
  // Add a shebang so the file is directly runnable too: `./dist/server.js`
  banner: {
    js: "#!/usr/bin/env node\n",
  },
})

if (result.errors?.length) {
  console.error(result.errors)
  process.exit(1)
}

console.log(`✓ Built ${outdir}/server.js`)
