# Bắt đầu với OpenEUV

Tài liệu này dành cho contributor Việt Nam muốn chạy project, hiểu evidence policy và chọn một track đóng góp.

## 1. Chuẩn bị

Yêu cầu chính:

- Node.js 22;
- npm;
- trình duyệt Chromium/Chrome tương thích WebGL;
- Python 3 nếu muốn regenerate concept assets hoặc chạy cross-check nghiên cứu.

GitHub Actions hiện **được tắt có chủ đích**, nên verification phải chạy local trước khi deploy/claim PASS.

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

`npm run check` hiện gồm:

- core evidence validation;
- evidence-review registry/state validation;
- raw renderer benchmark capture validation;
- unit tests;
- TypeScript typecheck;
- production Vite build.

Browser tests:

```bash
npx playwright install chromium
npm run e2e
```

Browser QA kiểm tra desktop/mobile, WebGL canvas health, glTF fallback, guided tour, evidence labels, review-state UI, i18n, patent/fab assertions và benchmark capture smoke.

## 4. Hiểu evidence trước khi sửa nội dung kỹ thuật

Đọc [`../SOURCING_POLICY.md`](../SOURCING_POLICY.md) và [`RESEARCH_METHOD.md`](RESEARCH_METHOD.md).

Nguyên tắc ngắn gọn:

- A = first-party public source;
- B = patent/standard công khai;
- C = academic;
- D = inference có rationale;
- ? = chưa đủ evidence.

Nếu hình học không được tài liệu công khai xác nhận, dùng `illustrative`, `inferred/public-inference` hoặc `documented-function` đúng ngữ cảnh; không gọi nó là CAD thật.

## 5. Review evidence

`evidence/reviews.json` lưu collaborative review metadata.

Lifecycle:

```text
proposed → reviewed → superseded
```

Claim chưa có registry entry sẽ hiện `unreviewed`. Không tự tạo reviewer giả để tăng coverage.

Validator review-state được chạy trong `npm run validate:evidence` và `npm run check`.

Xem [`EVIDENCE_REVIEW.md`](EVIDENCE_REVIEW.md).

## 6. Track đóng góp

### 3D

- chỉnh concept asset generator;
- tạo glTF/GLB nguyên bản;
- thêm evidence labels/LOD/camera tour;
- giữ procedural fallback;
- ghi provenance trong [`ASSETS.md`](ASSETS.md).

### Assembly / education

- mở rộng Assembly Explorer ở mức systems engineering;
- bổ sung L0→L5 learning content;
- ghi rõ evidence boundary/unknowns;
- không biến nội dung thành installation/service manual hay hướng dẫn vận hành laser/plasma nguy hiểm.

### Physics / optics

- thêm mô hình giáo dục có assumptions rõ;
- viết unit tests cho helper thuần;
- cross-check với script/notebook độc lập;
- không biến default parameter thành production recipe;
- với optical data thật, phải có source/license/upstream revision/provenance rõ.

Dataset Mo/Windt CC0 hiện tại là ví dụ tham khảo cho cách pin public optical data.

### Patent / academic research

- lưu metadata + public link + original summary;
- dùng normalizer/audit trong `tools/` và `src/lib/`;
- không copy toàn văn paper/paywalled PDF hoặc patent figure vào repo khi không có quyền redistribution;
- không coi patent drawing là production geometry đã xác nhận.

### Fab

- ưu tiên nguồn first-party;
- case theo `public fact → why it matters → public boundary → unknowns`;
- không suy diễn layer count, yield, recipe, fab layout, scanner settings hay threshold nội bộ.

### Evidence

- bổ sung source tốt hơn;
- resolve unknown;
- sửa confidence/rationale khi có bằng chứng;
- giữ ID ổn định khi có thể;
- dùng supersession khi evidence mới thay/narrow evidence cũ.

### I18N

- đọc [`LANGUAGES.md`](LANGUAGES.md);
- giữ claim ID/source URL/evidence class dùng chung;
- giữ các thuật ngữ quốc tế quan trọng trong ngoặc.

### Performance

- chạy renderer benchmark trên **hardware thật**;
- export schema-ready capture từ `/benchmarks/render-benchmark.html`;
- validate bằng `npm run validate:benchmarks`;
- không dùng Playwright/emulator fixture như hardware benchmark evidence.

Xem [`../benchmarks/README.md`](../benchmarks/README.md).

## 7. Regenerate 3D concept assets

```bash
python tools/generate-concept-assets.py all
```

Các asset hiện tại là hình học nguyên bản của OpenEUV và có procedural fallback trong viewer.

## 8. Normalize research metadata

Patent:

```bash
node tools/patent-metadata-normalize.mjs input.json output.json
```

Literature/DOI:

```bash
node tools/literature-metadata-normalize.mjs input.json output.json
```

## 9. Dataset workflow

Đọc [`DATASETS.md`](DATASETS.md) và cập nhật `datasets/manifest.json` khi một dataset trở thành output tái sử dụng chính thức của repo.

Không vendor third-party bytes nếu redistribution terms không rõ. Khi chưa thể redistribute, lưu metadata + lawful link + original summary.

## 10. Deploy

Cloudflare Workers Static Assets là checked-in deployment path chính:

```bash
npm run check
npm run deploy:cloudflare:dry
npm run deploy:cloudflare
```

Repo cũng có `vercel.json` cho Vite SPA trên Vercel.

Xem [`DEPLOYMENT.md`](DEPLOYMENT.md).

## 11. Trước khi mở PR / push release

- chạy `npm run check`;
- chạy `npm run e2e` nếu sửa UI/3D/browser behavior;
- kiểm tra mobile nếu sửa UI;
- thêm source/provenance;
- ghi rõ phần `documented`, `inferred`, `illustrative`, `unknown`;
- không đưa leak, credential, proprietary CAD/service manual, private fab recipe hoặc hướng dẫn vận hành nguy hiểm vào repo;
- không ghi “verified/PASS” nếu chưa thực sự chạy gate cần thiết.

Nếu một chi tiết thú vị chỉ xuất hiện trong nguồn đáng ngờ, hãy mở **research question** để cộng đồng tìm nguồn công khai hợp pháp thay vì upload tài liệu đó.
