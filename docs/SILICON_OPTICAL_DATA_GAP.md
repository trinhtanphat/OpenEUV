# Silicon optical-data gap at EUV wavelength

OpenEUV needs a measured silicon optical-constants dataset near **13.5 nm** before the simulator can replace its explicitly illustrative Si-like layer with measured Si data.

## Verified public candidates

### refractiveindex.info — redistributable, but out of range

The refractiveindex.info database is CC0/public domain. The pinned Si record `Franta-25C.yml` at upstream revision `6f3b772c3339d68a21538cb2562d2acb36731302` starts at **0.0309963 µm = 30.9963 nm**.

That record is safe to redistribute, but it does **not** cover 13.5 nm. OpenEUV therefore does not extrapolate it down to EUV and does not label any such extrapolation as measured silicon data.

### LBNL/CXRO + Soufli/Gullikson — in range, redistribution unresolved

The LBNL/CXRO optical-constants service covers the EUV region, and Soufli & Gullikson report measured Si optical constants over **50–180 eV**. 13.5 nm is approximately **91.84 eV**, so it is inside that published energy range.

However, public access is not the same thing as permission to redistribute a numerical table. OpenEUV has not verified terms that permit checking the relevant numerical dataset into this repository, so it is **not vendored**.

## Repository decision

Until a measured EUV-range Si dataset with verified redistribution rights is found:

- the second simulator layer remains explicitly illustrative;
- no visible/UV Si dataset is extrapolated to 13.5 nm and called measured data;
- no numerical table is copied from a public service merely because it can be viewed online;
- contributors may reopen the data path when they can pin an exact record, revision, bibliography and redistribution license.

The machine-readable decision lives in `evidence/optical-data-gaps.json` and is regression-tested by `tests/optical-data-gaps.test.mjs`.

## Sources checked

- refractiveindex.info database / CC0 upstream record: `database/data/main/Si/nk/Franta-25C.yml`
- LBNL/CXRO Index of Refraction service
- R. Soufli and E. M. Gullikson, *Applied Optics* 36, 5499–5507 (1997), DOI `10.1364/AO.36.005499`
