# OpenEUV — Tiếng Việt

**Bản đồ kỹ thuật tương tác mã nguồn mở về quang khắc EUV, được tái dựng từ nguồn công khai hợp pháp.**

OpenEUV kết nối 3D conceptual atlas, Assembly Explorer, lộ trình học L0→L5, lab quang/vật lý, global search, patent/fab context, academic literature, provenance/review tooling, research snapshot và các unknown được ghi rõ.

> **Ranh giới:** đây là dự án giáo dục/nghiên cứu độc lập; không phải CAD thương mại, service manual, production recipe, fab blueprint hay hướng dẫn vận hành thiết bị nguy hiểm. Chi tiết private/không đủ nguồn sẽ giữ là unknown thay vì đoán.

## V8 — research operations, nguồn và literature

- **Manual deploy có provenance:** helper Cloudflare lấy đúng Git HEAD, truyền qua `OPENEUV_COMMIT_SHA`, mặc định chặn dirty worktree và không bật lại GitHub Actions.
- **Source Library dẫn xuất:** danh sách nguồn được tạo từ claims, fab cases và patent metadata hiện có; không tạo một source-of-truth thủ công thứ hai.
- **Citation audit:** `npm run audit:sources` bắt URL hỏng/non-HTTP(S) và evidence source thiếu label; alias tên nguồn hợp lệ chỉ là warning.
- **Literature Explorer:** `evidence/literature.json` lưu DOI/title/year/authors/type/topics, original OpenEUV summaries và link rõ tới claim/lab; không copy full paper.
- **Atlas Search tìm được literature** bằng DOI/title/author/topic/claim/lab và deep-link tới đúng paper card.
- **Snapshot verify/diff:** xác minh snapshot schema v2 và so sánh claims/unknowns/fab/dataset theo stable ID; timestamp/build/coverage được tách khỏi research-content change.
- **Preflight V8** chạy cả literature validator và source citation audit; GitHub Actions vẫn cố ý không tồn tại.

Xem [`docs/V8_RESEARCH_OPERATIONS.md`](docs/V8_RESEARCH_OPERATIONS.md), [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) và [`ROADMAP.md`](ROADMAP.md).

## Nền V7 vẫn được giữ

- footer/public snapshot có version + commit provenance;
- production-only read-only offline shell, same-origin GET + network-first;
- manifest/icon PWA;
- static accessibility contract audit;
- Vite development mode không đăng ký production service worker.

Xem [`docs/V7_RELEASE_OFFLINE_A11Y.md`](docs/V7_RELEASE_OFFLINE_A11Y.md).

## Hệ thống hiện có

### Atlas 3D

- React + Three.js conceptual EUV scanner với orbit/zoom/exploded view.
- Original concept geometry cho source/collector, reticle, projection, illumination và vacuum/platform.
- Procedural fallback, stable named nodes, evidence-linked labels, guided camera tour.
- Adaptive LOD `high / balanced / low` cho thiết bị hạn chế.

### Assembly & learning

Chuỗi systems learning:

`architecture → vacuum/platform → source → illumination → reticle → projection → stage/metrology → integration`

Lộ trình:

`L0 semiconductor basics → L1 optics/NA/Fourier → L2 EUV/multilayer → L3 scanner systems → L4 High-NA/image quality → L5 evidence/patent/research`.

Mỗi level có checkpoint EN/VI; answer chỉ nằm trong React state hiện tại, không upload/persist.

### Physics & imaging

Có các lab Low-NA/High-NA, anamorphic 4×/8×, Rayleigh-style resolution, Fourier/MTF, mirror/vacuum, polarization-aware multilayer, mask-3D, aberration/focus/overlay và wafer-stage 6-DoF.

Built-in measured dataset hiện có **Mo/Windt 1988 CC0** với provenance pin rõ. Các lab là mô hình học tập, không phải commercial scanner/process predictor.

