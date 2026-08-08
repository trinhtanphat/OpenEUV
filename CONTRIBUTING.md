# Contributing to OpenEUV

OpenEUV welcomes contributors from frontend, 3D, optics, physics, semiconductor manufacturing, patent research, public-data engineering, technical writing, translation, QA and reproducibility work.

The project is intentionally public-source. The challenge is not collecting secret files; it is building the clearest evidence-backed reconstruction possible while distinguishing **documented, inferred, illustrative and unknown** information.

## Before starting

1. Read `SOURCING_POLICY.md`.
2. Use the global Atlas Search, 3D Atlas, Assembly Explorer, Learning Path and open issues to avoid duplicate work.
3. Check existing claim IDs, patent/literature metadata, fab cases, concept-node labels and provenance traces before creating a new relationship.
4. State whether proposed geometry/facts are documented, public-source inference or illustration.
5. Prefer a small reproducible contribution over a large unverifiable dump.

## GitHub Actions policy

**GitHub Actions is intentionally disabled.** Do not add or re-enable automatic workflow files without an explicit project-owner decision.

A successful GitHub push is not proof that the project builds. Verify locally before deployment or before writing `PASS`/`verified`.

## Local verification

```bash
npm install
npm run preflight
npm run check
```

Useful inspectable reports/exports:

```bash
npm run preflight:json
npm run audit:integrity
npm run audit:integrity:json
npm run provenance:report
npm run provenance:report:json
npm run evidence:review-report
npm run research:snapshot -- --generated-at 2026-08-08T12:00:00.000Z > openeuv-research-snapshot.json
```

`npm run check` runs preflight, unit tests, TypeScript typecheck and the production Vite build. Preflight covers evidence/reviews, runtime fab cases, renderer captures, cross-dataset integrity, provenance coverage, dataset-manifest paths/IDs, concept-label references, L0→L5 checkpoint data, required documentation including V6 accessibility/export docs, and the policy that GitHub Actions workflows remain absent.

Real renderer benchmark readiness and genuine human-review readiness are reported separately; an unresolved external research dependency is not the same thing as a broken build.

For UI/3D/browser changes:

```bash
npx playwright install chromium
npm run e2e
```

If you cannot run a required check, say so clearly instead of assuming it passed.

## Evidence classes

| Class | Use |
| --- | --- |
| A | First-party manufacturer/foundry/public institutional source |
| B | Published patent / public standard |
| C | Academic/public research source |
| D | Public-source inference with explicit rationale |
| ? | Unknown / insufficient lawful public evidence |

Class D is not a way to turn a rumor into fact. It needs public sources and a written rationale.

## Evidence review & provenance

Review metadata can be `proposed`, `reviewed` or `superseded`.

Use public contributor/reviewer handles only after real review work happened. Do not add private names, emails, account IDs or other unnecessary personal information.

Generate a balanced real-review queue with:

```bash
node tools/evidence-review-queue.mjs --limit 12
node tools/evidence-review-queue.mjs --limit 12 --json
```

The queue never assigns reviewer identity and never changes review state. Issue #29 remains open until genuine reviewers perform the work.

Before adding a duplicate claim or mapping, use the provenance trace and source-coverage report. Relationships must be explicit repository relationships; do not invent a 3D-node/Assembly/fab relationship merely because it seems plausible.

See `docs/EVIDENCE_REVIEW_CAMPAIGN.md`, `docs/EVIDENCE_PROVENANCE_TRACE.md` and `docs/PROVENANCE_COVERAGE_REPORT.md`.

## Research snapshot/export contributions

V6 provides a browser and CLI research snapshot using `src/lib/researchSnapshot.mjs`.

A snapshot is a bundle of **public repository metadata**, not scanner secrets or client telemetry. It may include claims, unknowns, fab-case metadata, dataset-manifest entries, review readiness and provenance coverage.

It must not include browser/client/private data such as:

- IP addresses;
- user-agent strings;
- hardware concurrency/device-memory values;
- usernames/emails;
- browser history;
- local/session storage;
- cookies, tokens, passwords or authorization values.

Privacy-key filtering is format/case insensitive; variants such as `User-Agent`, `IP_Address` and `Device-Memory` are treated as private fields.

Keep `generatedAt` explicit in deterministic code/tests. Browser export may supply current time at the user action; CLI export requires `--generated-at`.

See `docs/V6_ACCESSIBILITY_EXPORT.md`.

## Accessibility contributions

The UI now has a first-focusable skip link, separate header/main landmarks, focus-visible navigation and reduced-motion-aware stateful search scrolling.

Accessibility changes should preserve:

- keyboard reachability for search, checkpoints and major navigation/actions;
- reduced-motion behavior without disabling important state feedback;
- usable mobile layout;
- no analytics or preference persistence solely for accessibility behavior.

Add browser coverage for interactive behavior and pure helper tests when logic can be separated from the DOM.

## Search contributions

The global Atlas Search is local-only. Search contributions must index only lawful repository-local metadata, preserve shared evidence IDs, avoid telemetry/query persistence, maintain EN/VI behavior and keyboard accessibility, and keep deterministic ranking tests.

See `docs/ATLAS_SEARCH.md`.

## 3D contributions

