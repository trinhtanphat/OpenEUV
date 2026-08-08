# OpenEUV Roadmap

OpenEUV develops a public-source engineering atlas, not a reproduction of proprietary scanner CAD, service documentation or fab recipes. A missing private detail should become an explicit research gap rather than a guessed value.

## Completed — foundation & interactive atlas

- [x] Public-source charter, sourcing policy and evidence classes.
- [x] Interactive Three.js EUV scanner with exploded view and clickable subsystems.
- [x] Original OpenEUV source/collector, reticle and projection concept assets with procedural fallbacks.
- [x] Guided camera tour and named-node highlighting.
- [x] Evidence-backed screen-space concept labels.
- [x] Adaptive high/balanced/low LOD for mobile and low-power devices.
- [x] Reproducible concept-asset generator and asset provenance documentation.

## Completed — assembly & education

- [x] System-level Assembly Explorer: architecture → vacuum platform → source → illumination → reticle → projection → stage/metrology → integration/qualification.
- [x] Public-evidence/boundary/dependency metadata for every assembly stage.
- [x] Interactive L0→L5 curriculum from semiconductor basics to public-source EUV research.
- [x] English/Vietnamese technical UI, glossary and long-form documentation.

## Completed — physics & imaging playgrounds

- [x] Rayleigh-style resolution helper with independent Python cross-check.
- [x] Low-NA 0.33 vs High-NA 0.55 comparison.
- [x] High-NA 4×/8× anamorphic-field visualizer.
- [x] Mask-3D shadowing concept lab.
- [x] Aberration/focus/leveling/overlay educational lab.
- [x] Six-degree-of-freedom wafer-stage visualization.
- [x] Complex-index characteristic-matrix multilayer model.
- [x] s/p/unpolarized polarization paths.
- [x] Provenance-aware optical-dataset adapter.
- [x] Pinned CC0 Mo/Windt 1988 public optical constants dataset including the original 13.55 nm sample.
- [x] Illustrative-value fallback when a suitable public dataset is unavailable.

## Completed — evidence & public research graph

- [x] Machine-readable claims and open-unknowns datasets.
- [x] Local evidence validation for duplicate IDs, confidence, source URLs and inference rationale.
- [x] Contextual Evidence links between 3D named nodes and claims.
- [x] Review-state model: proposed → reviewed → superseded.
- [x] Public contributor/reviewer attribution and supersession metadata.
- [x] Evidence Dashboard/Inspector review-state rendering and review coverage.
- [x] DOI/literature metadata normalization.
- [x] Public dataset manifest/versioning/release documentation.

## Completed — patents

- [x] Curated patent-family map with family/priority/publication metadata.
- [x] Coverage across source, collector, illumination, reticle, projection, stage, metrology and vacuum.
- [x] JSON/CSV patent metadata normalizer.
- [x] Duplicate-family/conflicting-date audit tooling.
- [x] Metadata completeness/provenance score in Patent Explorer.
- [x] Explicit warning that patent figures are not confirmed production geometry.

## Completed — fab & mask-lifecycle context

- [x] TSMC public EUV milestones.
- [x] Samsung public EUV milestones.
- [x] Intel High-NA installation/calibration milestone context.
- [x] Micron 1-gamma EUV case.
- [x] SK hynix 1anm EUV mass-production case.
- [x] Rapidus IIM-1 / NXE:3800E integration milestone case.
- [x] Public source/collector contamination case.
- [x] Public reflective-mask/membrane lifecycle case.
- [x] Public-boundary and explicit-unknown sections for every case.

## Completed — QA, reproducibility & deployment foundation

- [x] Unit tests for pure physics/data helpers.
- [x] Playwright desktop/mobile/fallback/accessibility behavior coverage kept in the repository for local execution.
- [x] JS ↔ Python reproducibility cross-checks.
- [x] Renderer benchmark harness and adoption policy.
- [x] Manual Cloudflare Workers Static Assets deployment configuration.
- [x] Vercel-compatible static build path documented.
- [x] GitHub Actions intentionally disabled by project-owner decision.

## Open measurement campaign — renderer performance

- [ ] Collect real WebGL/WebGPU raw results from multiple laptop/mobile/desktop hardware classes. See issue #27 and `benchmarks/README.md`.
- [ ] Commit anonymized raw benchmark JSON using `benchmarks/raw/RESULT_TEMPLATE.json`.
- [ ] Analyze startup time, average/median/p95 frame time and observable memory pressure across real devices.
- [ ] Keep WebGL as production baseline unless reproducible multi-device evidence shows a meaningful benefit.

OpenEUV deliberately does **not** fill this section with synthetic or invented hardware results.

## Future contributor depth — evidence first

These are directions, not promises that private information will become available:

- [ ] Add additional lawfully redistributable EUV-range optical datasets where source, revision and license can be pinned.
- [ ] Improve original concept geometry only where public evidence supports higher fidelity.
- [ ] Add more first-party foundry/mask lifecycle cases with explicit boundaries.
- [ ] Expand academic electromagnetic-mask and computational-lithography learning modules.
- [ ] Add more language packs while preserving shared claim/source IDs.
- [ ] Populate real evidence-review attribution as contributors review records.
- [ ] Expand public patent/literature coverage without turning the repository into an uncurated scrape.

## Verification policy

There is no automatic GitHub Actions gate. Before deployment or claiming a change is verified, run locally:

```bash
npm install
npm run check
npx playwright install chromium
npm run e2e
```

Manual Cloudflare deployment:

```bash
npm run deploy:cloudflare:dry
npm run deploy:cloudflare
```

Do not re-enable GitHub Actions without an explicit project decision.
