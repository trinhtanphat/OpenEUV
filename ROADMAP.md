# OpenEUV Roadmap

OpenEUV develops a public-source engineering atlas, not a reproduction of proprietary scanner CAD, service documentation or fab recipes. Missing private or unsupported detail remains an explicit research gap rather than a guessed value.

## Completed — foundation & interactive atlas

- [x] Public-source charter, sourcing policy and evidence classes.
- [x] Interactive Three.js EUV scanner with exploded view and clickable subsystems.
- [x] Original source/collector, reticle and projection concept assets with procedural fallbacks.
- [x] Guided camera tour and named-node highlighting.
- [x] Evidence-backed screen-space concept labels.
- [x] Adaptive high/balanced/low LOD for mobile and low-power devices.
- [x] Reproducible concept-asset generator and asset provenance documentation.

## Completed — 3D V4

- [x] Original procedural illumination concept geometry with stable named nodes.
- [x] Original procedural vacuum/platform concept geometry with stable named nodes.
- [x] First-party shared vacuum requirement claim (`EUV-VACUUM-001`).
- [x] Illumination/vacuum node → claim → Contextual Evidence mapping.
- [x] Reproducible optional glTF generator presets for illumination/vacuum.
- [x] Low-LOD simplification of secondary concept nodes.
- [x] Browser fallback coverage with all external `/models/**` requests blocked.
- [x] Explicit geometry-status/provenance documentation.

## Completed — assembly & education

- [x] System-level Assembly Explorer: architecture → vacuum/platform → source → illumination → reticle → projection → stage/metrology → integration.
- [x] Public-evidence/boundary/dependency metadata for every stage.
- [x] Interactive L0→L5 curriculum from semiconductor basics to public-source EUV research.
- [x] English/Vietnamese technical UI, glossary and long-form documentation.
- [x] V4 assembly claim IDs, atlas-node links, related labs and bilingual research questions.
- [x] Stable deep-links from assembly evidence chips into the Evidence Dashboard.
- [x] Explicit direct-evidence/node gaps instead of invented mappings.

## Completed — physics & imaging playgrounds

- [x] Rayleigh-style resolution helper with independent cross-checks.
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
- [x] V4 normalized Fourier/circular-pupil MTF learning lab with deterministic tests and public-reference methodology.
- [x] V4 silicon-at-13.5-nm data-gap decision recorded as machine-readable provenance: verified CC0 Si candidate is out of range, while the EUV-range public candidate is not vendored without verified redistribution rights.
- [x] Regression guard forbidding silent Si extrapolation or license-ambiguous numerical-table vendoring.

## Completed — evidence & public research graph

- [x] Machine-readable claims and open-unknowns datasets.
- [x] Local evidence validation for duplicate IDs, confidence, source URLs and inference rationale.
- [x] Contextual Evidence links between named 3D nodes and claims.
- [x] Review-state model: proposed → reviewed → superseded.
- [x] Public contributor/reviewer attribution and supersession metadata.
- [x] Evidence Dashboard/Inspector review-state rendering and review coverage.
- [x] DOI/literature metadata normalization.
- [x] Public dataset manifest/versioning foundation.
- [x] V4 deterministic evidence-review queue and campaign workflow that never fabricates reviewer identity.
- [x] V4 review-campaign readiness reporting with exact reviewed/missing counts and evidence-category coverage.

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
- [x] Reflective-mask/membrane lifecycle case.
- [x] V4 TSMC EUV-mask dry-cleaning case.
- [x] V4 imec CNT-pellicle protection case.
- [x] V4 ZEISS AIMS EUV mask-qualification case.
- [x] `evidence/fab-cases.json` as the single runtime/validation source of truth.
- [x] Shared claim IDs, direct public source URLs, public-boundary and explicit-unknown fields for every runtime case.
- [x] Runtime fab-case validator wired into the local project gate.

