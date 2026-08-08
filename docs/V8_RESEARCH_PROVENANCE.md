# V8 — Research provenance, source inspection and literature

V8 strengthens OpenEUV as a reproducible public-source engineering/learning atlas. It does not add proprietary scanner CAD, private service material or fab recipes. Public metadata is linked and auditable; unsupported detail remains a gap.

## 1. Provenance-aware manual deployment

Cloudflare deployment now goes through `tools/manual-cloudflare-deploy.mjs` via:

```bash
npm run deploy:cloudflare:dry
npm run deploy:cloudflare
```

The helper records the exact current Git commit through `OPENEUV_COMMIT_SHA`, refuses a dirty worktree by default, and runs the repository gate before a real deploy. `--allow-dirty` and `--skip-check` are explicit operator overrides. See `docs/DEPLOYMENT.md` for the full safety contract.

GitHub Actions remains intentionally disabled.

## 2. Derived Source Library

`src/lib/sourceLibrary.mjs` derives a unique source view from the existing claims, fab-case and patent metadata. There is no second factual source registry.

The in-browser `SourceLibrary` supports local filtering/search across source domain, organization/label text, usage type and evidence class. Each source links back to the evidence, fab case or patent records that currently use it. Counts are bookkeeping only; they are not a quality or importance ranking.

Repository citation consistency can be checked with:

```bash
npm run audit:sources
npm run audit:sources:json
```

The audit checks public URL shape/protocol, missing labels where applicable and inconsistent labels attached to the same normalized URL. The same audit is included in repository preflight.

## 3. Local research snapshot verification and diff

Research snapshots remain local JSON artifacts. The V8 inspection CLI never uploads a snapshot or performs a network request.

Generate a snapshot using the existing reproducible snapshot command and an explicit timestamp as required by that command. Then verify a saved file:

```bash
npm run research:snapshot:verify -- path/to/snapshot.json
npm run research:snapshot:verify -- path/to/snapshot.json --json
```

Verification uses the canonical snapshot validator and reports schema version, generated-at, public build version/commit and record counts. Malformed or privacy-unsafe snapshots fail validation.

Compare two valid snapshots:

```bash
npm run research:snapshot:diff -- before.json after.json
npm run research:snapshot:diff -- before.json after.json --json
```

The deterministic diff compares canonical public metadata by stable claim IDs, unknown IDs, fab-case IDs and dataset IDs. It reports added, removed and changed records plus build-provenance and coverage changes. A generated-at-only difference is reported as a timestamp-only change and is **not** research-content change. The tool does not guess semantic equivalence: a record is changed when its canonical public metadata differs.

## 4. Curated academic Literature Explorer

`evidence/literature.json` is a curated metadata registry. Records contain DOI, title, year, authors, public source name/URL, publication type, topics, optional claim/lab links and an original OpenEUV summary. Full paper text is not copied into the repository.

Structural validation is available with:

```bash
npm run validate:literature
```

The validator checks record structure, DOI and public URL shape, allowed topics/publication types, duplicate DOI handling and linked claim/lab identities. Literature validation is included in repository preflight.

The browser Literature Explorer provides local query, topic and publication-type filters, DOI/source links, and deep links to mapped claims/labs. Publication type remains visible so a preprint or conference paper cannot silently appear as stronger evidence than its metadata supports. Academic proposals/models are research context, not proof of a production scanner or private fab implementation.

Literature is also indexed in the global Atlas Search and registered as `academic-literature` in `datasets/manifest.json` with redistribution/provenance boundaries.

## 5. V8 verification commands

Run the repository-local gate before claiming a verified V8 build:

```bash
npm install
npm run check
npx playwright install chromium
npm run e2e
```

Useful focused commands:

```bash
npm run validate:literature
npm run audit:sources
npm run preflight
npm test
npm run typecheck
npm run build
```

A GitHub commit alone is not build proof because automated GitHub Actions are intentionally disabled. Browser E2E verification requires a local Playwright/Chromium environment.

## 6. Remaining external-only work

V8 does not change the evidence boundary on these existing tasks:

- **#27 renderer measurements:** closure still requires real WebGL/WebGPU measurements from real device classes. Synthetic/headless measurements are not substitutes.
- **#29 evidence-review campaign:** closure still requires real human reviewers checking cited public sources. Generated reviewer identities or synthetic review records are not acceptable.
