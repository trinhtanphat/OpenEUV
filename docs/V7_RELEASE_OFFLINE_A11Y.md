# V7 release provenance, offline shell and accessibility QA

V7 improves portability and verification without re-enabling GitHub Actions or adding user telemetry.

## Public build provenance

Vite injects one small public build object:

- package version;
- optional short commit SHA;
- provenance source (`explicit`, `cloudflare`, `vercel`, or `unknown`).

Commit resolution order is:

1. `OPENEUV_COMMIT_SHA`
2. `CF_PAGES_COMMIT_SHA`
3. `VERCEL_GIT_COMMIT_SHA`
4. `unknown`

Only those recognized values are considered. The project does not expose the rest of the server environment to browser code.

The footer shows the public version/commit and research snapshot schema v2 records the same build provenance. This identifies the deployed public build; it is **not user telemetry**.

## Conservative read-only offline shell

Production builds register `/sw.js?v=<version>` as a module service worker. Vite development mode does not register it.

The service worker:

- handles same-origin successful `GET` resources only;
- ignores cross-origin requests, POST/other methods, `/api/` paths and requests carrying an Authorization header;
- does not cache responses marked `private` or `no-store`;
- uses network-first behavior so online users prefer the current public response;
- falls back to a cached response during network failure;
- keeps an OpenEUV-versioned cache namespace (`openeuv-readonly-<version>`);
- deletes older OpenEUV cache namespaces on activation without touching unrelated site caches;
- never caches external patent/source links.

The initial shell includes the root navigation response, web app manifest, original OpenEUV SVG icon and the canonical offline-policy module. Additional same-origin assets, public datasets and concept models are cached only after successful requests.

When a new package version is deployed, the service-worker URL/cache name changes. Reloading while online lets the new worker install/activate and old OpenEUV caches are removed.

Offline mode is read-only convenience after a successful visit; it does not promise that every public source link or never-before-viewed asset is available without network access.

## Accessibility regression contract

`npm run audit:a11y` statically checks key shell contracts:

- exactly one skip link targeting `#main-content`;
- exactly one main landmark with that ID;
- labeled global search input and listbox/option relationship;
- polite status live region for research snapshot feedback;
- reduced-motion CSS contract;
- duplicate literal IDs across the audited shell files.

This deterministic audit is included in repository preflight. It complements Playwright keyboard/reduced-motion tests but is **not a substitute** for screen-reader, zoom, contrast and other manual assistive-technology testing.

## Useful commands

```bash
npm run audit:a11y
npm run audit:a11y:json
npm run preflight
npm run check
npm run e2e
```

GitHub Actions remains intentionally disabled. A pushed commit is not automatically a verified build.
