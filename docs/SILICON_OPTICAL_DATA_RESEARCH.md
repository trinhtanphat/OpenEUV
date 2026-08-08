# Silicon EUV Optical-Constants Research Gap

OpenEUV currently vendors a pinned CC0 Mo/Windt optical-constants dataset, while the simulator's default silicon-like layer remains explicitly **illustrative**.

This is intentional. Public visibility of a numerical table is not the same as permission to redistribute that table inside a public software repository.

## Target

Issue #28 seeks a silicon optical-constants record that:

1. covers the EUV neighborhood around 13.5 nm inside the source range;
2. has a clear lawful public source and bibliography;
3. has redistribution terms that permit inclusion in OpenEUV;
4. can be pinned to an exact upstream record/revision;
5. can be regression-tested against original source samples without extrapolation.

## Research findings

### CXRO / Lawrence Berkeley National Laboratory

The CXRO optical-constants resources publicly list revised silicon data covering an energy range that includes the 13.5 nm EUV neighborhood and cite silicon-specific EUV literature by Soufli/Gullikson and related authors.

This is strong evidence that suitable silicon measurements/data exist publicly.

However, OpenEUV has **not** established a redistribution license for copying the numerical CXRO silicon table into this repository. Therefore the data is not vendored at this time.

### refractiveindex.info database

The refractiveindex.info database explicitly waives copyright/database rights under CC0, which is why the pinned Mo/Windt record can be safely redistributed with provenance.

A matching silicon record with the required EUV-range coverage and equivalent provenance was not identified during the current audit. Existing silicon records checked during the audit did not provide a clean drop-in replacement for the desired 13.5 nm range under the same record/revision workflow.

### Open-source X-ray libraries

An open-source code license does not automatically grant redistribution rights to every upstream numerical dataset a package may reference or derive from. OpenEUV should not vendor generated silicon values merely because a library's source code is open without first checking the provenance and data-license chain.

## Current decision

Keep Layer B in the multilayer simulator as **illustrative Si-like** unless the user explicitly loads another provenance-valid dataset.

Do not:

- copy a public web table whose redistribution terms are unclear;
- extrapolate a visible-range silicon dataset down to EUV wavelengths and call it measured data;
- mix values from unrelated sources into a synthetic "measured" table;
- strip bibliography/license information;
- imply that public optical constants reveal a commercial mirror stack or coating recipe.

## What would close #28

A contributor can close the issue by supplying one of:

- a CC0/public-domain silicon EUV dataset;
- a dataset under another license that clearly permits redistribution in an MIT-licensed public repository;
- explicit permission from the data owner to redistribute the relevant numerical record.

The contribution should pin the upstream revision, preserve bibliography/license metadata, register the dataset in `datasets/manifest.json`, add source-sample regression tests and keep extrapolation outside the supported range disabled/visible.

Until then, the missing dataset is an explicit research gap rather than a guessed value.
