# OpenEUV

**A public-source, interactive engineering atlas for Extreme Ultraviolet (EUV) lithography.**

OpenEUV turns a very complex lithography ecosystem into an explorable browser project: original concept 3D geometry, exploded systems views, evidence-linked labels, an Assembly Explorer, a basic→advanced learning path, optics/physics learning labs, a public patent-family explorer, foundry/mask-lifecycle case studies, reviewable evidence records and explicit open unknowns.

> **Important:** OpenEUV is an independent educational/research project. It is not affiliated with ASML, ZEISS, TSMC, Samsung, Intel, Micron, SK hynix, Rapidus, imec or their partners. The reconstruction is conceptual and is **not** commercial CAD, a service manual, a production recipe, a fab blueprint or hazardous real-world operating guidance.

## What is implemented

### Interactive 3D atlas

- React + Three.js conceptual EUV scanner with orbit/zoom, subsystem selection and exploded view.
- Original source/collector, reticle and projection concept assets plus procedural fallback.
- V4 procedural illumination and vacuum/platform concept geometry with stable named nodes.
- Evidence-backed screen-space labels linked to Contextual Evidence.
- Guided camera tour and direct named-node highlighting.
- Adaptive `high / balanced / low` LOD that reduces pixel ratio, shadows, secondary geometry/detail and source animation on constrained devices without hiding evidence boundaries.
- Reproducible Python concept-asset generator; no proprietary CAD is required.

See [`docs/3D_V4_ILLUMINATION_VACUUM.md`](docs/3D_V4_ILLUMINATION_VACUUM.md).

### Assembly Explorer — systems view

The interactive Assembly Explorer connects:

`architecture → vacuum/platform → source → illumination → reticle → projection → stage/metrology → system integration`

V4 adds per-stage:

- shared evidence claim IDs;
- stable atlas node links when available;
- related lab/learning links;
- bilingual open research questions;
- explicit evidence/node gaps instead of invented detail.

See [`docs/ASSEMBLY_EXPLORER.md`](docs/ASSEMBLY_EXPLORER.md).

### Learning path L0 → L5

`L0 semiconductor foundations → L1 optics/NA/Fourier imaging → L2 EUV physics/multilayers → L3 scanner systems → L4 High-NA/image-quality concepts → L5 evidence/patent/computational research`

See [`docs/LEARNING_PATH.md`](docs/LEARNING_PATH.md).

### Physics & imaging workbench

- Low-NA **0.33** vs High-NA **0.55** educational comparison.
- High-NA **4× / 8× anamorphic** field visualization.
- Rayleigh-style resolution playground with independent numerical cross-checks.
- V4 normalized **Fourier imaging / circular-pupil MTF** learning lab.
- Complex-index, polarization-aware characteristic-matrix multilayer learning model.
- Built-in **CC0 Mo/Windt 1988** optical constants dataset pinned to a public upstream revision and containing the original 13.55 nm sample.
- Mask-3D shadowing intuition lab.
- Aberration/focus/leveling/overlay concept lab using normalized educational proxies.
- Six-degree-of-freedom wafer-stage visualization.

The labs are learning models, not commercial scanner/process predictors. See [`docs/FOURIER_IMAGING_LAB.md`](docs/FOURIER_IMAGING_LAB.md).

### Evidence, reviews & unknowns

| Class | Meaning |
| --- | --- |
| A | First-party public source |
| B | Published patent / public standard |
| C | Academic/public research |
| D | Public-source inference with written rationale |
| ? | Unknown / insufficient lawful evidence |

Review metadata supports `proposed → reviewed → superseded`, public contributor/reviewer handles and supersession links. Records without a real review remain **unreviewed**.

V4 adds a deterministic review queue and campaign-readiness report for real reviewers:

```bash
node tools/evidence-review-queue.mjs --limit 12
npm run evidence:review-report
npm run evidence:review-report:json
```

The queue/report never assigns reviewer identity or marks records reviewed. Readiness reports the genuine reviewed `current/10`, missing count and evidence-category coverage. See [`docs/EVIDENCE_REVIEW_CAMPAIGN.md`](docs/EVIDENCE_REVIEW_CAMPAIGN.md).

### Patent-family explorer

The curated patent map covers source, collector, illumination, reticle, projection, stage, metrology and vacuum-related disclosures with:

- family/priority/publication metadata;
- subsystem relationships;
- metadata completeness/provenance scoring;
- duplicate/conflicting-family audit tooling;
- original OpenEUV summaries and public links only.

A patent disclosure is evidence of a disclosed concept, **not** proof that a drawing equals production geometry.

### Fab & mask-lifecycle context

Machine-readable case studies use a single runtime source of truth: `evidence/fab-cases.json`.

Current first-party/public cases include:

- TSMC, Samsung, Intel, Micron, SK hynix and Rapidus EUV milestones;
- TSMC public EUV-mask dry-cleaning context;
- imec CNT-pellicle research context;
- ZEISS AIMS EUV mask-qualification context;
- source/collector contamination and reflective-mask/membrane research context.

