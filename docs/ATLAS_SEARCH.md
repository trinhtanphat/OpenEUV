# Atlas search methodology

OpenEUV V5 provides a **local-only browser search** across repository data. It does not send queries, identifiers or usage analytics to an external search service.

## Indexed content

The deterministic index is assembled from existing OpenEUV data at build time:

- scanner subsystems;
- evidence claims and open unknowns;
- public patent metadata;
- fab/mask-lifecycle cases;
- Assembly Explorer stages;
- L0→L5 learning levels;
- direct learning-lab destinations;
- bilingual glossary entries.

Evidence claim IDs, patent IDs and source-derived metadata stay unchanged. Search snippets do not alter claim confidence, evidence class or review state.

## Ranking

`src/lib/atlasSearch.mjs` normalizes accents/case and uses a deterministic score. Exact IDs and exact titles rank highest, followed by prefix/title matches, subtitle/keyword matches and multi-token coverage. Stable source order is used as a tie-breaker.

This is navigation relevance, not scientific relevance. A higher search score does not mean stronger evidence.

## Navigation

Results use stable in-page destinations whenever possible:

- evidence/unknown IDs → their Evidence Dashboard records;
- patents → patent cards;
- fab cases → exact case-card anchors;
- Assembly/Learning results → activate the matching UI item;
- labs → exact lab section anchors;
- subsystems → the matching 3D subsystem selection.

The input supports Arrow Up/Down, Enter and Escape and exposes listbox/option accessibility state.

## Privacy and sourcing boundary

Search only indexes content already present in the lawful public-source OpenEUV repository. It must not become a crawler for leaked/private material, credentials, proprietary service documentation or confidential process data.

## Verification

- `tests/atlas-search.test.mjs` covers normalization/ranking/limits/direct lab results.
- `e2e/atlas-search.spec.ts` covers keyboard behavior plus evidence and lab navigation.
