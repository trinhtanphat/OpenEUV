# OpenEUV — Tiếng Việt

**Bản đồ kỹ thuật tương tác, mã nguồn mở về quang khắc EUV (Extreme Ultraviolet), được tái dựng từ nguồn công khai hợp pháp.**

OpenEUV kết nối 3D scanner dạng conceptual digital twin, exploded view, Assembly Explorer, lộ trình học từ cơ bản đến nghiên cứu, mô phỏng quang/vật lý, patent-family graph, evidence/review system, public fab case studies và các open unknowns để cộng đồng cùng contributor.

> **Ranh giới quan trọng:** OpenEUV là dự án giáo dục/nghiên cứu độc lập, không liên kết với ASML, ZEISS, TSMC, Samsung, Intel, Micron, SK hynix, Rapidus, TRUMPF, Cymer hoặc đối tác của họ. Mô hình trong repo **không phải** CAD thương mại, service manual, production recipe, fab blueprint hay hướng dẫn vận hành laser/plasma nguy hiểm.

## 1. Atlas 3D

- React + Three.js conceptual EUV scanner.
- Exploded view, orbit/zoom, chọn subsystem.
- Concept asset gốc của OpenEUV cho source/collector, reticle và projection optics.
- Procedural fallback khi glTF không tải được.
- Guided camera tour.
- Named-node highlight.
- Screen-space label gắn trực tiếp với evidence claim và geometry status.
- Adaptive LOD `high / balanced / low`: thiết bị mobile/low-power tự giảm pixel ratio, shadow, grid/detail và source animation nhưng không ẩn ranh giới evidence.

Hình học chưa được nguồn công khai xác nhận luôn được đánh dấu là `illustrative` hoặc public-source inference.

## 2. Assembly Explorer — “How it’s made” ở mức systems engineering

Assembly Explorer trình bày chuỗi tích hợp khái niệm:

`architecture → vacuum/mechanical platform → EUV source → illumination → reflective reticle → projection optics → wafer stage/metrology → system integration/qualification`

Mỗi stage có:

- evidence công khai hỗ trợ điều gì;
- dependency giữa module;
- learning output;
- boundary nói rõ điều gì **không biết/không suy diễn**.

Đây không phải hướng dẫn chế tạo nguồn laser/plasma hay installation/service manual.

Xem [`docs/ASSEMBLY_EXPLORER.md`](docs/ASSEMBLY_EXPLORER.md).

## 3. Lộ trình học L0 → L5

- **L0:** chip, wafer, resist, lithography cơ bản.
- **L1:** wavelength, diffraction, NA, imaging.
- **L2:** EUV physics, vacuum, complex refractive index, multilayer.
- **L3:** scanner systems: source/illumination/reticle/projection/stage/metrology.
- **L4:** High-NA, anamorphic 4×/8×, mask 3D, aberration/focus/overlay.
- **L5:** patent, evidence, public dataset, computational/reproducible research.

Mỗi level liên kết trực tiếp với lab và loại contribution phù hợp.

Xem [`docs/LEARNING_PATH.md`](docs/LEARNING_PATH.md).

## 4. Physics & imaging workbench

- Low-NA **0,33** vs High-NA **0,55**.
- High-NA anamorphic **4× / 8×**.
- Rayleigh-style resolution playground, có Python cross-check độc lập.
- Multilayer characteristic-matrix với complex index và phân cực `s / p / unpolarized`.
- Built-in **Mo/Windt 1988 optical constants dataset** từ database CC0, pin đúng upstream revision và giữ nguyên điểm 13,55 nm.
- Adapter nạp optical dataset có source/license/provenance.
- Mask 3D shadowing.
- Aberration/focus/leveling/overlay.
- Wafer stage 6 bậc tự do: X/Y/Z + Rx/Ry/Rz.

Layer/material nào chưa có dataset public đủ provenance vẫn để `illustrative`, không extrapolate ngầm rồi gọi là dữ liệu thật.

## 5. Evidence & review system

OpenEUV dùng các lớp chứng cứ:

| Class | Ý nghĩa |
| --- | --- |
| A | Nguồn công khai chính thức của hãng/foundry |
| B | Patent/standard công khai |
| C | Nguồn học thuật |
| D | Suy luận từ nguồn công khai, bắt buộc có rationale |
| ? | Chưa đủ chứng cứ công khai |

