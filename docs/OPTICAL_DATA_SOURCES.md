# Public Optical-Constants Sources

OpenEUV can load wavelength-dependent optical constants, but it must not silently copy third-party datasets whose redistribution terms are unclear.

## Current checked-in public dataset

OpenEUV currently vendors one measured optical-constants dataset:

- dataset ID: `RIINFO-MO-WINDT-1988-R6F3B772`;
- material: molybdenum (Mo);
- repository path: `public/datasets/optical/mo-windt-1988.json`;
- upstream record: `database/data/main/Mo/nk/Windt.yml` from `polyanskiy/refractiveindex.info-database`;
- pinned upstream revision: `6f3b772c3339d68a21538cb2562d2acb36731302`;
- upstream database license: CC0 1.0 / public-domain waiver;
- original reference: D. L. Windt et al., *Applied Optics* 27, 246–278 (1988), DOI `10.1364/AO.27.000246`;
- the checked-in record includes the source point at **13.55 nm: n = 0.9413, k = 0.00604**.

OpenEUV converts the source wavelength unit from micrometres to nanometres. The checked-in samples are not fitted or extrapolated in the dataset file.

## Upstream source: refractiveindex.info database

The public `polyanskiy/refractiveindex.info-database` repository publishes optical-data records with a CC0 public-domain waiver. A new OpenEUV import from this database must still record the exact upstream file and revision rather than citing only the database homepage.

Upstream repository:

- `https://github.com/polyanskiy/refractiveindex.info-database`
- license: `https://github.com/polyanskiy/refractiveindex.info-database/blob/master/LICENSE`

## Import requirements

Before vendoring another optical dataset:

1. record the exact upstream file path and revision/commit;
2. preserve the upstream database/source references contained in the material file;
3. keep license and provenance metadata alongside the numerical samples;
4. record the wavelength range and units;
5. state whether the EUV wavelength of interest lies inside the source range;
6. avoid silent extrapolation;
7. register the dataset in `datasets/manifest.json`;
8. add regression tests for at least one original source sample;
9. never reinterpret measured n/k data as a production coating recipe;
10. do not combine public constants with proprietary thicknesses, interface models or mirror prescriptions and present the result as commercial hardware.

## Silicon status

The multilayer UI still labels the default Layer B as **illustrative Si-like** unless the user supplies another provenance-valid dataset.

OpenEUV does not currently vendor a measured Si record covering the EUV neighborhood with the same level of pinned provenance used for Mo/Windt. The project intentionally keeps that gap visible rather than extrapolating or mixing unrelated records and presenting the result as measured 13.5 nm silicon data.

## Browser behavior

`src/lib/opticalConstants.mjs` validates source URL, redistribution/license note and numerical samples before accepting an imported dataset.

The Multilayer Simulator can load the built-in Mo/Windt dataset directly. When a wavelength falls between tabulated points, the educational adapter may interpolate according to its documented behavior; when outside a dataset range, the UI must visibly indicate endpoint/extrapolation behavior rather than silently treating it as measured data.

## Evidence boundary

Measured optical constants improve the educational model, but they do **not** make OpenEUV a predictive production mirror model. Interface roughness, interdiffusion, graded layers, proprietary mirror prescriptions, real coating-process conditions and production correction models remain separate questions and must only be added with explicit public assumptions and evidence.
