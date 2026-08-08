# OpenEUV Language Workflow

OpenEUV keeps **one shared technical/evidence model** and multiple presentation languages.

## Documentation switch

- English project overview: [`../README.md`](../README.md)
- Vietnamese project overview: [`../README.vi.md`](../README.vi.md)
- Vietnamese getting started: [`GETTING_STARTED.vi.md`](GETTING_STARTED.vi.md)

If a page does not yet have a translation, the English page is the canonical fallback. Contributors should translate the explanation, not duplicate the underlying evidence records.

## Never translate these identifiers

Keep these values exactly shared across languages:

- claim IDs;
- unknown IDs;
- patent/publication/application numbers;
- DOI values;
- source URLs;
- evidence classes A/B/C/D/?;
- SI/technical units and standard abbreviations such as EUV, NA, nm, X/Y/Z, Rx/Ry/Rz.

## Terminology workflow

The application glossary lives in `src/data/glossary.ts`.

When changing a term:

1. Keep the internationally recognized English term.
2. Add a precise Vietnamese working translation.
3. Preserve the English term in parentheses when it is commonly used directly by engineers, for example `overlay`, `reticle`, `wafer stage`, `metrology`.
4. Explain the concept rather than inventing a literal translation that changes its technical meaning.
5. Update EN and VI notes together when the concept definition changes.
6. Run `npm test`, `npm run typecheck` and Playwright browser tests.

## Fallback behavior

Application strings use a deterministic fallback helper. If a Vietnamese key is missing or empty, English is displayed. Tests in `tests/i18n-core.test.mjs` protect this behavior.

Long-form documentation follows the same policy manually: an untranslated page links readers to its English canonical version instead of showing an incomplete invented translation.

## Evidence translation boundary

Evidence UI labels may be translated, but the factual claim body can remain the canonical English record until a reviewed localization layer is added. This prevents divergent facts between language copies.

A future translated-claim presentation layer should reference the same claim ID rather than create new language-specific evidence records.
