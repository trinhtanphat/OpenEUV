# OpenEUV

**A public-source, interactive engineering atlas for Extreme Ultraviolet (EUV) lithography.**

OpenEUV combines original conceptual 3D geometry, evidence-linked labels, systems/assembly learning, optics and physics labs, patent-family research, curated academic literature, foundry/mask-lifecycle context, provenance tooling, bilingual learning and explicit unknowns.

> **Boundary:** OpenEUV is an independent educational/research project. It is not commercial CAD, a service manual, a production recipe, a fab blueprint or hazardous equipment operating guide. Unsupported/private detail stays unknown instead of being guessed.

## V9 highlights — bibliography handoff and bilingual QA

- **Deterministic literature citation export** derived directly from `evidence/literature.json` in BibTeX or CSL-JSON form.
- **No fabricated bibliography fields:** export preserves stored DOI/title/year/authors/public URL/publication type and does not invent publisher/volume/pages.
- **Stable citation keys:** normalized first-author token + year + DOI-derived hash, with deterministic collision suffixes.
- **Filtered browser export:** Literature Explorer can copy BibTeX or download CSL-JSON for the papers currently visible after filters/search.
- **Local CLI export:** `npm run literature:export -- --format bibtex|csl-json` with optional `--output`.
- **EN/VI structural coverage audit:** `npm run audit:i18n` checks the canonical UI dictionary, L0→L5 learning structure and bilingual checkpoint data for missing/empty/placeholder pairs.
- **Preflight integration:** the EN/VI coverage audit is part of the local repository gate.

A structural translation pass is **not** a claim of native-speaker/domain-expert linguistic review. See [`docs/V9_BIBLIO_I18N.md`](docs/V9_BIBLIO_I18N.md).

## V8 research operations retained

- provenance-aware manual Cloudflare deployment with exact Git HEAD and dirty-tree guard;
- derived Source Library with source→evidence/fab/patent usage links;
- citation-consistency audit;
- curated Literature Explorer and DOI-aware Atlas Search;
- privacy-safe research snapshot verify/diff tooling;
- literature/source checks in repository preflight.

