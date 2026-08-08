# OpenEUV

**A public-source, interactive engineering atlas for Extreme Ultraviolet (EUV) lithography.**

OpenEUV combines original conceptual 3D geometry, evidence-linked labels, systems/assembly learning, optics and physics labs, patent-family research, foundry/mask-lifecycle context, provenance tooling, bilingual learning and explicit unknowns.

> **Boundary:** OpenEUV is an independent educational/research project. It is not commercial CAD, a service manual, a production recipe, a fab blueprint or hazardous equipment operating guidance. Unsupported/private details remain unknown instead of being guessed.

## V7 highlights — release provenance, offline portability and accessibility QA

- **Public build provenance:** Vite injects package version plus an optional short commit SHA from explicit/Cloudflare/Vercel public deployment metadata only.
- **Visible build identity:** the footer shows `version · commit`; `unknown` is displayed when the host does not provide a valid SHA.
- **Research snapshot schema v2:** browser/CLI snapshots include the same public build metadata while continuing to strip client/private fields.
- **Conservative production-only offline shell:** same-origin GET resources use network-first caching with versioned OpenEUV cache names; cross-origin, `/api/`, Authorization, `private` and `no-store` content are not cached.
- **PWA metadata:** web manifest + original OpenEUV SVG icon.
- **Static accessibility contract:** `npm run audit:a11y` protects skip-link/main/search/live-region/reduced-motion/unique-ID shell contracts and is wired into preflight.
- **Development stays uncached:** Vite dev mode never registers the production service worker.

See [`docs/V7_RELEASE_OFFLINE_A11Y.md`](docs/V7_RELEASE_OFFLINE_A11Y.md).

## Existing atlas and research system

### Interactive 3D atlas

- React + Three.js conceptual EUV scanner with orbit/zoom, exploded view and subsystem selection.
- Original source/collector, reticle and projection concept assets plus procedural fallbacks.
- Procedural illumination and vacuum/platform concept geometry with stable named nodes.
- Evidence-backed screen-space labels, guided tour and named-node highlighting.
- Adaptive `high / balanced / low` LOD for constrained devices.
- Reproducible original concept-asset generator; no proprietary CAD is required.

### Assembly Explorer and L0→L5 learning

The systems-learning path connects:

`architecture → vacuum/platform → source → illumination → reticle → projection → stage/metrology → integration`

and

`L0 semiconductor foundations → L1 optics/NA/Fourier imaging → L2 EUV physics/multilayers → L3 scanner systems → L4 High-NA/image quality → L5 evidence/patent/computational research`.

Each level has an EN/VI evidence-aware checkpoint. Answers stay only in current page state and are not uploaded or persisted.

### Physics and imaging labs

- Low-NA **0.33** vs High-NA **0.55**.
- High-NA **4× / 8× anamorphic** field learning model.
- Rayleigh-style resolution playground.
- Fourier/circular-pupil MTF model.
- Mirror/vacuum intuition model.
- Polarization-aware multilayer characteristic-matrix model.
- Built-in **CC0 Mo/Windt 1988** optical constants with pinned provenance.
- Mask-3D, aberration/focus/overlay and 6-DoF wafer-stage educational visualizations.

These are learning models, not production scanner/process predictors.

### Search, evidence and provenance

Global Atlas Search is local-only and supports claim/patent IDs, organizations, subsystems, EN/VI terms, deep links and keyboard navigation.

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
npm run provenance:report
npm run provenance:report:json
npm run audit:integrity
npm run audit:a11y
npm run preflight
npm run evidence:review-report
npm run research:snapshot -- --generated-at 2026-08-08T12:00:00.000Z > openeuv-research-snapshot.json
```

The in-browser provenance overview reuses the same summary logic as the CLI and can copy/download a privacy-safe public research snapshot locally.

### Patents, fab context and public data

The curated patent map covers source, collector, illumination, reticle, projection, stage, metrology and vacuum-related disclosures with family metadata, original summaries and completeness/conflict auditing.

Fab/mask-lifecycle cases use `evidence/fab-cases.json` as source of truth and include first-party/public milestones from TSMC, Samsung, Intel, Micron, SK hynix, Rapidus, imec and ZEISS-related context where cited. Every case states its public boundary and explicit unknowns.

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

`npm run check` runs unified preflight, unit tests, TypeScript typecheck and production Vite build. Preflight covers evidence/reviews, fab cases, renderer-capture validity, cross-dataset integrity, provenance coverage, accessibility contracts, manifest paths, learning checkpoints, required documentation and the policy that GitHub Actions stays disabled.

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
npm run check
npm run deploy:cloudflare:dry
npm run deploy:cloudflare
```

The repository also contains `vercel.json` for a Vite SPA deployment. Production builds register the read-only offline shell; development builds do not.

Recognized optional public commit variables are:

```text
OPENEUV_COMMIT_SHA
CF_PAGES_COMMIT_SHA
VERCEL_GIT_COMMIT_SHA
```

No other server environment variables are exposed by the build-provenance feature.

## Current open external dependencies

Implementable V1→V7 software work on the current roadmap has landed. Two issues remain intentionally open because they need evidence outside this runtime:

- **#27 PERF:** at least 3 real paired WebGL/WebGPU captures across at least 2 actual hardware classes. Synthetic/headless/emulated values do not count.
- **#29 EVIDENCE:** at least 10 records reviewed by real human reviewers using real public handles. Generated/fake attribution does not count.

## Verification policy

Because GitHub Actions is disabled, a successful push is **not** proof that a build/test passed. Before deployment or a verified claim, run:

```bash
npm run check
npm run e2e
```

## Sourcing boundary

Welcome: original models/diagrams, first-party public sources, public patent/academic metadata, lawfully redistributable datasets, reproducible educational simulations, translations and tests.

Not accepted: stolen/hacked documents, confidential/trade-secret leaks, unauthorized proprietary CAD/service manuals, private process recipes, credentials or unverifiable anonymous claims.

Read [`CONTRIBUTING.md`](CONTRIBUTING.md), [`SOURCING_POLICY.md`](SOURCING_POLICY.md), [`ROADMAP.md`](ROADMAP.md) and [`docs/V7_RELEASE_OFFLINE_A11Y.md`](docs/V7_RELEASE_OFFLINE_A11Y.md).

## License

Code and original OpenEUV assets are MIT licensed unless a file states otherwise. Third-party sources retain their own rights/licensing; prefer metadata + links + original reconstruction over copying protected source material into the repository.
