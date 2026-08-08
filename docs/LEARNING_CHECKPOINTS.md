# Evidence-aware learning checkpoints

OpenEUV includes one lightweight self-check for each L0→L5 learning level. The checkpoints are designed to test conceptual understanding while reinforcing the project’s evidence boundaries.

## Scope

The questions cover public/educational concepts already represented in OpenEUV:

- L0 — lithography and pattern transfer;
- L1 — numerical aperture and spatial-frequency intuition;
- L2 — EUV absorption, reflective optics and vacuum context;
- L3 — systems-engineering boundaries between documented, inferred, illustrative and unknown information;
- L4 — public High-NA anamorphic 4×/8× concepts;
- L5 — evidence classes and the requirements for Class D public-source inference.

They do **not** test memorization of proprietary dimensions, private process settings, commercial mirror prescriptions, service procedures or hazardous operating instructions.

## Privacy / progress behavior

Checkpoint progress is held only in React component state for the current page session.

OpenEUV does not:

- create an account for checkpoint progress;
- write answers to localStorage/sessionStorage;
- send answers to a server;
- add analytics or telemetry for answer choices.

Reloading the page clears the progress.

## Evidence-aware feedback

After an answer is selected, the UI shows:

- whether the answer should be reviewed or is correct;
- an EN/VI explanation;
- internal links to the relevant lab, Evidence Dashboard record, Assembly Explorer or glossary where appropriate.

A checkpoint explanation must not increase certainty beyond the linked evidence.

## Data source and validation

The machine-readable checkpoint source is:

`evidence/learning-checkpoints.json`

The TypeScript adapter is:

`src/data/learningCheckpoints.ts`

Validation is handled by:

`src/lib/learningCheckpointValidation.mjs`

and is executed by the repository preflight. Validation requires:

- unique checkpoint IDs;
- a known learning-level ID;
- EN + VI prompt/explanation/options;
- at least two options;
- a valid `correctIndex`;
- internal `#` links only;
- coverage for every current L0→L5 level.

Unit coverage lives in `tests/learning-checkpoints.test.mjs` and browser behavior in `e2e/learning-checkpoints.spec.ts`.

## Contributor rule

When adding or changing a checkpoint:

1. test understanding rather than vendor-specific trivia;
2. keep the correct answer derivable from public/educational material already in OpenEUV;
3. link to evidence/labs where useful;
4. keep EN/VI meaning aligned;
5. run `npm run check` and `npm run e2e` locally before claiming full verification.

GitHub Actions remains intentionally disabled.
