# Evidence Review Workflow

OpenEUV keeps factual evidence records stable and stores collaborative review metadata separately in [`evidence/reviews.json`](../evidence/reviews.json).

## States

- `proposed` — a real contributor has proposed review metadata but review is not complete;
- `reviewed` — at least one public reviewer handle is recorded;
- `superseded` — a newer evidence record replaces or materially narrows the older record.

Allowed lifecycle:

```text
proposed → reviewed → superseded
```

Records cannot move backward from `reviewed` to `proposed`, and a superseded record stays in history rather than being silently deleted.

A claim/unknown with no registry entry is displayed as **`unreviewed`**. `unreviewed` is a UI-derived state, not a fabricated registry record.

## Attribution

The registry accepts public contributor/reviewer handles only. Do not add private email addresses, real-world contact data, credentials or other unnecessary personal information.

Attribution metadata does not change who owns an upstream paper, patent or manufacturer page; it records who contributed/reviewed the OpenEUV evidence mapping.

Do not invent reviewer handles simply to increase coverage statistics.

## Supersession

A superseded review record must reference another known evidence ID using `supersededBy`.

Use supersession when, for example:

- a first-party source publishes a clearer statement that narrows an older inference;
- a newer patent-family record makes an earlier metadata summary incomplete;
- an academic source corrects an educational assumption.

Do not rewrite old claim history to make the project look retrospectively certain.

## Current integration

Review-state support is integrated across the project:

- `evidence/reviews.json` stores review metadata;
- `src/lib/evidenceReview.mjs` validates registry structure and state transitions;
- `scripts/validate-evidence-reviews.mjs` validates references against current claim/unknown IDs;
- `npm run validate:evidence` runs both the core evidence validator and the review-registry validator;
- `npm run check` includes evidence/review validation before tests/typecheck/build;
- Evidence Dashboard shows review coverage;
- Contextual Evidence Inspector shows per-record review state and attribution;
- unit/browser tests cover valid/invalid transitions and rendering hooks.

## Empty registry behavior

An empty `reviews` array is valid. It means no real collaborative review attribution has been recorded yet.

The correct UI for that state is to show records as `unreviewed`, not to auto-populate `proposed` or `reviewed` entries.

## Review checklist

Before recording `reviewed`:

1. confirm the claim/unknown ID exists;
2. open the cited public source(s);
3. verify the wording does not overstate the source;
4. verify evidence class/confidence/rationale remain appropriate;
5. check that geometry/process claims are not being inferred from unrelated evidence;
6. record only public reviewer handles;
7. use supersession rather than deleting historical records when a newer claim replaces an older one.

## GitHub Actions policy

GitHub Actions is intentionally disabled. Review-state correctness is protected by the local validation/test gate, not an automatic GitHub workflow.

Run:

```bash
npm run check
npm run e2e
```

before claiming a review-system change is verified.
