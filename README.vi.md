# OpenEUV — Tiếng Việt

**Bản đồ kỹ thuật tương tác, mã nguồn mở về quang khắc EUV (Extreme Ultraviolet), được tái dựng từ nguồn công khai hợp pháp.**

OpenEUV kết nối 3D scanner dạng conceptual digital twin, exploded view, Assembly Explorer, lộ trình học L0→L5, mô phỏng quang/vật lý, global search, patent-family graph, evidence/provenance/review system, public fab & mask-lifecycle case studies, local research snapshot và các open unknowns.

> **Ranh giới quan trọng:** OpenEUV là dự án giáo dục/nghiên cứu độc lập, không liên kết với ASML, ZEISS, TSMC, Samsung, Intel, Micron, SK hynix, Rapidus, imec hoặc đối tác của họ. Mô hình trong repo **không phải** CAD thương mại, service manual, production recipe, fab blueprint hay hướng dẫn vận hành thực tế nguy hiểm.

## V6 có gì mới

- **Provenance overview ngay trong browser** dùng đúng `summarizeProvenance()` giống CLI, không tạo scoring model thứ hai.
- **Research snapshot JSON privacy-safe**: claims, unknowns, fab cases, dataset manifest, review coverage và provenance coverage.
- **Copy/download trong browser** hoàn toàn local, không upload.
- **CLI snapshot reproducible** với timestamp caller truyền vào rõ ràng.
- **Skip to main content**, tách semantic `header` / `main`, focus-visible navigation.
- **Reduced-motion-aware navigation**: khi OS/browser yêu cầu giảm chuyển động, search không dùng smooth scrolling và CSS tắt animation không cần thiết.
- Browser coverage cho skip link, keyboard-only checkpoint/search và snapshot download.
- Privacy filter normalize key nên các biến thể như `User-Agent`, `IP_Address`, `Device-Memory` cũng bị loại/reject.

Các chức năng V5 vẫn giữ nguyên: global local-only search, provenance trace, unified preflight/integrity audit, mirror/vacuum lab, checkpoint L0→L5 và robust patent parser.

Xem [`docs/V6_ACCESSIBILITY_EXPORT.md`](docs/V6_ACCESSIBILITY_EXPORT.md), [`docs/PROVENANCE_COVERAGE_REPORT.md`](docs/PROVENANCE_COVERAGE_REPORT.md), [`docs/LEARNING_CHECKPOINTS.md`](docs/LEARNING_CHECKPOINTS.md).

## 1. Atlas 3D

- React + Three.js conceptual EUV scanner.
- Exploded view, orbit/zoom, chọn subsystem.
- Concept asset gốc cho source/collector, reticle và projection optics.
- Procedural fallback khi external model không tải được.
- Procedural concept geometry cho **illumination** và **vacuum/platform**, có stable named nodes.
- Guided camera tour, named-node highlight và evidence-linked labels.
- Adaptive LOD `high / balanced / low` cho mobile/low-power nhưng không ẩn evidence boundary.

Hình học chưa được nguồn công khai xác nhận luôn được đánh dấu `illustrative` hoặc `public-inference`; function có nguồn không đồng nghĩa shape/kích thước render là CAD thật.

## 2. Assembly Explorer & L0→L5

Assembly Explorer:

`architecture → vacuum/platform → source → illumination → reticle → projection → stage/metrology → system integration`

Mỗi stage có thể có shared claim IDs, named atlas nodes, link tới lab, câu hỏi nghiên cứu EN/VI và explicit evidence/node gaps.

Lộ trình học:

- **L0:** chip, wafer, resist, lithography cơ bản.
- **L1:** wavelength, diffraction, NA, spatial frequency, Fourier/MTF.
- **L2:** EUV physics, vacuum, complex refractive index, multilayer.
- **L3:** scanner systems.
- **L4:** High-NA, anamorphic 4×/8×, mask 3D, aberration/focus/overlay.
- **L5:** patent, evidence, public dataset, reproducibility/computational research.

Checkpoint EN/VI cho đủ L0→L5 chỉ lưu trong React state hiện tại; reload là mất, không account/analytics/persistence.

## 3. Physics & imaging workbench

- Low-NA **0,33** vs High-NA **0,55**.
- High-NA anamorphic **4× / 8×**.
- Rayleigh-style resolution playground.
- Fourier imaging / circular-pupil MTF chuẩn hóa.
- Mirror/vacuum concept lab chuẩn hóa.
- Multilayer characteristic-matrix với complex index và phân cực `s / p / unpolarized`.
- Built-in **Mo/Windt 1988 optical constants dataset** từ database CC0, pin upstream revision và giữ điểm gốc 13,55 nm.
- Mask 3D shadowing.
- Aberration/focus/leveling/overlay.
- Wafer stage 6 bậc tự do: X/Y/Z + Rx/Ry/Rz.

Các lab là mô hình học tập, không phải production scanner/process predictor.

## 4. Search, accessibility & navigation

Search chạy hoàn toàn trong browser, không gọi external search service, không gửi telemetry và không lưu query.

