# Contributing to OpenEUV

OpenEUV welcomes contributors from frontend, 3D, optics, physics, semiconductor manufacturing, patent research, public-data engineering, technical writing, translation and QA.

The project is intentionally public-source. The interesting challenge is not collecting secret files; it is building the clearest evidence-backed reconstruction possible while distinguishing **documented, inferred, illustrative and unknown** information.

## Before starting

1. Read `SOURCING_POLICY.md`.
2. Browse the interactive atlas, Assembly Explorer, Learning Path and current open issues.
3. Check existing claim IDs, patent/literature metadata and concept-node labels before creating duplicates.
4. State whether your proposed geometry/fact is documented, public-source inference or illustration.
5. Prefer a small reproducible contribution over a large unverifiable dump.

## GitHub Actions policy

**GitHub Actions is intentionally disabled.** Do not add or re-enable automatic workflow files without an explicit maintainer/project-owner decision.

Successful GitHub push/commit status is not proof that code builds. Contributors and maintainers should verify changes locally.

## Local verification

For normal code/data changes:

```bash
npm install
npm run validate:evidence
npm test
npm run typecheck
npm run build
```

Equivalent combined command:

```bash
npm run check
```

For UI/3D/browser changes:

```bash
npx playwright install chromium
npm run e2e
```

If you cannot run a required check, say so clearly in the issue/PR instead of writing `PASS` from assumption.

## Evidence classes

| Class | Use |
| --- | --- |
| A | First-party manufacturer/foundry/public institutional source |
| B | Published patent / standard |
| C | Academic/public research source |
| D | Public-source inference with explicit rationale |
| ? | Unknown / insufficient lawful public evidence |

Class D is not a weaker way to state a rumor as fact. It requires a written rationale and lawful sources. Local validation scripts check required fields and references.

## Evidence review states

Evidence review metadata can be:

- `proposed`
- `reviewed`
- `superseded`

Use public contributor/reviewer handles only. Do not add private names, emails, account IDs or other unnecessary personal information. Do not mark a record `reviewed` unless a real reviewer performed the review. If nobody has reviewed it yet, leave it `unreviewed` in the UI.

## 3D contributions

Original OpenEUV assets are preferred. Good contributions include:

- evidence-backed glTF/GLB concept geometry;
- procedural asset generators;
- named component nodes for evidence linking;
- screen-space labels and tours;
- mobile/low-power LOD improvements;
- exploded-view improvements;
- diagrams and animations that explicitly state geometry status.

Do not submit copied proprietary CAD, service models, internal scanner drawings or geometry extracted from confidential material.

When public evidence supports a component's **function** but not its exact shape, model the function conceptually and label the geometry as illustrative/inferred.

## Assembly Explorer contributions

A new assembly/integration stage should contain:

- stable ID and subsystem;
- EN/VI title and summary;
- explanation of what public evidence supports;
- explicit boundary for what is not known;
- dependencies;
- learning outputs;
- `documented-function`, `public-inference` or `illustrative` status.

Assembly content must stay at educational systems-engineering level. Do not add hazardous laser/plasma operating procedures, proprietary installation steps, exact service tolerances or private calibration instructions.

## Physics and optical-data contributions

The browser simulations are educational models. A physics contribution should document assumptions, units, validity range and omitted effects.

For measured optical constants:

- source must be public and lawful;
- redistribution terms must permit inclusion;
- pin the exact upstream record/revision when practical;
- preserve bibliographic provenance;
- do not silently extrapolate outside the source range;
- keep illustrative fallback values visibly separate from measured datasets.

The checked-in Mo/Windt dataset demonstrates the expected provenance style.

Do not present a layer stack, source configuration or process parameter as a production recipe.

## Patent contributions

Patent research should include:

- publication ID;
- family ID/members when known;
- priority/publication dates;
- subsystem links;
- assignee/application metadata when public;
- public source URL;
- an original concise summary.

Use `tools/patent-metadata-normalize.mjs` and the patent audit helpers. The metadata completeness score measures field completeness only; it is not a ranking of commercial importance.

Do not copy patent figures into the repository merely because a patent is public. Link to the public record and build original diagrams/models where useful. Never present a patent drawing as confirmed production geometry.

## Academic/literature contributions

Use DOI/title/year/author/source metadata and original summaries. Do not copy paywalled/full copyrighted papers into the repository. Use `tools/literature-metadata-normalize.mjs` when preparing metadata imports.

## Fab case-study contributions

A case must follow:

`public fact → why it matters → public boundary → explicit unknowns`

Prefer first-party sources. Every quantitative/milestone statement should map to a shared evidence claim.

Do not infer confidential recipes, layer counts, yield, internal line layout, inspection thresholds, cleaning chemistry, scanner settings or private qualification criteria.

Use `tools/fab-case-validate.mjs` for candidate metadata.

## Renderer/performance contributions

WebGL remains the production baseline. WebGPU work must be evidence-driven.

Real benchmark submissions should follow `benchmarks/README.md` and `benchmarks/raw/RESULT_TEMPLATE.json`. Do not invent or estimate device results. Remove serial numbers, usernames, IP addresses and other private identifiers before committing raw benchmark metadata.

## Translation contributions

EN/VI share the same evidence IDs, source URLs, patent/publication IDs, units and confidence values. Translate explanations, not the evidence identity.

Keep international technical terms recognizable when useful, e.g. `reticle`, `overlay`, `wafer stage`, `High-NA`, `metrology`.

See `docs/LANGUAGES.md`.

## Suggested contribution tracks

- `[3D]` concept assets, LOD, labels and visual QA
- `[OPTICS]` NA, imaging, aberration and metrology learning tools
- `[PHYSICS]` public datasets and reproducible simulation improvements
- `[PATENT]` curated family metadata and provenance review
- `[FAB]` first-party manufacturing milestones with strict boundaries
- `[EVIDENCE]` sourcing, review states, supersession and unknowns
- `[EDU]` Assembly Explorer and L0→L5 learning material
- `[I18N]` technical translation
- `[QA]` unit/browser/accessibility/manual deployment checks
- `[PERF]` real-device renderer benchmarks

## Pull request / issue report

A useful contribution report includes:

- problem or research question;
- files changed;
- evidence class/source/provenance when applicable;
- assumptions and unknowns;
- local checks actually run;
- screenshots for visual changes when practical;
- risks/limitations;
- what remains unverified.

The project values transparent uncertainty. `Unknown` is better than an impressive-looking unsupported claim.
