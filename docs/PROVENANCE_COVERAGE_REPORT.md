# Provenance coverage report

OpenEUV provides a deterministic local report for inspecting sourcing/provenance coverage without manually opening every evidence/data file.

## Run it

Human-readable Markdown-style output:

```bash
npm run provenance:report
```

Machine-readable JSON:

```bash
npm run provenance:report:json
```

The report reads only repository-local metadata. It does not upload sources, queries or user data.

## What it summarizes

- evidence claims by Class A/B/C/D/?;
- evidence + unknown records by component;
- direct source domains;
- source organizations / patent assignees where repository metadata identifies them;
- review states (`reviewed`, `proposed`, `superseded`, `unreviewed`);
- claims with no direct public HTTP(S) source;
- Class D claims missing rationale;
- unresolved unknown records;
- curated patent count/families and average metadata completeness using the existing patent-audit criteria;
- fab-case direct-source coverage and invalid source URLs;
- explicit dataset/license/vendoring gaps such as the silicon-at-13.5-nm provenance gap.

## What the report does **not** mean

The report is coverage bookkeeping. It does not rank:

- commercial importance;
- scientific prestige;
- vendor quality;
- production adoption;
- likelihood that a patent drawing matches production geometry.

OpenEUV evidence classes keep their existing meaning; source frequency is not evidence strength.

## Patent metadata adapter guard

`src/data/patents.ts` remains the runtime TypeScript source of truth. The CLI reads it without evaluating application code through `src/lib/patentSourceParser.mjs`.

The parser is brace-aware, ignores braces inside quoted strings and locates the data array **after the assignment operator**, so a TypeScript annotation such as `PatentRecord[]` cannot be mistaken for the record array. The CLI fails instead of silently reporting zero patent records if parsing no longer matches the source.

`tests/patent-source-parser.test.mjs` checks both repository data and formatting edge cases. This keeps provenance coverage from silently changing because of harmless TypeScript formatting.

## Attach it to a research discussion

When a PR or issue changes evidence, fab context, patent metadata or public datasets:

1. run `npm run provenance:report`;
2. paste the relevant report section into the PR/issue discussion, or attach the complete text output;
3. when machine comparison is useful, run `npm run provenance:report:json` and attach/save the JSON output;
4. explain intentional remaining gaps rather than changing evidence state merely to make coverage numbers look better.

A known research gap is not automatically a failure. Missing direct source links, invalid URLs, missing inference rationale or patent audit errors are stronger integrity concerns and should be corrected before claiming the metadata change is complete.

## Implementation

- `src/lib/provenanceReport.mjs` — deterministic summary + Markdown rendering.
- `src/lib/patentSourceParser.mjs` — non-evaluating TypeScript patent-record adapter.
- `tools/provenance-report.mjs` — repository-local CLI.
- `tests/provenance-report.test.mjs` — source-domain/organization, review state, missing-source, rationale, fab, unknown and license-gap coverage.
- `tests/patent-source-parser.test.mjs` — parser regression coverage against the real patent source and formatting variants.

The command is intentionally local; GitHub Actions remains disabled unless the project owner explicitly changes that policy.
