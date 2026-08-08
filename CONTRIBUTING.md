# Contributing to OpenEUV

OpenEUV welcomes contributors from frontend, 3D, optics, physics, semiconductor manufacturing, patent/literature research, public-data engineering, technical writing, translation, QA and reproducibility work.

The project is intentionally public-source. The challenge is not collecting secret files; it is building the clearest evidence-backed reconstruction possible while distinguishing **documented, inferred, illustrative and unknown** information.

## Before starting

1. Read `SOURCING_POLICY.md`.
2. Use Atlas Search, Source Library, Literature Explorer, 3D Atlas, Assembly Explorer, Learning Path and open issues to avoid duplicate work.
3. Check existing claim IDs, literature/patent metadata, fab cases, concept-node labels and provenance traces before adding relationships.
4. State whether proposed geometry/facts are documented, public-source inference or illustration.
5. Prefer a small reproducible contribution over a large unverifiable dump.

## GitHub Actions policy

**GitHub Actions is intentionally disabled.** Do not add or re-enable `.github/workflows/*.yml` without an explicit project-owner decision.

A successful push is not proof that the project builds. Verify locally before deployment or before writing `PASS`/`verified`.

## Local verification

```bash
npm install
npm run preflight
npm run check
```

Useful audits/reports:

```bash
npm run preflight:json
npm run audit:integrity
npm run audit:a11y
npm run audit:sources
npm run audit:i18n
npm run validate:literature
npm run provenance:report
npm run evidence:review-report
```

`npm run check` runs preflight, unit tests, TypeScript typecheck and the production Vite build. Preflight covers evidence/reviews, fab cases, literature links, renderer captures, cross-dataset integrity, source citations, provenance, learning checkpoints, accessibility contracts, EN/VI structural coverage, dataset paths, key docs and the requirement that GitHub Actions remains disabled.

Real renderer benchmark readiness and genuine human-review readiness are reported separately. An unresolved external research dependency is not the same thing as a broken build.

For UI/3D/browser changes:

```bash
npx playwright install chromium
npm run e2e
```

If a required check cannot be run, state that explicitly instead of assuming it passed.

## Evidence and review

| Class | Use |
| --- | --- |
| A | First-party manufacturer/foundry/public institutional source |
| B | Published patent / public standard |
| C | Academic/public research source |
| D | Public-source inference with explicit rationale |
| ? | Unknown / insufficient lawful public evidence |

Class D needs public sources and written rationale; it is not a way to convert a rumor into fact.

Review state can be `proposed`, `reviewed` or `superseded`. Use public contributor/reviewer handles only after real review work happened. Issue #29 remains open until genuine human reviewers perform the work.

## Source Library and citation consistency

`src/lib/sourceLibrary.mjs` derives the Source Library from existing evidence claims, fab cases and patent metadata. Do **not** create a second manually maintained factual source registry.

```bash
npm run audit:sources
npm run audit:sources:json
```

Public source URLs must use HTTP(S), evidence sources need useful labels, and source-to-record relationships must be explicit repository relationships. Contextual aliases for one normalized URL are warnings, not automatic errors. Counts are bookkeeping, not source-quality rankings.

## Academic literature

Academic metadata lives in `evidence/literature.json` and is validated with:

```bash
npm run validate:literature
```

A curated record should include DOI/title/year/authors, public source URL/name, publication type, controlled topics, an original concise OpenEUV summary, and claim/lab links only where the repository relationship is real.

Do not copy full copyrighted papers without redistribution rights. A public preprint/conference paper is not proof that a vendor uses the concept in production.

## Bibliography export

V9 derives citations from the same `evidence/literature.json` registry; do not create a second bibliography source of truth.

```bash
npm run literature:export -- --format bibtex
npm run literature:export -- --format csl-json
npm run literature:export -- --format bibtex --output openeuv-literature.bib
```

Requirements:

- preserve only metadata present in the registry;
- do not fabricate publisher, volume, issue or pages;
- keep author names literal in CSL when name-part boundaries are not curated;
- keep deterministic citation-key behavior and escaping tests;
- browser Copy BibTeX / Download CSL-JSON must export the currently filtered papers only;
- never include full paper text in citation exports.

