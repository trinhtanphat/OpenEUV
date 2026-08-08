# Evidence Review Campaign

OpenEUV supports collaborative evidence review, but review attribution must correspond to **real human review work**. The repository must never fabricate reviewer names or mark records reviewed simply to improve coverage statistics.

## Generate a review queue

Run:

```bash
node tools/evidence-review-queue.mjs --limit 12
```

JSON output:

```bash
node tools/evidence-review-queue.mjs --limit 12 --json
```

The queue is deterministic for the same repository state. It:

- excludes records already `reviewed` or `superseded`;
- keeps `proposed` records eligible for review;
- places up to two open unknowns first, ordered by priority;
- then round-robins claims across evidence Classes A/B/C/D/?;
- orders records within a class by confidence and stable ID;
- never generates contributor/reviewer identity.

The queue is a triage aid, not a truth score. Class and confidence affect ordering only so a campaign covers different evidence types.

## Review one record

For each queue item:

1. Open the cited public source(s).
2. Verify the source actually supports the smallest wording used by OpenEUV.
3. Check dates, organization/assignee, identifiers, quantities and scope.
4. Confirm OpenEUV did not turn a patent disclosure, illustrative geometry or public milestone into a stronger production claim.
5. Record material limitations or a narrower interpretation when needed.
6. Only after a real review, add the public reviewer handle and transition the record according to `docs/EVIDENCE_REVIEW.md`.

If the record is wrong or stale, prefer correction/supersession with preserved history over silently rewriting evidence identity.

## Campaign completion target

Issue #29 targets an initial real review set of at least 10 high-impact records spanning multiple evidence classes and/or open unknowns.

A useful completion report should include:

- reviewed IDs;
- public reviewer handles;
- any wording/source changes;
- supersession links when applicable;
- unresolved questions;
- output of the evidence-review registry validator/report.

## Privacy and sourcing

Use public GitHub handles only after the person actually reviewed the record. Do not store private email addresses, account IDs or unrelated personal information.

Do not use leaked/confidential documents, trade secrets, proprietary service material, credentials or unverifiable anonymous claims as review evidence.
