# OpenEUV

**A public-source, interactive engineering atlas for Extreme Ultraviolet (EUV) lithography.**

OpenEUV turns a complex lithography ecosystem into an explorable browser project: original concept 3D geometry, evidence-linked labels, an Assembly Explorer, L0→L5 learning, optics/physics labs, global atlas search, patent-family research, fab/mask-lifecycle case studies, provenance/review tooling and explicit unknowns.

> **Important:** OpenEUV is an independent educational/research project. It is not affiliated with ASML, ZEISS, TSMC, Samsung, Intel, Micron, SK hynix, Rapidus, imec or their partners. The reconstruction is conceptual and is **not** commercial CAD, a service manual, a production recipe, a fab blueprint or hazardous real-world operating guidance.

## V5 highlights

V5 connects the existing atlas into a more usable research/learning system:

- **Global local-only search** across subsystems, evidence/unknowns, patents, fab cases, Assembly stages, L0→L5 levels, labs and glossary.
- **Evidence provenance trace** from a claim to explicit 3D-node, Assembly and fab-case usages.
- **Provenance coverage report** in human-readable and JSON form, including evidence class/component/source/review coverage, patent completeness, fab sources and license/data gaps.
- **Unified repository preflight + cross-dataset integrity audit** used by `npm run check`.
- **Mirror/vacuum concept lab** explaining the public reason EUV uses reflective optics and a controlled vacuum path with normalized educational controls only.
- **Evidence-aware L0→L5 checkpoints** in EN/VI, with session-only progress and no accounts, analytics or answer persistence.
- **Robust patent-source parser** used by provenance tooling so TypeScript formatting cannot silently erase patent coverage.

See [`ROADMAP.md`](ROADMAP.md), [`docs/PROVENANCE_COVERAGE_REPORT.md`](docs/PROVENANCE_COVERAGE_REPORT.md) and [`docs/LEARNING_CHECKPOINTS.md`](docs/LEARNING_CHECKPOINTS.md).

## Interactive 3D atlas

- React + Three.js conceptual EUV scanner with orbit/zoom, subsystem selection and exploded view.
- Original source/collector, reticle and projection concept assets plus procedural fallback.
- V4 procedural illumination and vacuum/platform concept geometry with stable named nodes.
- Evidence-backed screen-space labels linked to Contextual Evidence.
- Guided camera tour and direct named-node highlighting.
- Adaptive `high / balanced / low` LOD for constrained devices without hiding evidence boundaries.
- Reproducible Python concept-asset generator; no proprietary CAD is required.

See [`docs/3D_V4_ILLUMINATION_VACUUM.md`](docs/3D_V4_ILLUMINATION_VACUUM.md).

## Assembly Explorer & L0→L5 learning

Assembly Explorer connects:

`architecture → vacuum/platform → source → illumination → reticle → projection → stage/metrology → system integration`

Each stage can expose shared evidence IDs, named atlas nodes, related labs, bilingual research questions and explicit evidence/node gaps.

The learning path runs:

`L0 semiconductor foundations → L1 optics/NA/Fourier imaging → L2 EUV physics/multilayers → L3 scanner systems → L4 High-NA/image-quality concepts → L5 evidence/patent/computational research`

V5 adds one machine-readable EN/VI knowledge checkpoint per level. Answers live only in current React page state; reload clears progress and nothing is sent or persisted.

See [`docs/ASSEMBLY_EXPLORER.md`](docs/ASSEMBLY_EXPLORER.md), [`docs/LEARNING_PATH.md`](docs/LEARNING_PATH.md) and [`docs/LEARNING_CHECKPOINTS.md`](docs/LEARNING_CHECKPOINTS.md).

## Physics & imaging workbench

- Low-NA **0.33** vs High-NA **0.55** educational comparison.
- High-NA **4× / 8× anamorphic** field visualization.
- Rayleigh-style resolution playground with independent numerical cross-checks.
- Normalized **Fourier imaging / circular-pupil MTF** learning lab.
- Normalized **mirror/vacuum** intuition lab linked to public vacuum/reflective-optics evidence.
- Complex-index, polarization-aware characteristic-matrix multilayer learning model.
- Built-in **CC0 Mo/Windt 1988** optical constants dataset pinned to a public upstream revision and containing the original 13.55 nm sample.
- Mask-3D shadowing intuition lab.
- Aberration/focus/leveling/overlay concept lab using normalized educational proxies.
- Six-degree-of-freedom wafer-stage visualization.

These are learning models, not commercial scanner/process predictors.

## Search & research navigation

Atlas search runs entirely in the browser. It does not call an external search service, send telemetry or persist user queries.

It supports:

- exact claim/patent IDs;
- subsystem/organization/technical-term search;
- EN/VI labels and Vietnamese accent-insensitive tokenization;
- result-type badges;
- direct lab/evidence/patent/fab deep links;
- Arrow Up/Down, Enter and Escape keyboard behavior.

See [`docs/ATLAS_SEARCH.md`](docs/ATLAS_SEARCH.md).

## Evidence, provenance, reviews & unknowns

| Class | Meaning |
| --- | --- |
| A | First-party public source |
| B | Published patent / public standard |
| C | Academic/public research |
| D | Public-source inference with written rationale |
| ? | Unknown / insufficient lawful evidence |