Có exact claim/patent ID, subsystem/organization/technical term, EN/VI labels, normalization dấu tiếng Việt, deep links và keyboard Arrow Up/Down/Enter/Escape.

V6 thêm skip-link đầu tiên khi Tab, semantic main landmark và reduced-motion navigation.

## 5. Evidence, provenance, review & snapshot

| Class | Ý nghĩa |
| --- | --- |
| A | Nguồn công khai chính thức/first-party |
| B | Patent/standard công khai |
| C | Nguồn học thuật/public research |
| D | Suy luận từ nguồn công khai, bắt buộc có rationale |
| ? | Chưa đủ chứng cứ công khai |

Review lifecycle: `proposed → reviewed → superseded`. Claim chưa có người review thật vẫn là **unreviewed**.

Command hữu ích:

```bash
node tools/evidence-review-queue.mjs --limit 12
npm run evidence:review-report
npm run provenance:report
npm run provenance:report:json
npm run audit:integrity
npm run preflight
npm run research:snapshot -- --generated-at 2026-08-08T12:00:00.000Z > openeuv-research-snapshot.json
```

Panel `#provenance-overview` hiển thị evidence/review/patent/fab/data-gap bookkeeping và có thể copy/download snapshot JSON. Snapshot không chứa browser history, storage, IP, username, user-agent hay hardware identifiers.

## 6. Patent Explorer

Patent Explorer có family ID/member, priority/publication date, subsystem links, public assignee/application metadata khi có, original OpenEUV summary, metadata completeness/provenance score và conflict audit.

Patent là bằng chứng về **concept được công bố**, không chứng minh drawing chính là production geometry.

## 7. Fab & mask-lifecycle

Runtime source-of-truth: `evidence/fab-cases.json`.

Case gồm TSMC, Samsung, Intel, Micron, SK hynix, Rapidus EUV milestones; TSMC EUV-mask dry-clean; imec CNT-pellicle; ZEISS AIMS EUV mask qualification; source/collector contamination và reflective-mask/membrane lifecycle research.

Mỗi case lưu shared claim IDs, direct public source URLs, **public boundary** và explicit unknowns. Repo không suy diễn private layer count, recipe, yield, fab layout, scanner setting hay acceptance threshold nội bộ.

## 8. Public data & verified gap

Mo/Windt là measured optical dataset đầu tiên được vendor vì refractiveindex.info có CC0 rõ ràng.

Silicon quanh 13,5 nm đã được xử lý thành **verified data gap**. Candidate Si CC0 bắt đầu ở 30,9963 nm nên không thể extrapolate xuống 13,5 nm rồi gọi là measured data. Nguồn Si EUV-range công khai tồn tại, nhưng OpenEUV chưa xác minh quyền redistribute numerical table phù hợp để vendor vào repo.

Vì vậy Si-like default vẫn `illustrative`.

## 9. Chạy local & preflight

```bash
npm install
npm run dev
npm run check
```

`npm run check` chạy unified preflight, unit tests, TypeScript typecheck và production build. Preflight kiểm evidence/reviews, fab cases, benchmark capture, cross-dataset integrity, provenance coverage, dataset-manifest paths, learning checkpoints, docs V6 và việc GitHub Actions vẫn tắt.

Browser QA:

```bash
npx playwright install chromium
npm run e2e
```

## 10. Deploy

**GitHub Actions đã tắt có chủ đích.** Push GitHub không tự chạy CI và không tự deploy.

Cloudflare Workers Static Assets:

```bash
npm install
npm run check
npm run deploy:cloudflare:dry
npm run deploy:cloudflare
```

Repo cũng có `vercel.json` cho Vite SPA. Không tuyên bố live URL cho tới khi đúng commit thật sự build/deploy trên hosting target.

## 11. Hai dependency bên ngoài còn mở

Phần software khả thi của V1→V6 trên roadmap hiện tại đã land. Chỉ còn:

- **#27 PERF:** cần ít nhất 3 paired WebGL/WebGPU captures trên ít nhất 2 hardware class thật. Emulator/headless/số bịa không tính.
- **#29 EVIDENCE:** cần ít nhất 10 record được reviewer người thật kiểm tra và dùng public handle thật. Generated/fake attribution không tính.

#28 silicon optical data đã hoàn thành theo nhánh **verified gap**.

## Verification policy

Vì GitHub Actions tắt, commit push thành công **không đồng nghĩa build/test PASS**.

Trước deploy hoặc claim verified:

```bash
npm run check
npm run e2e
```

## Không đưa vào repo

- tài liệu bị đánh cắp/hack;
- leak bí mật thương mại;
- proprietary CAD/service manual không có quyền phát hành;
- private fab recipe;
- credential/token;
- full copyrighted paper khi không có quyền redistribution;
- anonymous/unverifiable claim được trình bày như sự thật;
- hướng dẫn thực hành nguy hiểm với nguồn laser/plasma.

Mục tiêu OpenEUV là xem cộng đồng có thể tái dựng và giảng giải được bao xa **bằng chứng cứ công khai, provenance rõ và uncertainty minh bạch**.