Original OpenEUV assets and procedural geometry are preferred. Good contributions include evidence-bounded glTF/GLB concept geometry, reproducible generators, stable named nodes, screen-space evidence labels, mobile/low-power LOD and exploded-view improvements.

The illumination/vacuum implementation demonstrates an important pattern: **procedural named nodes are first-class fallback content**, while optional glTF materializations can be generated from source.

Do not submit copied proprietary CAD, private service models, leaked internal scanner drawings, exact confidential dimensions/tolerances or geometry extracted from unauthorized material.

## Assembly / education contributions

Assembly stages can carry stable IDs, EN/VI explanation, shared `claimIds`, stable `atlasNodes` when known, related `learningLinks`, bilingual research questions and evidence boundaries.

An empty claim/node list is allowed and should remain a visible **gap** instead of being filled with a weakly related record.

L0→L5 checkpoints live in `evidence/learning-checkpoints.json`. A checkpoint must test conceptual/public-source understanding rather than proprietary trivia or practical operating procedures. Progress is intentionally session-only and private.

See `docs/ASSEMBLY_EXPLORER.md`, `docs/LEARNING_PATH.md` and `docs/LEARNING_CHECKPOINTS.md`.

## Physics / imaging contributions

A physics contribution should document assumptions, normalization/units, validity range and omitted effects.

Current examples include the multilayer model, normalized Fourier/circular-pupil MTF lab and mirror/vacuum concept lab.

Do not present a generic educational model as a commercial scanner predictor, mask recipe, process window, proprietary correction model or production setting. Do not add practical instructions for building or operating hazardous EUV-source, laser, plasma or vacuum equipment.

## Optical-data contributions

For measured optical constants, the source must be lawful/public, redistribution must permit inclusion, exact upstream records/revisions should be pinned when practical, bibliography/license metadata must be preserved, and data must not be silently extrapolated outside source range.

The CC0 Mo/Windt dataset is the current positive example.

The silicon-at-13.5-nm investigation is completed as a **verified data gap**: the checked CC0 Si candidate is out of range, while EUV-range public data has not yet been shown to have suitable redistribution permission for vendoring its numerical table.

Do not copy a public web table into the repo when redistribution rights are unclear.

## Patent contributions

Patent research should include publication/family IDs, priority/publication dates, subsystem links, public assignee/application metadata when available, a public source URL and an original concise summary.

The metadata completeness score measures fields, not commercial importance. The provenance CLI reads `src/data/patents.ts` through `src/lib/patentSourceParser.mjs`; parser changes need regression tests because formatting-only edits must not silently erase patent coverage.

Do not copy patent figures into the repository merely because a patent is public. Never present a patent drawing as confirmed production geometry.

## Academic/literature contributions

Use DOI/title/year/author/source metadata and original summaries. Do not copy paywalled/full copyrighted papers into the repository without redistribution rights.

## Fab / mask-lifecycle contributions

`evidence/fab-cases.json` is the runtime/validation source of truth.

A case follows:

`public fact → why it matters → public boundary → explicit unknowns`

Each case should contain shared claim IDs and direct public source URLs. Prefer first-party sources. Do not infer confidential recipes, private layer choices, yield, internal line layouts, inspection thresholds, cleaning chemistry, private scanner settings or private qualification criteria.

## Renderer/performance contributions

WebGL remains the production baseline. WebGPU work must be evidence-driven.

Real benchmark submissions must use OpenEUV benchmark **method v2** and real hardware. Do not submit Playwright/headless/emulator results or estimated/fabricated numbers as hardware evidence. Remove serial numbers, usernames, IP addresses and other private identifiers.

Issue #27 remains open until multiple real device classes are measured.

## Translation contributions

EN/VI share the same evidence IDs, source URLs, patent/publication IDs, units and confidence values. Translate explanations, not evidence identity.

Keep internationally recognizable technical terms when useful, e.g. `reticle`, `overlay`, `wafer stage`, `High-NA`, `metrology`, `MTF`.

## Suggested tracks

- `[3D]` concept geometry, generators, LOD, labels and visual QA
- `[OPTICS]` NA, Fourier/MTF, imaging and aberration learning tools
- `[PHYSICS]` multilayers, public data and reproducibility
- `[PATENT]` curated family metadata and provenance review
- `[FAB]` first-party manufacturing/mask-lifecycle context
- `[EVIDENCE]` sourcing, provenance, real review, supersession and unknowns
- `[EDU]` Assembly Explorer and L0→L5 learning/checkpoints
- `[SEARCH]` deterministic local atlas navigation
- `[EXPORT]` privacy-safe public research snapshots/reports
- `[A11Y]` keyboard, landmarks, reduced motion and mobile accessibility
- `[I18N]` technical translation
- `[QA]` preflight/unit/browser/accessibility/manual deployment checks
- `[PERF]` real-device renderer benchmarks

Structured GitHub Issue Forms are provided for evidence/research, 3D/visual work, bugs and real-device performance contributions. Blank issues are disabled so sourcing/privacy boundaries are visible before submission.

## Contribution report

A useful issue/PR report includes the problem/research question, files changed, evidence/provenance when applicable, assumptions/unknowns, checks actually run, screenshots for visual changes when practical, risks/limitations and what remains unverified.

The project values transparent uncertainty. `Unknown` is better than an impressive-looking unsupported claim.