Review metadata supports `proposed → reviewed → superseded`. Records without a real review remain **unreviewed**.

Useful local commands:

```bash
node tools/evidence-review-queue.mjs --limit 12
npm run evidence:review-report
npm run provenance:report
npm run provenance:report:json
npm run audit:integrity
npm run preflight
```

The provenance trace only shows explicit repository relationships; missing relationships remain visible as gaps instead of being inferred automatically.

See [`docs/EVIDENCE_PROVENANCE_TRACE.md`](docs/EVIDENCE_PROVENANCE_TRACE.md), [`docs/PROVENANCE_COVERAGE_REPORT.md`](docs/PROVENANCE_COVERAGE_REPORT.md) and [`docs/EVIDENCE_REVIEW_CAMPAIGN.md`](docs/EVIDENCE_REVIEW_CAMPAIGN.md).

## Patent-family explorer

The curated patent map covers source, collector, illumination, reticle, projection, stage, metrology and vacuum-related disclosures with family/priority/publication metadata, subsystem relationships, metadata completeness scoring, conflict audits and original OpenEUV summaries.

A patent disclosure is evidence of a disclosed concept, **not** proof that a drawing equals production geometry.

## Fab & mask-lifecycle context

Machine-readable case studies use `evidence/fab-cases.json` as the runtime/validation source of truth.

Cases currently cover:

- TSMC, Samsung, Intel, Micron, SK hynix and Rapidus EUV milestones;
- TSMC public EUV-mask dry-cleaning context;
- imec CNT-pellicle research context;
- ZEISS AIMS EUV mask-qualification context;
- source/collector contamination and reflective-mask/membrane research context.

Every case stores shared claim IDs, direct public source URLs, a **public boundary** and explicit unknowns. OpenEUV does not infer confidential recipes, private layer choices, yield, internal fab layouts, private acceptance thresholds or private process settings.

## Public data & verified gaps

The first checked-in measured optical dataset is Mo/Windt 1988 from the CC0 refractiveindex.info database.

The silicon-at-13.5-nm investigation is a **verified data gap**, not an undocumented TODO. The pinned CC0 Si candidate starts at 30.9963 nm and cannot be used at 13.5 nm without unsupported extrapolation. Public EUV-range Si measurements/data access exist, but OpenEUV has not verified numerical-table redistribution rights suitable for vendoring those values.

See [`docs/SILICON_OPTICAL_DATA_GAP.md`](docs/SILICON_OPTICAL_DATA_GAP.md) and `evidence/optical-data-gaps.json`.

## Run locally

```bash
npm install
npm run dev
```

Repository gate:

```bash
npm run check
```

`npm run check` runs the unified preflight, unit tests, TypeScript typecheck and production build. Preflight covers evidence/reviews, fab cases, renderer-capture validity, cross-dataset integrity, provenance coverage, dataset-manifest paths, learning checkpoints and the policy that GitHub Actions remains disabled.

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

`wrangler.jsonc` serves `dist/` with SPA fallback. The repository also includes `vercel.json` for a Vite SPA deployment.

Do not claim a live deployment until the intended commit has actually built on the target hosting project. See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Current open external dependencies

Implementable V1→V5 software work on the current roadmap has landed. Only two issues intentionally remain open because they require evidence outside this runtime:

- **#27 PERF:** at least 3 real paired WebGL/WebGPU captures across at least 2 actual laptop/mobile/desktop hardware classes. Synthetic/emulated numbers do not count.
- **#29 EVIDENCE:** at least 10 records reviewed by real human reviewers using real public handles. Generated/fake attribution does not count.

The silicon optical-data investigation (#28) is completed as a verified gap; it must not be “resolved” by unsupported extrapolation or license-ambiguous data copying.

## Verification policy

Because GitHub Actions is disabled, repository changes are **not automatically verified by GitHub**. Before deployment or claiming a change is verified, run locally:

```bash
npm run check
npm run e2e
```

A commit that has only been pushed successfully must not be described as build/test verified.

## Contributor workflow

Structured GitHub Issue Forms cover public evidence/research, 3D/visual contributions, bug reports and real-device renderer benchmarks. Blank issues are disabled so sourcing/privacy/evidence boundaries are visible before submission.

Suggested tracks: `3d`, `optics`, `physics`, `patent-research`, `fab`, `evidence`, `education`, `i18n`, `qa`, `perf`.

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`SOURCING_POLICY.md`](SOURCING_POLICY.md) first.

## Sourcing boundary

Welcome: original models/diagrams, first-party public sources, public patent metadata, public academic metadata, lawfully redistributable datasets, reproducible educational simulations, translations and tests.

Not accepted: stolen/hacked documents, leaked confidential/trade-secret material, unauthorized proprietary CAD/service manuals, private process recipes, credentials or unverifiable anonymous leaks.

The project goal is to see **how far a rigorous open community can reconstruct and teach the system from lawful evidence while keeping known, inferred, illustrative and unknown states visible**.

## License

Code and original OpenEUV assets are MIT licensed unless a file states otherwise. Third-party papers, patents, images and upstream datasets retain their own rights/licensing; prefer metadata + links + original reconstruction over copying protected source material into the repository.
