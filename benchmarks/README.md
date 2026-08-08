# Renderer benchmark results

OpenEUV keeps WebGL as the production baseline. WebGPU is an experimental candidate and must not replace WebGL without reproducible measurements on defined hardware classes.

GitHub Actions is intentionally disabled. Renderer benchmarks are **manual, hardware-specific measurements**.

## Run the benchmark

1. Run the app locally:

```bash
npm install
npm run dev
```

2. Open:

```text
http://localhost:5173/benchmarks/render-benchmark.html
```

3. Select **Run benchmark**. The page measures the same synthetic OpenEUV-owned workload using WebGL2 and, when available, WebGPU.
4. Copy the JSON in **Raw result** exactly as produced.
5. Add capture metadata using the template in `benchmarks/raw/RESULT_TEMPLATE.json`.
6. Commit the result under a descriptive name such as:

```text
benchmarks/raw/2026-08-08-windows11-rtx4060-chrome151.json
```

## Required capture metadata

A committed raw result must state:

- capture date/time and timezone;
- OS and version;
- browser and version;
- device class (`desktop`, `laptop`, `tablet`, `phone`);
- CPU family/model when known;
- GPU family/model when known;
- power mode (`plugged-in`, `battery`, `unknown`);
- screen/viewport information when relevant;
- whether WebGPU was available;
- the unedited benchmark payload from `window.__OPENEUV_BENCHMARK__`;
- optional notes about thermal/power conditions.

Do not include serial numbers, private machine identifiers, usernames, IP addresses or other unnecessary personal information.

## Methodology

Current workload:

- 2,048 instanced triangles;
- 20 warm-up frames;
- 90 measured frames;
- identical high-level visual workload for WebGL2 and WebGPU;
- startup/setup time plus average, median and p95 frame time;
- JS heap information only when the browser exposes it.

This benchmark does **not** claim to reproduce the full OpenEUV atlas workload or GPU-driver internals. It is a controlled comparison harness.

## Adoption rule

The decision helper in `src/lib/renderCapability.mjs` keeps WebGL as baseline. WebGPU should be considered only after multiple real measurements exist for relevant device classes and the defined workload shows a meaningful, reproducible benefit. A single fast desktop run is not enough.

## Raw-data integrity

`benchmarks/raw/` intentionally contains no invented performance numbers. Do not commit fabricated or estimated results to make the coverage table look complete. Missing hardware classes remain explicit research gaps.
