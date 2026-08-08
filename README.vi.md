# OpenEUV — Tiếng Việt

**Bản đồ kỹ thuật tương tác, mã nguồn mở về quang khắc EUV (Extreme Ultraviolet), được tái dựng từ nguồn công khai hợp pháp.**

OpenEUV kết nối 3D scanner dạng conceptual digital twin, exploded view, Assembly Explorer, lộ trình học L0→L5, mô phỏng quang/vật lý, patent-family graph, evidence/review system, public fab & mask-lifecycle case studies và các open unknowns để cộng đồng cùng contributor.

> **Ranh giới quan trọng:** OpenEUV là dự án giáo dục/nghiên cứu độc lập, không liên kết với ASML, ZEISS, TSMC, Samsung, Intel, Micron, SK hynix, Rapidus, imec hoặc đối tác của họ. Mô hình trong repo **không phải** CAD thương mại, service manual, production recipe, fab blueprint hay hướng dẫn vận hành thực tế nguy hiểm.

## 1. Atlas 3D

- React + Three.js conceptual EUV scanner.
- Exploded view, orbit/zoom, chọn subsystem.
- Concept asset gốc của OpenEUV cho source/collector, reticle và projection optics.
- Procedural fallback khi external model không tải được.
- V4 thêm procedural concept geometry cho **illumination** và **vacuum/platform**, có stable named nodes.
- Guided camera tour và named-node highlight.
- Screen-space label gắn trực tiếp với evidence claim và geometry status.
- Adaptive LOD `high / balanced / low`: mobile/low-power tự giảm pixel ratio, shadow, secondary geometry/detail và source animation nhưng không ẩn evidence boundary.

Hình học chưa được nguồn công khai xác nhận luôn được đánh dấu `illustrative` hoặc `public-inference`; function được nguồn xác nhận không đồng nghĩa shape/kích thước render là CAD thật.

Xem [`docs/3D_V4_ILLUMINATION_VACUUM.md`](docs/3D_V4_ILLUMINATION_VACUUM.md).

## 2. Assembly Explorer — systems engineering

Assembly Explorer trình bày chuỗi:

`architecture → vacuum/platform → source → illumination → reticle → projection → stage/metrology → system integration`

V4 thêm cho từng stage:

- shared claim IDs;
- named atlas nodes khi có;
- link tới lab/learning liên quan;
- câu hỏi nghiên cứu mở EN/VI;
- explicit evidence/node gaps thay vì bịa mapping để lấp chỗ trống.

Evidence chip có deep-link tới đúng record trong Evidence Dashboard.

Xem [`docs/ASSEMBLY_EXPLORER.md`](docs/ASSEMBLY_EXPLORER.md).

## 3. Lộ trình học L0 → L5

- **L0:** chip, wafer, resist, lithography cơ bản.
- **L1:** wavelength, diffraction, NA, spatial frequency, Fourier/MTF imaging.
- **L2:** EUV physics, vacuum, complex refractive index, multilayer.
- **L3:** scanner systems: source/illumination/reticle/projection/stage/metrology.
- **L4:** High-NA, anamorphic 4×/8×, spatial-frequency filtering, mask 3D, aberration/focus/overlay.
- **L5:** patent, evidence, public dataset, reproducibility/computational research.

Xem [`docs/LEARNING_PATH.md`](docs/LEARNING_PATH.md).

## 4. Physics & imaging workbench

- Low-NA **0,33** vs High-NA **0,55**.
- High-NA anamorphic **4× / 8×**.
- Rayleigh-style resolution playground.
- V4 **Fourier imaging / circular-pupil MTF** learning lab với frequency/cutoff chuẩn hóa.
- Multilayer characteristic-matrix với complex index và phân cực `s / p / unpolarized`.
- Built-in **Mo/Windt 1988 optical constants dataset** từ database CC0, pin đúng upstream revision và giữ nguyên điểm 13,55 nm.
- Adapter nạp optical dataset có source/license/provenance.
- Mask 3D shadowing.
- Aberration/focus/leveling/overlay.
- Wafer stage 6 bậc tự do: X/Y/Z + Rx/Ry/Rz.

Các lab là mô hình học tập, không phải production scanner/process predictor. Xem [`docs/FOURIER_IMAGING_LAB.md`](docs/FOURIER_IMAGING_LAB.md).

## 5. Evidence & review system

OpenEUV dùng:

| Class | Ý nghĩa |
| --- | --- |
| A | Nguồn công khai chính thức của hãng/foundry |
| B | Patent/standard công khai |
| C | Nguồn học thuật/public research |
| D | Suy luận từ nguồn công khai, bắt buộc có rationale |
| ? | Chưa đủ chứng cứ công khai |