Review metadata hỗ trợ:

`proposed → reviewed → superseded`

Claim chưa có người review thật sẽ hiện **unreviewed**. Repo không tự gắn tên reviewer giả để làm coverage đẹp hơn.

Claim ID, source URL, patent/publication ID và confidence dùng chung giữa EN/VI.

## 6. Patent Explorer

Patent Explorer hiện có:

- family ID/member;
- priority/publication date;
- subsystem links;
- public assignee/application metadata khi có;
- original OpenEUV summary;
- metadata completeness/provenance score;
- duplicate/conflicting-family audit tooling;
- coverage cho source, collector, illumination, reticle, projection, stage, metrology và vacuum.

Patent là bằng chứng về **concept được công bố**, không chứng minh drawing chính là production geometry.

## 7. Fab & mask-lifecycle case studies

Case study first-party hiện gồm:

- TSMC;
- Samsung;
- Intel;
- Micron;
- SK hynix;
- Rapidus.

Ngoài ra có source/collector contamination và reflective-mask/membrane lifecycle context từ patent/học thuật công khai.

Mỗi case theo format:

`public fact → why it matters → public boundary → explicit unknowns`

Repo không suy diễn private layer count, recipe, yield, fab layout, scanner setting, inspection threshold hay cleaning chemistry.

## 8. Chạy local

```bash
npm install
npm run dev
```

Kiểm tra code/data/build:

```bash
npm run check
```

Browser QA:

```bash
npx playwright install chromium
npm run e2e
```

Regenerate concept assets:

```bash
python tools/generate-concept-assets.py all
```

## 9. Deploy

**GitHub Actions đã được tắt có chủ đích.** Push GitHub sẽ không tự chạy CI và không tự deploy.

Deploy manual bằng Cloudflare Workers Static Assets:

```bash
npm install
npm run check
npm run deploy:cloudflare:dry
npm run deploy:cloudflare
```

`wrangler.jsonc` serve thư mục `dist/` và có SPA fallback.

Vercel cũng tương thích: build command `npm run build`, output directory `dist`.

Xem [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## 10. Public research/data tooling

Repo có tooling cho:

- patent JSON/CSV normalization;
- patent metadata completeness/conflict audit;
- DOI/literature metadata normalization;
- fab-case validation;
- optical-constants import/provenance;
- public dataset manifest/versioning;
- JS ↔ Python reproducibility checks;
- renderer benchmark harness + raw-result template.

## 11. Renderer benchmark

WebGL vẫn là production baseline.

OpenEUV có WebGL/WebGPU benchmark harness, nhưng **không bịa số benchmark laptop/mobile**. Raw result thực phải được chạy thủ công trên hardware thật rồi lưu theo [`benchmarks/README.md`](benchmarks/README.md).

Đây là research gap còn mở có chủ đích.

## 12. Cách contribute

Bạn có thể tham gia theo các track:

- `3d`: glTF/GLB, labels, camera tour, LOD;
- `physics`: multilayer, diffraction, optical datasets, mask imaging;
- `optics`: NA, aberration, metrology concepts;
- `patent-research`: family metadata, provenance review;
- `fab`: first-party public case studies;
- `evidence`: claim validation, review state, supersession, unknowns;
- `i18n`: EN/VI và language pack sau này;
- `qa`: unit/browser/manual deployment checks;
- `education`: Assembly Explorer và L0→L5 content;
- `perf`: benchmark thật trên hardware thật.

Đọc thêm [`CONTRIBUTING.md`](CONTRIBUTING.md), [`SOURCING_POLICY.md`](SOURCING_POLICY.md), [`ROADMAP.md`](ROADMAP.md) và [`docs/LANGUAGES.md`](docs/LANGUAGES.md).

## Không đưa vào repo

- tài liệu bị đánh cắp/hack;
- leak bí mật thương mại;
- proprietary CAD/service manual không có quyền phát hành;
- private fab recipe;
- credential/token;
- hướng dẫn thực hành nguy hiểm với laser/plasma;
- full paper có bản quyền khi không có quyền redistribution;
- anonymous claim được trình bày như sự thật.

Mục tiêu của OpenEUV là xem cộng đồng có thể tái dựng được bao xa **bằng chứng cứ công khai, có provenance rõ và có ranh giới uncertainty minh bạch**.
