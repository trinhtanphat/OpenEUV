# Renderer benchmark results

OpenEUV keeps WebGL as the production baseline. WebGPU is an experimental candidate and must not replace WebGL without reproducible measurements on defined hardware classes.

GitHub Actions is intentionally disabled. Renderer benchmarks are **manual, hardware-specific measurements**.

## Current benchmark method

Current captures use **benchmark method v2**:

```text
benchmarkVersion = 2
syncMode = explicit-gpu-completion
```

Every measured frame explicitly waits for submitted GPU work to complete:

- WebGL2: `gl.finish()`;
- WebGPU: `device.queue.onSubmittedWorkDone()`.

This synchronization intentionally favors comparability over maximum asynchronous throughput. Do not mix captures from an older/requestAnimationFrame-only method with v2 results. The validator rejects incompatible method versions.

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

3. Fill the privacy-safe capture metadata: device class, OS/browser version, optional public CPU/GPU model and power mode.
4. Select **Run benchmark**. The page measures the same synthetic OpenEUV-owned workload using WebGL2 and, when available, WebGPU.
5. Review **Schema-ready capture**.
6. Use **Download capture JSON** or **Copy capture JSON**.
7. Commit the result under a descriptive name such as:

```text
benchmarks/raw/2026-08-08-windows11-rtx4060-chrome151-v2.json
```

The machine-readable schema is `benchmarks/schema.json`. `benchmarks/raw/RESULT_TEMPLATE.json` remains available for manual/offline capture preparation.

## Required capture metadata

A committed raw result must state:

- capture date/time and timezone;
- OS and version;
- browser and version;
- device class (`desktop`, `laptop`, `tablet`, `phone`);
- CPU family/model when known;
- GPU family/model when known;
- power mode (`plugged-in`, `battery`, `unknown`);
- viewport information;
- whether WebGPU was available;
- the unedited benchmark v2 payload;
- optional notes about thermal/power conditions.

Do not include serial numbers, private machine identifiers, usernames, IP addresses, account IDs or other unnecessary personal information. The repository validator rejects common identifying-field names such as `serialNumber`, `username`, `ipAddress`, `machineId` and `deviceId`.

## Validate raw captures

```bash
npm run validate:benchmarks
```

This scans `benchmarks/raw/*.json`, excluding `RESULT_TEMPLATE.json`, and fails on malformed JSON, incompatible method version, invalid capture metadata, missing WebGL baseline data or disallowed identifying metadata fields.

`npm run check` includes this validation.

## Aggregate results

Human-readable Markdown summary:

```bash
npm run benchmark:analyze
```

Machine-readable summary:

```bash
npm run benchmark:analyze:json
```

With no real captures checked in, the analyzer reports zero captures and keeps WebGL as the baseline. It does not invent placeholder hardware measurements.

## Methodology

Current workload:

- 2,048 instanced triangles;
- 20 warm-up frames;
- 90 measured frames;
- equivalent high-level visual workload for WebGL2 and WebGPU;
- explicit GPU completion for each warm-up and measured frame;
- setup time plus average, median and p95 synchronized frame time;
- JS heap information only when the browser exposes it.

This benchmark does **not** claim to reproduce the full OpenEUV atlas workload, GPU-driver internals, battery efficiency, thermals or production scanner computation. It is a controlled renderer-comparison harness.

## Conservative adoption gate

The aggregation helper keeps WebGL as production baseline unless all of these are true:

- at least **3** valid paired WebGL/WebGPU captures;
- paired captures cover at least **2 device classes**;
- average median-frame improvement is at least **15%**;
- average p95-frame improvement is at least **15%**;
- no paired capture has a median-frame regression worse than **10%**.

Even when the report says `consider-webgpu`, it does **not** switch renderer code automatically. Maintainers must review raw results and deliberately approve a controlled next step.

## Test fixtures are not hardware evidence

Unit tests contain synthetic fixtures solely to verify validator/aggregation logic. They do not live in `benchmarks/raw/`, are clearly named as fixtures and must never be cited as device benchmark results.

Playwright smoke tests verify that the benchmark page can produce a schema-ready v2 capture. A headless/browser-emulated smoke run is also **not** a real-device benchmark result.

## Raw-data integrity

`benchmarks/raw/` intentionally contains no invented performance numbers. Do not commit fabricated, estimated or emulator-only results to make coverage look complete. Missing hardware classes remain explicit research gaps.