Every case stores shared claim IDs, direct public source URLs, a **public boundary** and explicit unknowns. OpenEUV does not infer confidential recipes, private layer choices, yield, internal fab layouts, private acceptance thresholds or private process settings.

## Public data & provenance

The repository tracks claims, unknowns, reviews, fab cases, patent metadata, optical data and verified data gaps with explicit provenance.

The first checked-in measured optical dataset is Mo/Windt 1988 from the CC0 refractiveindex.info database.

The silicon-at-13.5-nm investigation is now a **verified data gap**, not an undocumented TODO. The pinned CC0 Si candidate `Franta-25C.yml` begins at 30.9963 nm and therefore cannot be used at 13.5 nm without unsupported extrapolation. Public EUV-range Si measurements/data access exist, but OpenEUV has not verified numerical-table redistribution rights suitable for checking those values into the repository. See [`docs/SILICON_OPTICAL_DATA_GAP.md`](docs/SILICON_OPTICAL_DATA_GAP.md) and `evidence/optical-data-gaps.json`.

OpenEUV therefore keeps silicon-like defaults illustrative instead of silently copying or extrapolating data.

## Run locally

```bash
npm install
npm run dev
```

Full local code/data/build gate:

```bash
npm run check
```

Current gate includes evidence/review validation, runtime fab-case validation, renderer-capture validation, unit tests, TypeScript typechecking and a production Vite build.

Browser verification:

```bash
npx playwright install chromium
npm run e2e
```

Regenerate concept assets:

```bash
python tools/generate-concept-assets.py all
```

## Deployment

**GitHub Actions is intentionally disabled.** A push does not automatically run CI or deploy production.

Manual Cloudflare Workers Static Assets path:

```bash
npm install
npm run check
npm run deploy:cloudflare:dry
npm run deploy:cloudflare
```

`wrangler.jsonc` serves `dist/` with SPA fallback.

The repository also includes `vercel.json` for a Vite SPA deployment. Do not claim a live deployment until the intended commit has actually built on the target hosting project.

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Contributor workflow

Structured GitHub Issue Forms are available for:

- public evidence/research;
- 3D/visual contributions;
- bug reports;
- real-device renderer benchmarks.

Blank issues are disabled so sourcing/privacy/evidence boundaries are visible before submission.

Suggested tracks:

| Track | Examples |
| --- | --- |
| `3d` | original concept geometry, named nodes, labels, LOD |
| `optics` | NA, Fourier/MTF, imaging and aberration learning tools |
| `physics` | multilayers, public optical data and reproducibility |
| `patent-research` | curated family metadata and provenance review |
| `fab` | first-party public integration/mask-lifecycle context |
| `evidence` | sourcing, real review, supersession and unknowns |
| `education` | Assembly Explorer and L0→L5 learning content |
| `i18n` | EN/VI and later language packs |
| `qa` | unit/browser/accessibility/manual deployment checks |
| `perf` | real-device WebGL/WebGPU measurements |

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`SOURCING_POLICY.md`](SOURCING_POLICY.md) first.

## Current open research dependencies

Most implementable V1–V4 software work from the current roadmap has landed. Two issues intentionally remain open because they require evidence outside this assistant/runtime:

- **#27 PERF:** at least 3 real paired WebGL/WebGPU captures across at least 2 actual laptop/mobile/desktop hardware classes. The method-v2 harness, schema, validator, analyzer and exact readiness report are implemented; synthetic/emulated numbers do not count.
- **#29 EVIDENCE:** at least 10 records reviewed by real human reviewers using real public handles. Queueing, validation and readiness reporting are implemented; generated/fake attribution does not count.

The silicon optical-data investigation (#28) is complete as a verified gap: no unsupported extrapolation or license-ambiguous table was vendored.

These external dependencies are research gaps, not placeholders that should be closed with invented data.

## Verification policy

Because GitHub Actions is disabled, repository changes are **not automatically verified by GitHub**. Before deployment or claiming a change is verified, run locally:

```bash
npm run check
npm run e2e
```

A commit that has only been pushed successfully must not be described as build/test verified.

## Sourcing boundary

Welcome: original models/diagrams, first-party public sources, public patent metadata, public academic metadata, lawfully redistributable datasets, reproducible educational simulations, translations and tests.

Not accepted: stolen/hacked documents, leaked confidential/trade-secret material, unauthorized proprietary CAD/service manuals, private process recipes, credentials or unverifiable anonymous leaks.

The project goal is to see **how far a rigorous open community can reconstruct and teach the system from lawful evidence while keeping known, inferred, illustrative and unknown states visible**.

## License

Code and original OpenEUV assets are MIT licensed unless a file states otherwise. Third-party papers, patents, images and upstream datasets retain their own rights/licensing; prefer metadata + links + original reconstruction over copying protected source material into the repository.
