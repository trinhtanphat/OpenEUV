# OpenEUV Roadmap

OpenEUV is a public-source engineering/learning atlas, not a reconstruction of proprietary CAD, service documentation or private fab recipes. Unsupported/private detail remains an explicit gap instead of being guessed.

## Completed — V1–V3 foundation

- [x] React + Three.js interactive conceptual EUV scanner.
- [x] Exploded view, subsystem selection, named-node highlighting and guided tour.
- [x] Original OpenEUV source/collector, reticle and projection concept assets with procedural fallbacks.
- [x] Evidence classes A/B/C/D/? with machine-readable claims and unknowns.
- [x] Public patent-family explorer and metadata auditing.
- [x] Foundry/fab context and core optics/physics learning tools.
- [x] EN/VI technical content, glossary and browser/local validation foundation.

## Completed — V4 depth

- [x] Procedural illumination and vacuum/platform geometry with stable named nodes.
- [x] First-party shared vacuum requirement evidence and node→claim links.
- [x] Assembly Explorer with claim IDs, atlas-node links, lab links, EN/VI research questions and explicit evidence gaps.
- [x] L0→L5 learning path from semiconductor basics to public-source research.
- [x] Normalized Fourier/circular-pupil MTF learning lab.
- [x] Pinned CC0 Mo/Windt 1988 optical constants dataset.
- [x] Silicon-at-13.5-nm decision recorded as a verified data/license gap; no unsupported extrapolation or ambiguous vendoring.
- [x] Expanded mask lifecycle/fab context and machine-readable fab-case validation.
- [x] Evidence-review queue/readiness reporting without synthetic reviewer identity.
- [x] Renderer benchmark method v2, privacy-safe capture schema/analyzer and readiness thresholds.

## Completed — V5 navigation, provenance and QA

- [x] Local-only global Atlas Search across subsystems, claims/unknowns, patents, fab cases, assembly, learning, labs and glossary.
- [x] EN/VI accent-insensitive search and keyboard navigation.
- [x] Evidence provenance trace from claims to explicit 3D/Assembly/fab usages.
- [x] Unified repository preflight and cross-dataset integrity audit.
- [x] Human-readable + JSON provenance coverage report.
- [x] Robust patent source parser.
- [x] Mirror/vacuum concept lab and evidence-aware EN/VI L0→L5 checkpoints.

## Completed — V6 accessibility, provenance UI and export

- [x] In-browser provenance overview using the same summary helper as CLI.
- [x] Evidence/review/unknown/patent/fab/data-gap coverage with deep links.
- [x] Privacy-safe browser + CLI research snapshots.
- [x] Case/format-insensitive stripping/rejection of client/private snapshot fields.
- [x] Skip-to-content, semantic landmarks and reduced-motion-aware navigation.
- [x] Keyboard-only search/checkpoint and snapshot-download browser coverage.

## Completed — V7 release provenance, offline portability and accessibility QA

- [x] Package version `0.9.0` and build-time public version/commit metadata.
- [x] Recognized commit sources limited to explicit/Cloudflare/Vercel public SHA variables, with safe `unknown` fallback.
- [x] Footer + research snapshot build provenance.
- [x] Web manifest + original icon.
- [x] Production-only same-origin GET network-first offline shell.
- [x] Versioned OpenEUV cache cleanup and `private`/`no-store` cache exclusion.
- [x] Deterministic offline policy/shell tests.
- [x] Static accessibility contract audit wired into preflight.

See `docs/V7_RELEASE_OFFLINE_A11Y.md`.

## Completed — V8 research operations, sources and literature

- [x] Package version `0.10.0`.
- [x] Provenance-aware manual Cloudflare helper records exact Git HEAD and refuses dirty worktrees by default.
- [x] Explicit dry-run, `--allow-dirty` and `--skip-check` operator paths without re-enabling GitHub Actions.
- [x] Derived Source Library from existing claims/fab/patent provenance, with source→record links and filters.
- [x] Source citation-consistency audit wired into preflight.
- [x] Research-snapshot verify + deterministic diff CLI with timestamp-only changes separated from research-content changes.
- [x] Curated `evidence/literature.json` academic metadata registry with DOI/source/topic/publication-type and claim/lab links.
- [x] Interactive EN/VI Literature Explorer and literature-aware Atlas Search.
- [x] Literature dataset manifest registration and structural validator in preflight.
- [x] Duplicate V8 browser/docs implementations consolidated into canonical paths.

See `docs/V8_RESEARCH_OPERATIONS.md` and `docs/DEPLOYMENT.md`.

## Completed — V9 bibliography handoff and EN/VI QA

- [x] Package version advanced to `0.11.0`.
- [x] Deterministic literature citation keys from normalized author token, year and DOI-derived hash, with collision suffixes.
- [x] BibTeX export derived from the curated literature registry without fabricated publisher/volume/page metadata.
- [x] CSL-JSON export with author names preserved literally instead of guessed given/family parsing.
- [x] Local citation-export CLI supporting stdout and optional file output.
- [x] Literature Explorer Copy BibTeX / Download CSL-JSON actions use only currently filtered papers.
- [x] Pure tests cover citation determinism, escaping, collision handling and metadata boundaries.
- [x] Repository-local EN/VI structural coverage helper/audit for canonical UI copy, learning checkpoints and learning-path field structure.
- [x] EN/VI audit detects missing/empty/placeholder pairs, unsupported language identifiers and duplicate flat copy keys where structurally observable.
- [x] `audit:i18n` wired into repository preflight.
- [x] V9 documentation explicitly distinguishes structural coverage from native/domain-expert linguistic review.

See `docs/V9_BIBLIO_I18N.md`.

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
npm run audit:sources
npm run audit:i18n
npm run validate:literature
npm run provenance:report
npm run evidence:review-report
npm run literature:export -- --format bibtex
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
- [ ] Continue accessibility/manual assistive-technology testing beyond static/browser regression contracts.
