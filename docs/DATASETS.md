# OpenEUV Public Dataset Workflow

OpenEUV publishes **metadata compilations and original reconstructions**, not copies of restricted source material.

## Manifest

Every repository dataset that is intended to be reusable should be registered in [`datasets/manifest.json`](../datasets/manifest.json).

Required metadata:

- stable dataset ID;
- semantic version;
- repository-relative path;
- dataset kind;
- source / provenance origin;
- license or redistribution note;
- provenance explanation;
- schema identifier;
- optional SHA-256 checksum for release artifacts.

## Versioning

Use semantic versioning for the OpenEUV compilation:

- **PATCH** — corrections that do not change the record contract;
- **MINOR** — backward-compatible records/fields or additional public-source entries;
- **MAJOR** — incompatible schema or meaning changes.

Upstream papers, patents and manufacturer/foundry pages retain their own rights. Versioning an OpenEUV metadata compilation does not relicense upstream material.

## Release checklist

1. Confirm every included record has a lawful public source or is original OpenEUV material.
2. Confirm redistribution terms before copying any third-party bytes; prefer metadata + links.
3. Update the relevant schema/validator first when the record contract changes.
4. Update `datasets/manifest.json` and bump the dataset version.
5. Run `npm test` and `npm run check`.
6. For generated release files, build deterministically and record a SHA-256 checksum in release metadata where useful.
7. Document removed/superseded records rather than silently rewriting research history.

## Not allowed

Do not package leaked confidential documents, proprietary CAD/service manuals, paywalled full papers, private fab recipes, credentials, or other restricted material into an OpenEUV dataset.

For external material where redistribution rights are unclear, store only the minimum bibliographic/provenance metadata and a lawful public link.