Review lifecycle:

`proposed → reviewed → superseded`

Claim chưa có người review thật sẽ hiện **unreviewed**. Repo không tự gắn reviewer giả để tăng coverage.

V4 có deterministic review queue:

```bash
node tools/evidence-review-queue.mjs --limit 12
node tools/evidence-review-queue.mjs --limit 12 --json
```

Queue chỉ chọn việc cần review; nó không tự thay review state hay sinh identity.

Xem [`docs/EVIDENCE_REVIEW_CAMPAIGN.md`](docs/EVIDENCE_REVIEW_CAMPAIGN.md).

## 6. Patent Explorer

Patent Explorer có:

- family ID/member;
- priority/publication date;
- subsystem links;
- public assignee/application metadata khi có;
- original OpenEUV summary;
- metadata completeness/provenance score;
- duplicate/conflicting-family audit tooling;
- coverage cho source, collector, illumination, reticle, projection, stage, metrology và vacuum.

Patent là bằng chứng về **concept được công bố**, không chứng minh drawing chính là production geometry.

## 7. Fab & mask-lifecycle

Runtime source-of-truth là [`evidence/fab-cases.json`](evidence/fab-cases.json).

Case hiện gồm:

- TSMC, Samsung, Intel, Micron, SK hynix, Rapidus EUV milestones;
- TSMC public EUV-mask dry-clean context;
- imec CNT-pellicle protection research;
- ZEISS AIMS EUV mask-qualification context;
- source/collector contamination;
- reflective-mask/membrane lifecycle research.

Mỗi case lưu shared claim IDs, direct public source URLs, **public boundary** và explicit unknowns.

Repo không suy diễn private layer count, recipe, yield, fab layout, private scanner setting, inspection threshold hay private process condition.

## 8. Public data & provenance

Mo/Windt là optical dataset đo đạc đầu tiên được vendor vì nguồn refractiveindex.info có CC0 rõ ràng.

Silicon EUV data quanh 13,5 nm hiện vẫn là **research gap**: OpenEUV xác định được nguồn công khai phù hợp về range nhưng chưa xác lập được redistribution chain sạch tương đương CC0 để copy numerical table vào repo.

Vì vậy Si-like default vẫn `illustrative`, không copy bảng thiếu license và không extrapolate dữ liệu vùng khác rồi gọi là measured EUV data.

Xem [`docs/SILICON_OPTICAL_DATA_RESEARCH.md`](docs/SILICON_OPTICAL_DATA_RESEARCH.md).

## 9. Chạy local

```bash
npm install
npm run dev
```

Local gate:

```bash
npm run check
```

Gate hiện gồm evidence/review validation, runtime fab-case validation, renderer-capture validation, unit tests, TypeScript typecheck và production Vite build.

Browser QA:

```bash
npx playwright install chromium
npm run e2e
```

Regenerate concept assets:

```bash
python tools/generate-concept-assets.py all
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

Xem [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## 11. Contributor workflow

GitHub có structured Issue Forms cho:

- public evidence/research;
- 3D/visual contribution;
- bug report;
- real-device renderer benchmark.

Blank issue đã tắt để sourcing/privacy/evidence guard hiện ngay trước khi submit.

Các track chính: `3d`, `optics`, `physics`, `patent-research`, `fab`, `evidence`, `education`, `i18n`, `qa`, `perf`.

Đọc [`CONTRIBUTING.md`](CONTRIBUTING.md) và [`SOURCING_POLICY.md`](SOURCING_POLICY.md) trước.

## 12. Ba dependency bên ngoài còn mở

Phần software khả thi của V1→V4 đã được đẩy khá xa. Ba issue còn mở có chủ đích:

- **#27 PERF:** cần raw WebGL/WebGPU từ hardware laptop/mobile/desktop thật. Benchmark method v2, schema, validator/analyzer đã có; emulator/headless/số bịa không tính.
- **#28 DATA:** cần silicon EUV optical dataset có quyền redistribution đủ rõ để vendor/pin; public table thiếu license không tính.
- **#29 EVIDENCE:** cần ít nhất 10 record được reviewer người thật kiểm tra và gắn public handle thật; generated/fake attribution không tính.

Đây là external research dependencies, không phải placeholder nên đóng bằng dữ liệu giả.

## Verification policy

Vì GitHub Actions tắt, một commit push thành công **không đồng nghĩa build/test PASS**.

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
