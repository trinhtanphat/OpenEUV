# Contributing to OpenEUV

OpenEUV welcomes contributors from frontend, 3D, optics, physics, semiconductor manufacturing, patent/literature research, public-data engineering, technical writing, translation, QA and reproducibility work.

The project is intentionally public-source. The challenge is not collecting secret files; it is building the clearest evidence-backed reconstruction possible while distinguishing **documented, inferred, illustrative and unknown** information.

## Before starting

1. Read `SOURCING_POLICY.md`.
2. Use Atlas Search, the Source Library, Literature Explorer, 3D Atlas, Assembly Explorer, Learning Path and open issues to avoid duplicate work.
3. Check existing claim IDs, literature/patent metadata, fab cases, concept-node labels and provenance traces before adding relationships.
4. State whether proposed geometry/facts are documented, public-source inference or illustration.
5. Prefer a small reproducible contribution over a large unverifiable dump.

## GitHub Actions policy

**GitHub Actions is intentionally disabled.** Do not add or re-enable `.github/workflows/*.yml` without an explicit project-owner decision.

A successful GitHub push is not proof that the project builds. Run local verification before deployment or before writing `PASS`/`verified`.

## Local verification

```bash
npm install
npm run preflight
npm run check
```

Useful local audits/reports:

```bash
npm run preflight:json
npm run audit:integrity
npm run audit:a11y
npm run audit:sources
npm run validate:literature
npm run provenance:report
npm run provenance:report:json
npm run evidence:review-report
```

`npm run check` runs preflight, unit tests, TypeScript typecheck and the production Vite build. Preflight covers evidence/reviews, fab cases, academic-literature links, renderer-capture validity, cross-dataset integrity, source-citation consistency, provenance coverage, learning checkpoints, accessibility contracts, dataset paths, key documentation and the requirement that GitHub Actions stays disabled.

Real renderer benchmark readiness and genuine human-review readiness are reported separately. An unresolved external research dependency is not the same thing as a broken build.

For UI/3D/browser changes:

```bash
npx playwright install chromium
npm run e2e
```

If a required check cannot be run, state that explicitly instead of assuming it passed.

## Evidence classes

| Class | Use |
| --- | --- |
| A | First-party manufacturer/foundry/public institutional source |
| B | Published patent / public standard |
| C | Academic/public research source |
| D | Public-source inference with explicit rationale |
| ? | Unknown / insufficient lawful public evidence |

Class D needs public sources and written rationale; it is not a way to convert a rumor into fact.

## Evidence review & provenance

Review state can be `proposed`, `reviewed` or `superseded`. Use public contributor/reviewer handles only after real review work happened. Do not add private names, emails, account IDs or unnecessary personal information.

Generate a balanced review queue with:

```bash
node tools/evidence-review-queue.mjs --limit 12
node tools/evidence-review-queue.mjs --limit 12 --json
```

The queue never assigns identity or changes review state. Issue #29 remains open until genuine human reviewers perform the work.

## Source Library and citation contributions

`src/lib/sourceLibrary.mjs` derives the Source Library from existing evidence claims, fab cases and patent metadata. Do **not** create a second manually maintained factual source registry.

Run:

```bash
npm run audit:sources
npm run audit:sources:json
```

Requirements:

- public source URLs must use HTTP(S);
- evidence sources need useful labels;
- source-to-record relationships must be explicit repository relationships;
- multiple contextual labels for one normalized URL are allowed but surfaced as warnings;
- counts are bookkeeping, never source-quality or commercial-importance rankings.

See `docs/V8_RESEARCH_OPERATIONS.md`.

## Academic literature contributions

Academic metadata lives in `evidence/literature.json` and is validated by `npm run validate:literature`.

A curated record should include:

- DOI, title, year and authors;
- public source URL/name;
- publication type (`journal`, `conference`, `preprint`);
- one or more controlled topics;
- an original concise OpenEUV summary;
- explicit claim/lab IDs only where the repository relationship is real.

Do not copy full copyrighted papers into the repository without redistribution rights. A public preprint, conference paper or academic proposal is not proof that a vendor uses the described concept in a production scanner/process.

## Research snapshot/export contributions

Create a reproducible snapshot with an explicit timestamp:

```bash
npm run research:snapshot -- --generated-at 2026-08-08T12:00:00.000Z > snapshot.json
```

Validate and compare snapshots locally:

```bash
npm run research:snapshot:verify -- snapshot.json
npm run research:snapshot:diff -- before.json after.json
```

