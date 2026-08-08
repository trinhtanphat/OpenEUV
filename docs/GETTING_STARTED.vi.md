# Bắt đầu với OpenEUV

Tài liệu này dành cho contributor Việt Nam muốn chạy project, hiểu evidence policy và chọn một track đóng góp.

## 1. Chuẩn bị

Yêu cầu chính:

- Node.js 22;
- npm;
- trình duyệt Chromium/Chrome tương thích WebGL;
- Python 3 nếu muốn regenerate concept assets hoặc chạy cross-check nghiên cứu.

## 2. Chạy ứng dụng

```bash
npm install
npm run dev
```

Sau đó mở địa chỉ mà Vite hiển thị trong terminal.

## 3. Chạy bộ kiểm tra

Core checks:

```bash
npm run check
```

Browser tests:

```bash
npx playwright install chromium
npm run e2e
```

Các gate chính gồm:

- evidence validation;
- unit tests;
- TypeScript typecheck;
- production build;
- Chromium desktop/mobile smoke tests;
- WebGL canvas-health check;
- glTF fallback test;
- tour/evidence/i18n/patent/fab assertions.

## 4. Hiểu evidence trước khi sửa nội dung kỹ thuật

Đọc [`../SOURCING_POLICY.md`](../SOURCING_POLICY.md).

Nguyên tắc ngắn gọn:

- A = first-party public source;
- B = patent/standard công khai;
- C = academic;
- D = inference có rationale;
- ? = chưa đủ evidence.

Nếu hình học không được tài liệu công khai xác nhận, dùng `illustrative` hoặc `inferred`, không gọi nó là CAD thật.

## 5. Track đóng góp

### 3D

- chỉnh concept asset generator;
- tạo glTF/GLB nguyên bản;
- thêm labels/LOD/camera tour;
- ghi provenance trong `docs/ASSETS.md`.

### Physics / optics

- thêm mô hình giáo dục có assumptions rõ;
- viết unit tests cho helper thuần;
- cross-check với script/notebook độc lập;
- không biến default parameter thành production recipe.

### Patent / academic research

- lưu metadata + public link + original summary;
- dùng normalizer trong `tools/`;
- không copy toàn văn paper/paywalled PDF hoặc patent figure vào repo khi không có quyền redistribution.

### Evidence

- bổ sung source tốt hơn;
- resolve unknown;
- sửa confidence/rationale khi có bằng chứng;
- giữ ID ổn định khi có thể.

### I18N

- đọc [`LANGUAGES.md`](LANGUAGES.md);
- giữ claim ID/source URL/evidence class dùng chung;
- giữ các thuật ngữ quốc tế quan trọng trong ngoặc.

## 6. Regenerate 3D concept assets

```bash
python tools/generate-concept-assets.py all
```

Các asset hiện tại là hình học nguyên bản của OpenEUV và có procedural fallback trong viewer.

## 7. Normalize research metadata

Patent:

```bash
node tools/patent-metadata-normalize.mjs input.json output.json
```

Literature/DOI:

```bash
node tools/literature-metadata-normalize.mjs input.json output.json
```

## 8. Dataset workflow

Đọc [`DATASETS.md`](DATASETS.md) và cập nhật `datasets/manifest.json` khi một dataset trở thành output tái sử dụng chính thức của repo.

## 9. Trước khi mở PR

- chạy test/build;
- kiểm tra mobile nếu sửa UI;
- thêm source/provenance;
- ghi rõ phần `documented`, `inferred`, `illustrative`;
- không đưa leak, credential, proprietary CAD/service manual hoặc private fab recipe vào repo.

Nếu một chi tiết thú vị chỉ xuất hiện trong nguồn đáng ngờ, hãy mở **research question** để cộng đồng tìm nguồn công khai hợp pháp thay vì upload tài liệu đó.
