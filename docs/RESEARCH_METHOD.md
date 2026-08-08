# Public-source Reconstruction Method

OpenEUV uses a repeatable evidence-first research loop. The goal is not to imitate proprietary CAD or collect secret files; the goal is a transparent engineering map whose claims can be challenged and improved.

## 1. Anchor

Start with first-party public statements from manufacturers, foundries, research institutions and other directly responsible organizations.

Record the smallest claim the source actually supports. Do not inflate a marketing/process milestone into undocumented scanner geometry, process recipes or internal fab details.

## 2. Disclose

Locate relevant published patents, standards and other lawful disclosures.

Patents are Class B evidence of disclosed concepts. They are not proof that a drawing is the exact current production machine. Record family/publication metadata and use original OpenEUV summaries rather than copying figures into the repository.

## 3. Cross-check

Compare academic literature, public datasets and independent technical models.

For numerical data, record:

- source;
- exact upstream record/revision when practical;
- units and validity range;
- redistribution/license status;
- interpolation/extrapolation behavior;
- model assumptions and omitted effects.

## 4. Reconstruct

Create an original diagram, glTF model, interactive visualization or simulation that claims only what the evidence supports.

Keep functional evidence and geometry fidelity separate. A component can be a well-documented function while its teaching geometry remains illustrative.

## 5. Tag uncertainty

Use the shared evidence classes:

- **A** — first-party public source;
- **B** — published patent / public standard;
- **C** — academic/public research;
- **D** — public-source inference with explicit rationale;
- **?** — insufficient lawful public evidence.

For 3D/diagram geometry, separately use statuses such as documented-function, inferred or illustrative.

Unknowns are first-class records. If a proprietary dimension, interface or recipe cannot be established lawfully, mark it unknown instead of guessing.

## 6. Link evidence to product surfaces

Reuse the same claim IDs across:

- Evidence Dashboard;
- Contextual Evidence Inspector;
- 3D concept labels;
- patent/fab case studies;
- EN/VI explanations;
- datasets and contributor documentation.

This prevents different pages/languages from quietly inventing different factual bases.

## 7. Review

Evidence review metadata supports:

`proposed → reviewed → superseded`

A review entry may record public contributor/reviewer handles and a supersession target. Do not fabricate reviewer attribution. Records remain `unreviewed` until a real review happens.

Local validation checks state transitions, references and known IDs.

## 8. Reproduce

Code/data changes should be locally reproducible:

```bash
npm run check
npm run e2e
```

GitHub Actions is intentionally disabled, so a successful push is not verification.

For renderer performance work, use the versioned benchmark methodology in `benchmarks/README.md`. Emulator/test fixtures verify software behavior only; they do not count as hardware evidence.

## 9. Publish boundaries with the result

Every major model/case should make three things visible:

1. what is supported;
2. what is inferred/illustrative;
3. what remains unknown.

A strong OpenEUV contribution should become *more trustworthy* when its limitations are read, not less.

## Non-negotiable sourcing boundary

Do not submit stolen/hacked documents, leaked confidential/trade-secret material, proprietary CAD/service manuals without redistribution rights, private fab recipes, credentials or hazardous real-world operating instructions.

The project is intentionally designed so public evidence, original reconstruction, reproducible simulations and explicit uncertainty are enough to make useful research progress.
