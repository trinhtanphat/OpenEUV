# V8 research operations

V8 improves how OpenEUV is deployed, sourced, inspected and compared while preserving the project boundary: lawful public metadata, original summaries and conceptual educational models only.

GitHub Actions remains intentionally disabled. V8 does not add an automatic deployment workflow.

## Provenance-aware manual deployment

The Cloudflare scripts now use `tools/manual-cloudflare-deploy.mjs`:

```bash
npm run deploy:cloudflare:dry
npm run deploy:cloudflare
```

The helper reads the full current Git commit, passes only that public identifier as `OPENEUV_COMMIT_SHA`, and blocks a dirty worktree by default. A real deployment runs `npm run check` before `wrangler deploy`; `--skip-check` is an explicit recovery override and still performs a production build. `--allow-dirty` explicitly accepts incomplete source provenance and should not be the normal release path.

See `docs/DEPLOYMENT.md` for operator details.

## Derived Source Library

`#source-library` is not a new manually maintained source database. It is derived from the existing evidence claims, fab-case source URLs and curated patent metadata through `src/lib/sourceLibrary.mjs`.

It lets contributors filter public sources by:

- source domain;
- organization;
- evidence class;
- usage type (`evidence`, `fab-case`, `patent`);
- free-text matches including stable record IDs.

Each source links back to the OpenEUV records that explicitly use it. Counts are bookkeeping, not a source-quality or commercial-importance score.

The citation audit is local and deterministic:

```bash
npm run audit:sources
npm run audit:sources:json
```

Malformed/non-HTTP(S) source URLs and missing evidence-source labels are structural errors. Multiple display labels for one normalized public URL are reported as warnings because legitimate contextual aliases can exist.

## Curated Literature Explorer

`evidence/literature.json` is the machine-readable academic registry. It stores metadata and original OpenEUV summaries only; OpenEUV does not copy full papers into the repository.

Each record can contain:

- DOI, title, year and authors;
- public source URL/name;
- publication type (`journal`, `conference`, `preprint`);
- topics;
- explicit claim IDs and learning-lab IDs.

The Literature Explorer renders the same registry and Atlas Search indexes DOI/title/author/topic/claim/lab fields. Preprints and conference papers stay explicitly labeled and are not treated as proof of a production scanner/process implementation.

Validate locally:

```bash
npm run validate:literature
```

## Research snapshot verify and diff

Research snapshots are public metadata bundles, not secret scanner/process packages. Snapshot schema v2 includes public build provenance while retaining the privacy filter from V6/V7.

Create a reproducible snapshot by supplying the timestamp explicitly:

```bash
npm run research:snapshot -- --generated-at 2026-08-08T12:00:00.000Z > snapshot.json
```

Validate a snapshot:

```bash
npm run research:snapshot:verify -- snapshot.json
npm run research:snapshot:verify -- snapshot.json --json
```

Compare two snapshots:

```bash
npm run research:snapshot:diff -- before.json after.json
npm run research:snapshot:diff -- before.json after.json --json
```

The diff compares claims, unknowns, fab cases and dataset manifest entries by stable ID. It also reports build/review/provenance metadata changes separately. A `generatedAt`-only difference does **not** count as research-content change. Invalid or privacy-unsafe snapshots are refused before comparison.

The diff is intentionally syntactic/canonical metadata comparison. It does not infer semantic equivalence between differently worded research claims.

## Local gate

V8 adds literature and source-citation validation to repository preflight. Before claiming a build verified:

```bash
npm install
npm run check
npx playwright install chromium
npm run e2e
```

A successful GitHub push is not proof that these commands passed. Because GitHub Actions is disabled, report exactly which checks were actually executed in the deploying or contributor environment.

## External-only work remains external

V8 does not fabricate evidence for the two persistent external dependencies:

- issue #27 still requires real paired WebGL/WebGPU captures on actual hardware;
- issue #29 still requires real human review work with genuine public reviewer handles.

Synthetic hardware results and generated reviewer identities do not satisfy those issues.
