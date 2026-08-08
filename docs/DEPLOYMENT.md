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

## Custom domain

After the first successful Workers deployment, attach a custom domain from the Cloudflare Workers dashboard. Domain routing is intentionally not hard-coded in the public repository because account and zone identifiers are deployment-specific.

## Vercel alternative

The repository also includes `vercel.json` for a Vite SPA deployment:

- framework: Vite;
- build command: `npm run build`;
- output directory: `dist`;
- official SPA catch-all rewrite: `/(.*)` → `/index.html`.

This means a newly imported Vercel project can use the checked-in configuration without adding a GitHub Actions workflow.

The currently connected Vercel account does not yet contain an OpenEUV project, so a live Vercel URL is not claimed until the repository is explicitly imported/created there.

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
