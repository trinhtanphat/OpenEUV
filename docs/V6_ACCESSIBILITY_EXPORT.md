# V6 accessibility, provenance overview and research snapshot

V6 improves contributor usability without changing OpenEUV's public-source boundary.

## In-browser provenance overview

The `#provenance-overview` panel reuses the same `summarizeProvenance()` helper as the local provenance CLI. It shows:

- evidence claim counts by Class A/B/C/D/?;
- review-state coverage and the real-review campaign count;
- unresolved unknown count;
- patent metadata completeness summary;
- fab-case direct-source coverage;
- explicit data/license gaps.

These numbers are bookkeeping. They do **not** rank commercial importance, scientific importance, production use, vendor quality or likelihood that a patent drawing matches production geometry.

## Privacy-safe research snapshot

The panel can copy or download a JSON snapshot generated entirely in the browser. The snapshot contains repository-public metadata only:

- evidence claims and unknowns;
- fab-case metadata;
- dataset manifest entries;
- evidence-review coverage summary;
- provenance coverage summary.

The helper requires an explicit `generatedAt` timestamp so deterministic tests do not depend on hidden time state.

The snapshot intentionally excludes client/private state including:

- IP addresses;
- browser user-agent strings;
- hardware concurrency/device-memory values;
- usernames/emails;
- browser history;
- `localStorage` / `sessionStorage`;
- cookies, credentials, tokens or authorization data.

The export uses `Blob`/clipboard APIs locally and makes no upload/network request.

Implementation:

- `src/lib/researchSnapshot.mjs`
- `src/components/ResearchStatusPanel.tsx`
- `tests/research-snapshot.test.mjs`
- `e2e/v6-accessibility-export.spec.ts`

## Accessibility hardening

V6 adds:

- a visible-on-focus **Skip to main content** link;
- separate top-level `header` and `main#main-content` landmarks;
- stable scroll margins for hash navigation under the sticky header;
- focus-visible styling for primary navigation/actions;
- keyboard-only checkpoint/search coverage;
- reduced-motion-aware stateful search navigation;
- a CSS reduced-motion guard that disables nonessential animation/smooth scrolling when the OS/browser requests reduced motion.

The motion decision is tested through `src/lib/motionPreference.mjs` and `tests/motion-preference.test.mjs`.

## Local verification

GitHub Actions remains intentionally disabled. Run locally before claiming V6 verified:

```bash
npm run check
npm run e2e
```

A pushed commit is not automatically a verified build.