See `docs/V9_BIBLIO_I18N.md`.

## EN/VI translation contributions

EN/VI share the same evidence IDs, source URLs, DOI/patent IDs, units and confidence values. Translate explanations, not evidence identity.

Run:

```bash
npm run audit:i18n
npm run audit:i18n:json
```

The structural audit protects the canonical UI dictionary, bilingual learning checkpoints and required learning-path EN/VI fields. Missing/empty/obvious placeholder values are errors. Technical language-neutral IDs are not translation failures.

A structural pass is **not** a claim of native-speaker/domain-expert linguistic review. Human review remains useful for specialized terminology.

## Research snapshots

Create, verify and compare public metadata snapshots locally:

```bash
npm run research:snapshot -- --generated-at 2026-08-08T12:00:00.000Z > snapshot.json
npm run research:snapshot:verify -- snapshot.json
npm run research:snapshot:diff -- before.json after.json
```

Snapshots must not include IP addresses, user-agent strings, hardware identifiers, usernames/emails, browser history/storage, cookies, tokens, passwords or authorization values. Diff compares canonical records by stable IDs and does not infer semantic equivalence.

## Accessibility and search

Preserve the first-focusable skip link, one main landmark, labeled/listbox global search, polite status regions, focus-visible behavior and reduced-motion contract.

```bash
npm run audit:a11y
npm run e2e
```

Atlas Search must remain local-only, avoid external telemetry/search services and query persistence, preserve EN/VI keyboard behavior, and retain shared evidence/DOI/patent identities.

## 3D / education / physics

Original OpenEUV assets and procedural geometry are preferred. Do not submit copied proprietary CAD, private service models, leaked internal drawings, exact confidential dimensions/tolerances or unauthorized geometry.

Assembly/learning contributions should preserve evidence boundaries and explicit gaps. Physics/imaging contributions must document assumptions, units/normalization, validity range and omitted effects.

Do not present generic educational models as commercial scanner predictors, process windows or proprietary production settings. Do not add practical instructions for building or operating hazardous EUV-source, laser, plasma or vacuum systems.

## Optical data

Measured optical data must have lawful public provenance and redistribution permission suitable for repository inclusion. Pin upstream records/revisions where practical, preserve bibliography/license metadata and do not silently extrapolate outside source range.

The CC0 Mo/Windt dataset is the positive example. Silicon around 13.5 nm remains a verified data/license gap; do not resolve it by unsupported extrapolation or copying an ambiguous-rights table.

## Patents and fab context

Patent contributions need publication/family IDs, priority/publication dates, subsystem links, public metadata/source URL and an original summary. A patent drawing is not confirmed production geometry.

`evidence/fab-cases.json` is the runtime/validation source of truth for fab/mask-lifecycle cases. Prefer first-party sources and keep `public fact → why it matters → public boundary → explicit unknowns`. Do not infer confidential recipes, layer choices, yield, internal layouts, cleaning chemistry, inspection thresholds or private scanner/process settings.

## Renderer/performance

WebGL remains the production baseline. Real benchmark submissions must use OpenEUV method v2 and actual hardware. Do not submit Playwright/headless/emulator results or estimated/fabricated numbers as hardware evidence. Issue #27 remains open until defined real-device coverage is met.

## Manual deployment

Cloudflare deployment uses the provenance-aware local helper:

```bash
npm run deploy:cloudflare:dry
npm run deploy:cloudflare
```

The helper records exact Git HEAD, refuses dirty trees by default and runs the repository gate before a real deploy. `--allow-dirty` and `--skip-check` are explicit operator overrides, not normal release workflow. Never log or commit Cloudflare credentials/tokens.

See `docs/DEPLOYMENT.md`.

## Contribution report

A useful issue/PR report includes the problem/research question, files changed, evidence/source/provenance, assumptions/unknowns, checks actually run, screenshots when useful, risks/limitations and what remains unverified.

The project values transparent uncertainty. `Unknown` is better than an impressive-looking unsupported claim.
