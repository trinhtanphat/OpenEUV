# OpenEUV Roadmap

OpenEUV is a public-source engineering/learning atlas, not a reconstruction of proprietary CAD, service documentation or private fab recipes. Unsupported/private detail remains an explicit gap instead of being guessed.

## Completed — V1–V3 foundation

- [x] React + Three.js interactive conceptual EUV scanner.
- [x] Exploded view, subsystem selection, named-node highlighting and guided tour.
- [x] Original OpenEUV source/collector, reticle and projection concept assets with procedural fallbacks.
- [x] Evidence classes A/B/C/D/? with machine-readable claims and unknowns.
- [x] Public patent-family explorer and metadata auditing.
- [x] Foundry/fab context for TSMC, Samsung, Intel and later public milestones.
- [x] Low-NA/High-NA, anamorphic, resolution, multilayer, mask-3D, aberration/focus/overlay and wafer-stage learning tools.
- [x] EN/VI technical content, glossary and browser/local validation foundation.

## Completed — V4 depth

- [x] Procedural illumination and vacuum/platform geometry with stable named nodes.
- [x] First-party shared vacuum requirement evidence and node→claim links.
- [x] Assembly Explorer with claim IDs, atlas-node links, lab links, EN/VI research questions and explicit evidence gaps.
- [x] L0→L5 learning path from semiconductor basics to public-source research.
- [x] Normalized Fourier/circular-pupil MTF learning lab.
- [x] Pinned CC0 Mo/Windt 1988 optical constants dataset.
- [x] Silicon-at-13.5-nm decision recorded as a verified data/license gap; no unsupported extrapolation or ambiguous vendoring.
- [x] Expanded mask lifecycle context: TSMC cleaning, imec pellicle research and ZEISS AIMS EUV qualification context.
- [x] Machine-readable fab-case source of truth + validator.
- [x] Deterministic evidence-review queue and readiness reporting without synthetic reviewer identity.
- [x] Renderer benchmark method v2, privacy-safe capture schema/analyzer and readiness thresholds.

## Completed — V5 navigation, provenance and QA

- [x] Local-only global Atlas Search across subsystems, claims/unknowns, patents, fab cases, assembly, learning, labs and glossary.
- [x] EN/VI accent-insensitive search and keyboard Arrow/Enter/Escape navigation.
- [x] Evidence provenance trace from claims to explicit 3D/Assembly/fab usages.
- [x] Unified repository preflight separating build invariants from external research readiness.
- [x] Cross-dataset integrity audit for IDs/paths/references.
- [x] Human-readable + JSON provenance coverage report.
- [x] Robust brace-aware TypeScript patent parser used by provenance tooling.
- [x] Mirror/vacuum concept lab.
- [x] Evidence-aware EN/VI L0→L5 checkpoints with session-only progress.
- [x] Duplicate search/provenance tooling consolidated into canonical paths.

## Completed — V6 accessibility, provenance UI and export

- [x] In-browser provenance overview using the same provenance summary helper as CLI.
- [x] Evidence/review/unknown/patent/fab/data-gap coverage with deep links.
- [x] Privacy-safe browser research snapshot export with deterministic schema/validation.
- [x] Reproducible CLI research snapshot with explicit caller-supplied timestamp.
- [x] Case/format-insensitive stripping/rejection of client/private snapshot fields.
- [x] Visible-on-focus skip link and separate semantic header/main landmarks.
- [x] Reduced-motion-aware search navigation and CSS reduced-motion guard.
- [x] Keyboard-only search/checkpoint and snapshot-download browser coverage.

## Completed — V7 release provenance, offline portability and accessibility QA

- [x] Package version advanced to `0.9.0`.
- [x] Build-time public metadata resolver for package version + optional short commit SHA.
- [x] Recognized SHA sources limited to `OPENEUV_COMMIT_SHA`, `CF_PAGES_COMMIT_SHA` and `VERCEL_GIT_COMMIT_SHA`, with safe `unknown` fallback.
- [x] Footer exposes public version/commit; build metadata is not user telemetry.
- [x] Research snapshot schema v2 includes the same public build provenance.
- [x] Web app manifest + original OpenEUV SVG icon.
- [x] Production-only module service worker; Vite development mode remains uncached.
- [x] Same-origin GET-only offline policy; cross-origin, `/api/`, Authorization and non-GET traffic are excluded.
- [x] Network-first runtime behavior and explicit offline fallback.
- [x] Versioned OpenEUV cache namespace with old OpenEUV-cache cleanup on activation.
- [x] `private` / `no-store` responses excluded from both install and runtime cache writes.
- [x] Deterministic service-worker policy + shell-contract tests.
- [x] Static accessibility contract audit wired into repository preflight.
- [x] Accessibility contract covers skip/main/search/status/reduced-motion and duplicate literal shell IDs.

See `docs/V7_RELEASE_OFFLINE_A11Y.md`.

## QA / deployment policy

GitHub Actions remains intentionally disabled by project-owner decision. A GitHub push is not proof that the project builds.

Before deployment or a verified claim, run locally:

```bash
npm install
npm run check
npx playwright install chromium
npm run e2e
```

Useful audits/reports:

```bash
npm run preflight
npm run audit:integrity
npm run audit:a11y
npm run provenance:report
npm run evidence:review-report
```

Manual Cloudflare deployment:

```bash
npm run deploy:cloudflare:dry
npm run deploy:cloudflare
```

Vercel static SPA configuration also exists in `vercel.json`.

## Open external dependency — #27 real renderer measurements

Software/methodology is complete. Remaining work requires **real hardware**:

- [ ] Collect at least 3 paired WebGL/WebGPU captures across at least 2 real laptop/mobile/desktop classes.
- [ ] Commit anonymized schema-valid method-v2 captures.
- [ ] Analyze startup/median/p95/memory observations.
- [ ] Keep WebGL as baseline unless real multi-device evidence meets the existing adoption threshold.

Synthetic, headless, emulator or invented data does not close #27.

## Open external dependency — #29 real evidence-review campaign

Queue/validator/report/readiness tooling is complete. Remaining work requires **real reviewers**:

- [ ] Review at least 10 high-impact claims/unknowns against cited public sources.
- [ ] Record only real public reviewer handles after actual review.
- [ ] Correct/narrow/supersede wording where evidence requires it while preserving history.
- [ ] Publish review coverage and unresolved questions.

Generated identities or synthetic review records do not close #29.

## Future evidence-first directions

These are contributor directions, not promises that private information will become available:

- [ ] Improve original concept geometry only where lawful public evidence supports higher fidelity.
- [ ] Add more first-party fab/mask-lifecycle cases with explicit boundaries.
- [ ] Expand academic electromagnetic-mask/computational-imaging learning modules.
- [ ] Add more language packs while preserving shared evidence identity.
- [ ] Expand curated patent/literature coverage without becoming an unreviewed scrape.
- [ ] Add more lawfully redistributable optical datasets when license/provenance/range can be pinned.
- [ ] Continue accessibility/manual assistive-technology testing beyond the static/browser regression contracts.