Snapshots contain **public repository metadata** only. They must not include IP addresses, user-agent strings, hardware identifiers, usernames/emails, browser history/storage, cookies, tokens, passwords or authorization values.

Snapshot diff compares canonical records by stable IDs and does not infer semantic equivalence. A timestamp-only change is metadata, not a research-content change.

## Accessibility contributions

Preserve the first-focusable skip link, one main landmark, labeled/listbox global search, polite status region, focus-visible behavior and reduced-motion contract.

Run:

```bash
npm run audit:a11y
npm run e2e
```

The static audit is a regression contract, not a substitute for real assistive-technology/manual testing.

## Search contributions

Atlas Search is local-only. Search contributions must:

- index only repository-public metadata;
- avoid external telemetry/search services and query persistence;
- preserve EN/VI behavior and keyboard accessibility;
- keep deterministic ranking/deep-link tests;
- retain shared evidence/DOI/patent IDs rather than translating identity.

## 3D contributions

Original OpenEUV assets and procedural geometry are preferred. Good contributions include evidence-bounded glTF/GLB concept geometry, reproducible generators, stable named nodes, LOD/fallback improvements and labels/tours with explicit geometry status.

Do not submit copied proprietary CAD, private service models, leaked internal drawings, exact confidential dimensions/tolerances or geometry extracted from unauthorized material.

## Assembly / education contributions

Assembly stages may carry stable IDs, EN/VI explanation, `claimIds`, `atlasNodes`, learning links, bilingual research questions and evidence boundaries. Empty mappings are allowed and should remain visible gaps instead of being filled with weak evidence.

L0→L5 checkpoints live in `evidence/learning-checkpoints.json`. Questions should test conceptual/public-source understanding rather than proprietary trivia or practical hazardous operating procedures.

## Physics / imaging contributions

Document assumptions, normalization/units, validity range and omitted effects. Current examples are multilayer interference, Fourier/MTF, mirror/vacuum intuition, mask-3D and image-quality concept models.

Do not present generic educational models as commercial scanner predictors, process windows, proprietary correction models or production settings. Do not add practical instructions for building or operating hazardous EUV-source, laser, plasma or vacuum systems.

## Optical-data contributions

Measured optical data must have lawful public provenance and redistribution permission suitable for repository inclusion. Pin the upstream record/revision when practical, preserve bibliography/license metadata and do not silently extrapolate outside the source range.

The CC0 Mo/Windt dataset is the positive example. Silicon around 13.5 nm remains a verified data/license gap; do not resolve it by unsupported extrapolation or copying an ambiguous-rights table.

## Patent contributions

Include publication/family IDs, priority/publication dates, subsystem links, public assignee/application metadata when available, public URL and an original concise summary.

A patent is evidence of a disclosed concept, not proof that its drawing equals production geometry. Do not copy patent figures merely because the patent is public.

## Fab / mask-lifecycle contributions

`evidence/fab-cases.json` is the runtime/validation source of truth. A case follows:

`public fact → why it matters → public boundary → explicit unknowns`

Prefer first-party sources. Do not infer confidential recipes, layer choices, yield, internal layouts, cleaning chemistry, inspection thresholds or private scanner/process settings.

## Renderer/performance contributions

WebGL remains the production baseline. Real benchmark submissions must use OpenEUV method v2 and actual hardware. Do not submit Playwright/headless/emulator results or estimated/fabricated numbers as hardware evidence. Issue #27 remains open until the defined real-device coverage is met.

## Translation contributions

EN/VI share the same evidence IDs, source URLs, DOI/patent IDs, units and confidence values. Translate explanations, not evidence identity.

## Manual deployment contributions

Cloudflare deployment uses the provenance-aware local helper:

```bash
npm run deploy:cloudflare:dry
npm run deploy:cloudflare
```

The helper records the exact Git HEAD, refuses dirty trees by default and runs the repository gate before a real deploy. `--allow-dirty` and `--skip-check` are explicit operator overrides, not normal release workflow. Never log or commit Cloudflare credentials/tokens.

See `docs/DEPLOYMENT.md`.

## Contribution report

A useful issue/PR report includes:

- problem or research question;
- files changed;
- evidence/source/provenance when applicable;
- assumptions and unknowns;
- checks actually run;
- screenshots for visual changes where useful;
- risks/limitations;
- what remains unverified.

The project values transparent uncertainty. `Unknown` is better than an impressive-looking unsupported claim.
