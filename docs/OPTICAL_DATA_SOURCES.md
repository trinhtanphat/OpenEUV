# Public Optical-Constants Sources

OpenEUV can load wavelength-dependent optical constants, but it must not silently copy third-party datasets whose redistribution terms are unclear.

## Candidate source: refractiveindex.info database

The public `polyanskiy/refractiveindex.info-database` repository publishes a database license file and material data files separately from the OpenEUV repository. The database is distributed under **CC0 1.0 Universal** according to its repository license.

OpenEUV therefore treats this database as a candidate source for lawfully redistributable optical-constant samples, subject to all of the following checks before a dataset is vendored:

1. record the exact upstream file path and revision/commit;
2. preserve the upstream database/source references contained in the material file;
3. keep the dataset license/provenance metadata alongside the samples;
4. import only the numerical data needed by the educational adapter;
5. never reinterpret the data as a production EUV coating recipe;
6. do not combine a public optical dataset with proprietary thicknesses, interface models or mirror prescriptions and present the result as commercial hardware.

Upstream repository:

- `https://github.com/polyanskiy/refractiveindex.info-database`
- license: `https://github.com/polyanskiy/refractiveindex.info-database/blob/master/LICENSE`

## Mo / Si candidates

The upstream database contains multiple Mo and Si optical-data records. OpenEUV should not assume that a record named after an author is automatically the best EUV source. A contributor importing a record must document:

- material;
- upstream record/file;
- wavelength range;
- original reference embedded in the record;
- whether 13.5 nm lies inside the tabulated range rather than being extrapolated;
- the exact OpenEUV dataset version created from that upstream record.

The existing browser adapter in `src/lib/opticalConstants.mjs` already rejects datasets without source URL, license and non-empty numerical samples.

## Import status

**No measured Mo/Si n/k values are vendored by this document.** This is deliberate: source-license verification is only the first gate. A future import should pin an upstream revision and retain record-level provenance before closing Physics V3 issue #19.

Until then, the multilayer UI continues to default to explicitly **illustrative** constants and may load a user-supplied public dataset that passes the provenance validator.
