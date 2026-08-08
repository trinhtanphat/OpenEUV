# Deployment

OpenEUV is a client-side Vite + React + Three.js application. Production output is the `dist/` directory.

## Default: Cloudflare Workers Static Assets

The repository is configured for **manual deployment**. GitHub Actions is intentionally disabled, so pushing a commit does not deploy anything automatically.

```bash
npm install
npm run check
npm run deploy:cloudflare:dry
npm run deploy:cloudflare
```

`wrangler.jsonc` points Cloudflare Workers Static Assets at `./dist` and enables `single-page-application` fallback so client-side routes can return `index.html`.

Authentication is handled by Wrangler on the deployer's machine. Do not commit Cloudflare API tokens, account secrets or `.wrangler` credentials.

## V8 provenance-aware deployment guard

`npm run deploy:cloudflare` and `npm run deploy:cloudflare:dry` run `tools/manual-cloudflare-deploy.mjs`. The helper reads the exact 40-character `git rev-parse HEAD` value and passes it to build/deploy subprocesses only as `OPENEUV_COMMIT_SHA`. That makes the public build metadata identify the source commit without enabling GitHub Actions or copying arbitrary environment data into the app.

The helper refuses a dirty worktree by default because uncommitted files cannot be reproduced from the recorded commit:

```bash
npm run deploy:cloudflare
# Refuses when `git status --porcelain` is non-empty.
```

An operator can explicitly accept incomplete source provenance when there is a specific reason to deploy local changes:

```bash
npm run deploy:cloudflare -- --allow-dirty
```

That override is intentionally visible and should not be the normal release path.

### Dry run

```bash
npm run deploy:cloudflare:dry
```

Dry-run mode builds with the exact commit metadata and then runs `wrangler deploy --dry-run`. It does not publish a production deployment.

### Real deploy and repository gate

A normal real deployment runs the full repository gate first and publishes only after it passes:

```text
npm run check
npx wrangler deploy
```

Both commands receive `OPENEUV_COMMIT_SHA=<current full git SHA>` from the helper.

For exceptional operator-controlled recovery work, the check can be skipped explicitly:

```bash
npm run deploy:cloudflare -- --skip-check
```

With `--skip-check`, the helper still runs `npm run build` before `wrangler deploy`; it does not skip compilation. Document why this flag was needed when using it for a real deployment.

The helper logs mode, clean/dirty provenance state, short commit SHA and command names only. It does **not** dump `process.env`, Cloudflare tokens, Wrangler credentials or other environment secrets.

## Custom domain

After the first successful Workers deployment, attach a custom domain from the Cloudflare Workers dashboard. Domain routing is intentionally not hard-coded in the public repository because account and zone identifiers are deployment-specific.

## Vercel alternative

The repository also includes `vercel.json` for a Vite SPA deployment:

- framework: Vite;
- build command: `npm run build`;
- output directory: `dist`;
- official SPA catch-all rewrite: `/(.*)` → `/index.html`.

A newly imported Vercel project can use the checked-in configuration without adding a GitHub Actions workflow. Do not claim a live deployment URL until the target project has actually built and deployed the intended Git commit.

## GitHub Pages

GitHub Pages is not the default because this repository intentionally does not run GitHub Actions. It can still host a manually published `dist` artifact, but contributors should not reintroduce an automatic Actions workflow without an explicit project decision.

## Verification before manual production deploy

Run locally:

```bash
npm run check
npx playwright install chromium
npm run e2e
```

A deployment should be treated as unverified if these commands have not been run in the deploying environment. Tests remain in the repository even though GitHub Actions is disabled.

Renderer benchmark capture validation is included in `npm run check`; hardware benchmark collection itself remains manual and must not be replaced by emulated/fabricated results.

## Rollback

Keep deployments tied to Git commit SHAs. If a release is bad, check out the last known-good commit, rebuild, and run `npm run deploy:cloudflare` again (or redeploy that commit on Vercel). Avoid editing production assets directly in a dashboard because that breaks reproducibility.