See [`docs/V8_RESEARCH_OPERATIONS.md`](docs/V8_RESEARCH_OPERATIONS.md) and [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## V7 release/offline/accessibility foundation retained

- public build version/commit provenance in the footer and research snapshot;
- conservative production-only, same-origin GET, network-first offline shell;
- PWA manifest + original icon;
- static accessibility contract audit;
- Vite development mode never registers the production service worker.

See [`docs/V7_RELEASE_OFFLINE_A11Y.md`](docs/V7_RELEASE_OFFLINE_A11Y.md).

## Atlas and learning system

### Interactive 3D atlas

- React + Three.js conceptual EUV scanner with orbit/zoom, exploded view and subsystem selection.
- Original source/collector, reticle and projection concept assets plus procedural fallbacks.
- Procedural illumination and vacuum/platform concept geometry with stable named nodes.
- Evidence-backed labels, guided tour and named-node highlighting.
- Adaptive `high / balanced / low` LOD.
- Reproducible original concept-asset generator; no proprietary CAD required.

### Assembly Explorer and L0→L5

Systems learning connects:

`architecture → vacuum/platform → source → illumination → reticle → projection → stage/metrology → integration`

and

`L0 semiconductor foundations → L1 optics/NA/Fourier → L2 EUV physics/multilayers → L3 scanner systems → L4 High-NA/image quality → L5 evidence/patent/computational research`.

Each level has an EN/VI evidence-aware checkpoint. Answers remain in current page state and are not uploaded or persisted.

### Physics and imaging labs

- Low-NA **0.33** vs High-NA **0.55**;
- High-NA **4× / 8× anamorphic** field model;
- Rayleigh-style resolution;
- Fourier/circular-pupil MTF;
- mirror/vacuum intuition;
- polarization-aware multilayer characteristic-matrix model;
- built-in **CC0 Mo/Windt 1988** optical constants with pinned provenance;
- mask-3D, aberration/focus/overlay and 6-DoF wafer-stage educational visualizations.

These are learning models, not production scanner/process predictors.

## Search, sources, literature, evidence and provenance

Global Atlas Search is local-only and supports claim/patent/DOI IDs, organizations, authors, subsystems, EN/VI terms, deep links and keyboard navigation.

Evidence classes remain explicit:

| Class | Meaning |
| --- | --- |
| A | First-party public source |
| B | Published patent / public standard |
| C | Academic/public research |
| D | Public-source inference with written rationale |
| ? | Unknown / insufficient lawful evidence |

Review lifecycle is `proposed → reviewed → superseded`; records without real review remain **unreviewed**.

Useful commands:

```bash
npm run audit:integrity
npm run audit:a11y
npm run audit:sources
npm run audit:i18n
npm run validate:literature
npm run provenance:report
npm run evidence:review-report
npm run literature:export -- --format bibtex
npm run literature:export -- --format csl-json --output openeuv-literature.csl.json
npm run research:snapshot -- --generated-at 2026-08-08T12:00:00.000Z > snapshot.json
npm run research:snapshot:verify -- snapshot.json
npm run research:snapshot:diff -- before.json after.json
npm run preflight
```

The Source Library, Literature Explorer and bibliography exports are derived from canonical repository data rather than separate duplicate factual registries.

## Patents, fab context and public data

The curated patent map covers source, collector, illumination, reticle, projection, stage, metrology and vacuum-related disclosures with family metadata, original summaries and completeness/conflict auditing.

Fab/mask-lifecycle cases use `evidence/fab-cases.json` as source of truth and keep direct public sources, public boundaries and explicit unknowns.

The silicon-at-13.5-nm investigation is a **verified data gap**: OpenEUV does not extrapolate the out-of-range CC0 Si candidate or copy a numerical table without verified redistribution rights.

## Run locally

```bash
npm install
npm run dev
```

Repository gate:

```bash
npm run check
```

`npm run check` runs unified preflight, unit tests, TypeScript typecheck and the production Vite build. Preflight covers evidence/reviews, fab cases, literature, source citations, renderer captures, cross-dataset integrity, provenance, learning checkpoints, accessibility, EN/VI structural coverage, dataset paths, required docs and the policy that GitHub Actions remains disabled.

Browser verification:

```bash
npx playwright install chromium
npm run e2e
```

## Deployment

**GitHub Actions is intentionally disabled.** Pushes do not automatically run CI or deploy.

Cloudflare Workers Static Assets:

```bash
npm install
npm run deploy:cloudflare:dry
npm run deploy:cloudflare
```

The guarded helper supplies exact public Git commit provenance to the build and refuses a dirty worktree by default. `--allow-dirty` and `--skip-check` are explicit operator overrides documented in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

The repository also contains `vercel.json` for a Vite SPA deployment.

## Current open external dependencies

Implementable V1→V9 software work on the current roadmap has landed. Two issues remain intentionally open because they need evidence outside this runtime:

- **#27 PERF:** at least 3 real paired WebGL/WebGPU captures across at least 2 actual hardware classes. Synthetic/headless/emulated values do not count.
- **#29 EVIDENCE:** at least 10 records reviewed by real human reviewers using real public handles. Generated/fake attribution does not count.

## Verification policy

Because GitHub Actions is disabled, a successful push is **not** proof that a build/test passed. Before deployment or claiming verification, run:

```bash
npm run check
npm run e2e
```

## Sourcing boundary

Welcome: original models/diagrams, first-party public sources, public patent/academic metadata, lawfully redistributable datasets, reproducible educational simulations, translations and tests.

Not accepted: stolen/hacked documents, confidential/trade-secret leaks, unauthorized proprietary CAD/service manuals, private process recipes, credentials or unverifiable anonymous claims.

Read [`CONTRIBUTING.md`](CONTRIBUTING.md), [`SOURCING_POLICY.md`](SOURCING_POLICY.md), [`ROADMAP.md`](ROADMAP.md), [`docs/V8_RESEARCH_OPERATIONS.md`](docs/V8_RESEARCH_OPERATIONS.md) and [`docs/V9_BIBLIO_I18N.md`](docs/V9_BIBLIO_I18N.md).

## License

Code and original OpenEUV assets are MIT licensed unless a file states otherwise. Third-party sources retain their own rights/licensing; prefer metadata + links + original reconstruction over copying protected source material into the repository.