### Search, literature, evidence & provenance

Global Atlas Search chạy local-only, hỗ trợ claim/patent/DOI ID, subsystem, organization, author, EN/VI technical terms, deep link và keyboard navigation.

Evidence class:

| Class | Ý nghĩa |
| --- | --- |
| A | Nguồn công khai first-party |
| B | Patent/public standard |
| C | Academic/public research |
| D | Public-source inference có rationale |
| ? | Chưa đủ nguồn |

Review lifecycle: `proposed → reviewed → superseded`; chưa có review thật thì giữ **unreviewed**.

Command hữu ích:

```bash
npm run provenance:report
npm run audit:integrity
npm run audit:a11y
npm run audit:sources
npm run validate:literature
npm run preflight
npm run evidence:review-report
npm run research:snapshot -- --generated-at 2026-08-08T12:00:00.000Z > openeuv-research-snapshot.json
npm run research:snapshot:verify -- openeuv-research-snapshot.json
npm run research:snapshot:diff -- before.json after.json
```

### Patent, fab & public data

Patent Explorer có family/priority/publication metadata, subsystem links, original summaries và completeness/conflict audit.

`evidence/fab-cases.json` là runtime source-of-truth cho fab/mask-lifecycle cases, luôn có public boundary và explicit unknowns.

Silicon quanh 13,5 nm hiện là **verified data gap**: repo không extrapolate candidate CC0 ngoài range và không copy numerical table khi chưa xác minh quyền redistribution.

## Chạy local

```bash
npm install
npm run dev
npm run check
```

Browser QA:

```bash
npx playwright install chromium
npm run e2e
```

`npm run check` chạy preflight + unit tests + TypeScript typecheck + production build. Preflight kiểm evidence/reviews, fab data, literature links, source citations, benchmark captures, cross-dataset integrity, provenance, accessibility contract, dataset paths, checkpoint data, docs bắt buộc và việc GitHub Actions vẫn tắt.

## Deploy

**GitHub Actions đã tắt có chủ đích.** Push GitHub không tự CI/deploy.

Cloudflare Workers Static Assets:

```bash
npm install
npm run deploy:cloudflare:dry
npm run deploy:cloudflare
```

Helper deploy mặc định chạy repository gate trước production deploy và chặn dirty worktree. `--allow-dirty` / `--skip-check` chỉ là explicit operator override; xem `docs/DEPLOYMENT.md`.

Repo cũng có `vercel.json`. Production build đăng ký read-only offline shell; development build không đăng ký.

Optional public commit vars:

```text
OPENEUV_COMMIT_SHA
CF_PAGES_COMMIT_SHA
VERCEL_GIT_COMMIT_SHA
```

Build provenance không expose các server environment variables khác.

## Hai dependency bên ngoài còn mở

Phần software khả thi V1→V8 đã land. Chỉ còn:

- **#27 PERF:** cần ≥3 paired WebGL/WebGPU captures trên ≥2 hardware class thật; synthetic/headless/emulator không tính.
- **#29 EVIDENCE:** cần ≥10 record được người thật review với public handle thật; identity/review giả không tính.

## Verification policy

Vì GitHub Actions tắt, push thành công **không đồng nghĩa build/test PASS**. Trước deploy hoặc claim verified:

```bash
npm run check
npm run e2e
```

## Không đưa vào repo

Không nhận leaked/confidential/trade-secret material, unauthorized proprietary CAD/service manuals, private process recipes, credentials, full copyrighted papers thiếu quyền redistribution, hoặc anonymous/unverifiable claims được trình bày như fact.

Đọc [`CONTRIBUTING.md`](CONTRIBUTING.md), [`SOURCING_POLICY.md`](SOURCING_POLICY.md), [`ROADMAP.md`](ROADMAP.md) và [`docs/V8_RESEARCH_OPERATIONS.md`](docs/V8_RESEARCH_OPERATIONS.md).
