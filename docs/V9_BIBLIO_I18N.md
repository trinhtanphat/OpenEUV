# V9 bibliography export and EN/VI coverage QA

V9 improves research handoff and bilingual regression protection without adding a second factual registry, external telemetry or automatic GitHub Actions.

## Deterministic academic citation export

Citation export is derived directly from the canonical `evidence/literature.json` registry through `src/lib/literatureCitation.mjs`.

Supported formats:

- BibTeX
- CSL-JSON

The exporter preserves only metadata OpenEUV actually stores:

- DOI;
- title;
- year;
- authors;
- public source URL/name;
- publication type.

It intentionally does **not** fabricate publisher, volume, issue or page metadata that is absent from the curated registry. It also does not copy abstracts/full paper text into the export.

### Citation keys

Citation keys are deterministic and combine:

1. a normalized first-author token;
2. publication year;
3. an FNV-1a hash derived from the DOI.

If a generated base key still collides inside one export, deterministic `-2`, `-3`, ... suffixes are applied.

Author strings are emitted literally in CSL-JSON instead of guessing given/family-name boundaries.

### Local CLI

Write BibTeX to stdout:

```bash
npm run literature:export -- --format bibtex
```

Write CSL-JSON to stdout:

```bash
npm run literature:export -- --format csl-json
```

Write to a file:

```bash
npm run literature:export -- --format bibtex --output openeuv-literature.bib
npm run literature:export -- --format csl-json --output openeuv-literature.csl.json
```

The CLI validates the literature registry before exporting and refuses structurally invalid records.

### Browser export

The Literature Explorer provides:

- **Copy BibTeX**
- **Download CSL-JSON**

Browser export applies to the **currently filtered literature records only**. Clipboard/download behavior remains local; no bibliography is uploaded to a server.

This is bibliography metadata tooling, not redistribution of paper content.

## EN/VI structural coverage audit

Run:

```bash
npm run audit:i18n
npm run audit:i18n:json
```

The audit checks three canonical bilingual surfaces:

1. the `copy.en` / `copy.vi` dictionary in `src/i18n.ts`;
2. machine-readable bilingual learning checkpoints in `evidence/learning-checkpoints.json`;
3. the required EN/VI field structure in `src/data/learningPath.ts`.

It detects:

- missing EN/VI pairs;
- empty bilingual values;
- obvious placeholder-only values such as `TODO`, `TBD` or `???`;
- unsupported language identifiers where a bilingual object is expected;
- duplicate flat translation keys where they can be determined from the source dictionary;
- missing bilingual learning-path field structures.

Technical identifiers such as DOI strings, claim IDs, patent IDs and internationally shared terms are **not** considered translation failures simply because they are language-neutral.

The audit is wired into repository preflight.

## Important limitation

A structural EN/VI coverage pass means required bilingual fields exist and are non-placeholder. It does **not** mean every technical translation has been reviewed by a native-speaking domain expert.

Human linguistic review remains valuable, especially for specialized semiconductor terminology.

## Local verification policy

GitHub Actions remains intentionally disabled. Before claiming V9 verified, run locally:

```bash
npm install
npm run check
npx playwright install chromium
npm run e2e
```

A successful push alone is not proof that the production build or browser suite passed.

## External-only dependencies

V9 does not change the two existing evidence requirements that cannot be satisfied synthetically:

- issue #27 still needs real WebGL/WebGPU captures on actual hardware;
- issue #29 still needs genuine human evidence reviews with real public reviewer handles.