## Completed — QA, reproducibility & deployment foundation

- [x] Unit tests for pure physics/data/evidence helpers.
- [x] Playwright desktop/mobile/fallback/accessibility behavior coverage kept for local execution.
- [x] JS ↔ Python reproducibility cross-checks where applicable.
- [x] Method-v2 renderer benchmark harness with explicit GPU completion.
- [x] Privacy-safe benchmark capture schema/validator/analyzer.
- [x] Renderer benchmark readiness report with required/missing paired captures and device classes.
- [x] Manual Cloudflare Workers Static Assets deployment configuration.
- [x] Vercel-compatible Vite SPA configuration documented.
- [x] Structured GitHub Issue Forms for evidence, 3D, bugs and real-device benchmarks.
- [x] GitHub Actions intentionally disabled by project-owner decision.

## Completed — V5 navigation, provenance, QA & learning

- [x] Local-only global atlas search across subsystems, evidence/unknowns, patents, fab cases, Assembly Explorer, learning levels, labs and glossary.
- [x] EN/VI search labels, accent-insensitive tokenization and keyboard Arrow/Enter/Escape navigation.
- [x] Evidence claim → usage provenance trace for concept nodes, Assembly stages and fab cases without inferred relationships.
- [x] Unified repository preflight separating invariant failures from external research readiness.
- [x] Cross-dataset integrity audit for claim IDs, concept nodes, fab sources, review targets, dataset paths/IDs and patent subsystem IDs.
- [x] Human-readable + JSON provenance coverage report by evidence class/component/source organization/domain/review state.
- [x] Patent/fab/license-gap coverage in the provenance report with robust brace-aware TypeScript patent parsing.
- [x] V5 normalized mirror-vs-transmission / vacuum-need educational concept lab using public evidence boundaries only.
- [x] Evidence-aware EN/VI learning checkpoints covering L0→L5 with session-only progress and no telemetry/persistence.
- [x] Machine-readable checkpoint dataset, validator, dataset-manifest registration and browser/unit coverage.
- [x] Duplicate V5 search/source-coverage/browser-test implementations consolidated into canonical paths.

## Open external dependency — #27 real renderer measurements

Software/methodology is complete. Remaining acceptance work requires **real hardware**:

- [ ] Collect at least 3 paired WebGL/WebGPU raw results across at least 2 real laptop/mobile/desktop hardware classes.
- [ ] Commit anonymized schema-valid captures.
- [ ] Analyze startup time, median/p95 frame time and observable memory pressure.
- [ ] Keep WebGL as production baseline unless reproducible multi-device evidence supports a change.

Synthetic, headless/emulated or invented values do not close this issue. The analyzer reports the exact remaining capture/device-class gap.

See `benchmarks/README.md`.

## Open external dependency — #29 first real evidence-review campaign

Review machinery, queue tooling and readiness reporting are complete. Remaining work requires **real human reviewers**:

- [ ] Review at least 10 high-impact claims/unknowns against the cited public sources.
- [ ] Record only real public reviewer handles after actual review.
- [ ] Correct/narrow/supersede claims where needed while preserving history.
- [ ] Publish review coverage and unresolved questions.

Generated identities or synthetic review state do not close this issue. The review report shows reviewed `current/10`, missing count and category coverage.

See `docs/EVIDENCE_REVIEW_CAMPAIGN.md`.

## Future contributor depth — evidence first

These are directions, not promises that private information will become available:

- [ ] Improve original concept geometry only where lawful public evidence supports higher fidelity.
- [ ] Add more first-party foundry/mask-lifecycle cases with explicit boundaries.
- [ ] Expand academic electromagnetic-mask and computational-imaging learning modules.
- [ ] Add more language packs while preserving shared claim/source IDs.
- [ ] Expand public patent/literature coverage without becoming an uncurated scrape.
- [ ] Add further lawfully redistributable optical datasets when license/provenance can be pinned.

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
