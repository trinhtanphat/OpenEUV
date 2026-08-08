# OpenEUV — Tiếng Việt

**Bản đồ kỹ thuật tương tác, mã nguồn mở về quang khắc EUV (Extreme Ultraviolet), được tái dựng từ nguồn công khai hợp pháp.**

OpenEUV giúp người học và contributor khám phá một hệ thống quang khắc EUV dưới dạng 3D, mô phỏng vật lý, patent/evidence graph, case study tích hợp fab và từ điển thuật ngữ EN↔VI.

> **Ranh giới quan trọng:** OpenEUV là dự án giáo dục/nghiên cứu độc lập, không liên kết với ASML, ZEISS, TSMC, Samsung, Intel, TRUMPF, Cymer hoặc đối tác của họ. Mô hình trong repo không phải CAD thương mại, service manual, recipe fab hay production blueprint.

## Bạn có thể khám phá gì?

### 1. Atlas 3D

- Máy EUV dạng conceptual digital twin bằng React + Three.js.
- Exploded view, orbit/zoom, chọn từng subsystem.
- Concept asset do OpenEUV tự tạo cho source/collector, reticle và projection optics.
- Procedural fallback nếu glTF không tải được.
- Guided camera tour: source → reticle → projection → wafer.
- Chọn named node như `CollectorConcept`, `ReflectiveMask`, `MirrorConcept-*` để xem Contextual Evidence.
- Hình học không được nguồn công khai xác nhận luôn được đánh dấu là `illustrative` hoặc `inferred`.

### 2. Research Workbench

- Low-NA 0,33 vs High-NA 0,55.
- High-NA anamorphic 4× / 8×.
- Rayleigh-style resolution playground.
- Multilayer characteristic-matrix với phân cực s/p/unpolarized.
- Adapter nạp optical-constants dataset có provenance/source/license.
- Mask 3D shadowing.
- Aberration, focus, leveling và overlay.
- Wafer stage 6 bậc tự do: X/Y/Z + Rx/Ry/Rz.

Các mô phỏng này phục vụ giáo dục. Chúng không phải recipe coating, control law, mirror prescription hay thông số vận hành máy thương mại.

### 3. Evidence system

OpenEUV dùng các lớp chứng cứ:

| Class | Ý nghĩa |
| --- | --- |
| A | Nguồn công khai chính thức của hãng/foundry |
| B | Patent/standard công khai |
| C | Nguồn học thuật |
| D | Suy luận từ nguồn công khai, bắt buộc có rationale |
| ? | Chưa đủ chứng cứ công khai |

Claim ID, source URL, patent/publication ID và evidence class luôn dùng chung cho mọi ngôn ngữ; OpenEUV không tạo một bản evidence riêng cho tiếng Việt.

### 4. Patent & research metadata

- Patent-family explorer theo subsystem.
- JSON/CSV patent metadata normalizer.
- Coverage dashboard.
- DOI/literature metadata normalizer cho metadata do researcher cung cấp.
- Không copy patent figure hoặc toàn văn paper có bản quyền vào repo; ưu tiên metadata + link + tóm tắt nguyên bản.

### 5. Fab integration

Case study hiện có dựa trên nguồn công khai cho:

- TSMC;
- Samsung;
- Intel;
- source/collector contamination;
- reticle membrane / mask lifecycle.

Mỗi case đều tách rõ **public fact → why it matters → public boundary → unknowns**. Repo không suy diễn recipe, layer count, yield, fab layout hoặc threshold nội bộ.

## Chạy local

```bash
npm install
npm run dev
```

Kiểm tra core:

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

Normalize patent metadata:

```bash
node tools/patent-metadata-normalize.mjs input.json output.json
```

Normalize literature metadata:

```bash
node tools/literature-metadata-normalize.mjs input.json output.json
```

## Cách contribute

Bạn có thể tham gia theo các track:

- `3d`: glTF/GLB, labels, camera tour, LOD;
- `physics`: multilayer, diffraction, mask imaging;
- `optics`: NA, aberration, metrology concepts;
- `patent-research`: family metadata, original summaries;
- `fab`: first-party public case studies;
- `evidence`: claim validation, provenance, unknowns;
- `i18n`: EN/VI và các language pack sau này;
- `qa`: unit test, browser smoke, fallback, accessibility;
- `education`: nội dung từ cơ bản đến nâng cao.

Đọc thêm [`CONTRIBUTING.md`](CONTRIBUTING.md), [`SOURCING_POLICY.md`](SOURCING_POLICY.md), [`ROADMAP.md`](ROADMAP.md) và [`docs/LANGUAGES.md`](docs/LANGUAGES.md).

## Không đưa vào repo

- tài liệu bị đánh cắp/hack;
- leak bí mật thương mại;
- proprietary CAD/service manual không có quyền phát hành;
- private fab recipe;
- credential/token;
- full paper có bản quyền khi không có quyền redistribution;
- anonymous claim được trình bày như sự thật.

Mục tiêu của OpenEUV là xem cộng đồng có thể tái dựng được bao xa **bằng chứng cứ công khai, có thể kiểm tra và có provenance rõ ràng**.
