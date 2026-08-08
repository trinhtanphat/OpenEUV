# Evidence Review Workflow

OpenEUV keeps factual evidence records stable and stores collaborative review metadata separately in [`evidence/reviews.json`](../evidence/reviews.json).

## States

- `proposed` — evidence exists in the repository but collaborative review is not yet recorded;
- `reviewed` — at least one public reviewer handle is recorded;
- `superseded` — a newer evidence record replaces or materially narrows the older record.

Allowed lifecycle:

```text
proposed → reviewed → superseded
```

Records cannot move backward from `reviewed` to `proposed`, and a superseded record stays in history rather than being silently deleted.

## Attribution

The registry accepts public contributor/reviewer handles only. Do not add private email addresses, real-world contact data, credentials or other personal information.

Attribution metadata does not change who owns an upstream paper, patent or manufacturer page; it records who contributed/reviewed the OpenEUV evidence mapping.

## Supersession

A superseded review record must reference another known evidence ID using `supersededBy`.

Use supersession when, for example:

- a first-party source publishes a clearer statement that narrows an older inference;
- a newer patent-family record makes an earlier metadata summary incomplete;
- an academic source corrects an educational assumption.

Do not rewrite old claim history to make the project look retrospectively certain.

## Current integration status

The review registry and transition validator are available as a Depth-v3 foundation. The existing claim IDs and evidence files remain backward-compatible.

UI review badges and direct integration into the main evidence validator/dashboard remain an open contributor task until the full review-state schema is adopted across all evidence surfaces.
