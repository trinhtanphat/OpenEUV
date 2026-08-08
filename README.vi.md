# OpenEUV — Tiếng Việt

**Bản đồ kỹ thuật tương tác mã nguồn mở về quang khắc EUV, được tái dựng từ nguồn công khai hợp pháp.**

OpenEUV kết nối 3D conceptual atlas, Assembly Explorer, lộ trình học L0→L5, lab quang/vật lý, global search, patent/fab context, academic literature, provenance/review tooling, research snapshot và các unknown được ghi rõ.

> **Ranh giới:** đây là dự án giáo dục/nghiên cứu độc lập; không phải CAD thương mại, service manual, production recipe, fab blueprint hay hướng dẫn vận hành thiết bị nguy hiểm. Chi tiết private/không đủ nguồn sẽ giữ là unknown thay vì đoán.

## V9 — bibliography export và EN/VI QA

- **Citation export deterministic** được dẫn xuất trực tiếp từ `evidence/literature.json` dưới dạng BibTeX hoặc CSL-JSON.
- **Không bịa bibliography metadata:** chỉ export DOI/title/year/authors/public URL/publication type đang có; không tự thêm publisher/volume/pages.
- **Citation key ổn định:** token tác giả đầu + năm + DOI hash, có suffix deterministic khi trùng key.
- **Browser export theo filter hiện tại:** Literature Explorer có Copy BibTeX và Download CSL-JSON cho đúng các paper đang hiển thị.
- **CLI local:** `npm run literature:export -- --format bibtex|csl-json`, có thể thêm `--output`.
- **EN/VI structural coverage audit:** `npm run audit:i18n` kiểm canonical UI dictionary, learning path và checkpoint data để bắt pair thiếu/rỗng/placeholder.
- **Preflight V9:** EN/VI coverage audit đã nằm trong local repository gate.

PASS cấu trúc **không đồng nghĩa** mọi bản dịch kỹ thuật đã được native/domain expert review. Xem [`docs/V9_BIBLIO_I18N.md`](docs/V9_BIBLIO_I18N.md).

## Nền V8 vẫn được giữ

- manual Cloudflare deploy có exact Git provenance và dirty-tree guard;
- Source Library dẫn xuất từ claims/fab/patent;
- source citation audit;
- Literature Explorer + DOI-aware Atlas Search;
- research snapshot verify/diff;
- literature/source validation trong preflight.

Xem [`docs/V8_RESEARCH_OPERATIONS.md`](docs/V8_RESEARCH_OPERATIONS.md) và [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Nền V7 vẫn được giữ

- footer/public snapshot có version + commit provenance;
- production-only read-only offline shell, same-origin GET + network-first;
- manifest/icon PWA;
- static accessibility contract audit;
- Vite development mode không đăng ký production service worker.

## Hệ thống atlas và learning

### Atlas 3D

- React + Three.js conceptual EUV scanner với orbit/zoom/exploded view.
- Original concept geometry cho source/collector, reticle, projection, illumination và vacuum/platform.
- Procedural fallback, stable named nodes, evidence-linked labels, guided camera tour.
- Adaptive LOD `high / balanced / low`.

### Assembly & L0→L5

Chuỗi systems learning:

`architecture → vacuum/platform → source → illumination → reticle → projection → stage/metrology → integration`

Lộ trình:

`L0 semiconductor basics → L1 optics/NA/Fourier → L2 EUV/multilayer → L3 scanner systems → L4 High-NA/image quality → L5 evidence/patent/research`.

Mỗi level có checkpoint EN/VI; answer chỉ nằm trong React state hiện tại, không upload/persist.

### Physics & imaging

Có các lab Low-NA/High-NA, anamorphic 4×/8×, Rayleigh-style resolution, Fourier/MTF, mirror/vacuum, polarization-aware multilayer, mask-3D, aberration/focus/overlay và wafer-stage 6-DoF.

Built-in measured dataset hiện có **Mo/Windt 1988 CC0** với provenance pin rõ. Các lab là mô hình học tập, không phải commercial scanner/process predictor.

## Search, literature, nguồn, evidence & provenance

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
npm run audit:integrity
npm run audit:a11y
npm run audit:sources
npm run audit:i18n
npm run validate:literature
npm run provenance:report
npm run evidence:review-report
npm run literature:export -- --format bibtex
npm run literature:export -- --format csl-json --output openeuv-literature.csl.json
npm run research:snapshot -- --generated-at 2026-08-08T12:00:00.000Z > snapshot.json
npm run research:snapshot:verify -- snapshot.json
npm run research:snapshot:diff -- before.json after.json
npm run preflight
```

Source Library, Literature Explorer và bibliography export đều dẫn xuất từ canonical repository data thay vì tạo factual registry trùng lặp.

## Patent, fab & public data

Patent Explorer có family/priority/publication metadata, subsystem links, original summaries và completeness/conflict audit.

`evidence/fab-cases.json` là runtime source-of-truth cho fab/mask-lifecycle cases, luôn giữ public source, public boundary và explicit unknowns.

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

`npm run check` chạy preflight + unit tests + TypeScript typecheck + production build. Preflight kiểm evidence/reviews, fab, literature, source citations, benchmark captures, cross-dataset integrity, provenance, learning/checkpoints, accessibility, EN/VI structural coverage, dataset paths, docs bắt buộc và việc GitHub Actions vẫn tắt.

## Deploy

**GitHub Actions đã tắt có chủ đích.** Push GitHub không tự CI/deploy.

Cloudflare Workers Static Assets:

```bash
npm install
npm run deploy:cloudflare:dry
npm run deploy:cloudflare
```

Helper deploy truyền exact public Git commit vào build và mặc định chặn dirty worktree. `--allow-dirty` / `--skip-check` chỉ là explicit operator override; xem `docs/DEPLOYMENT.md`.

Repo cũng có `vercel.json`.

## Hai dependency bên ngoài còn mở

Phần software khả thi V1→V9 đã land. Chỉ còn:

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

Đọc [`CONTRIBUTING.md`](CONTRIBUTING.md), [`SOURCING_POLICY.md`](SOURCING_POLICY.md), [`ROADMAP.md`](ROADMAP.md), [`docs/V8_RESEARCH_OPERATIONS.md`](docs/V8_RESEARCH_OPERATIONS.md) và [`docs/V9_BIBLIO_I18N.md`](docs/V9_BIBLIO_I18N.md).
