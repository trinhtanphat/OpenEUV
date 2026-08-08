# Provenance coverage report

OpenEUV treats source quality, review state and explicit gaps as part of the product rather than hidden maintainer knowledge.

Run:

```bash
npm run provenance:report
npm run provenance:report:json
```

The report summarizes:

- evidence claims by Class A/B/C/D/?;
- evidence by component;
- public source-domain coverage;
- reviewed/proposed/superseded/unreviewed counts;
- claims with no direct public HTTP(S) source;
- Class D records missing a written rationale;
- open unknown IDs;
- curated patent-family metadata completeness and audit status;
- fab-case direct-source coverage;
- explicit public-data/license gaps such as the current silicon-at-13.5-nm decision.

## What the report does not mean

A high source count does not mean a subsystem is commercially more important. Patent metadata completeness does not prove production use. First-party, patent and academic sources answer different questions; the report preserves OpenEUV evidence classes rather than combining them into a single opaque score.

## Contributor workflow

When proposing a research/data change:

1. run `npm run provenance:report` before editing;
2. make the evidence/data change with public source links and explicit boundaries;
3. run `npm run preflight` and `npm test`;
4. attach the relevant before/after report excerpt to the issue or PR when it helps explain improved coverage.

Do not improve the report by inventing reviewer identities, copying license-ambiguous numerical tables, or adding weak URLs merely to increase counts.

The provenance coverage audit is included in the local repository preflight. GitHub Actions remains intentionally disabled.
