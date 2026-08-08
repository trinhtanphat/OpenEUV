export type GlossaryEntry = {
  id: string
  termEn: string
  termVi: string
  noteEn: string
  noteVi: string
}

export const glossary: GlossaryEntry[] = [
  {
    id: 'lithography',
    termEn: 'Lithography',
    termVi: 'Quang khắc (lithography)',
    noteEn: 'Pattern-transfer step that uses controlled radiation and a mask or computational patterning flow to define structures on a wafer.',
    noteVi: 'Công đoạn truyền pattern lên wafer bằng bức xạ được kiểm soát cùng mask hoặc quy trình patterning tương ứng.',
  },
  {
    id: 'euv-lithography',
    termEn: 'EUV lithography',
    termVi: 'Quang khắc EUV',
    noteEn: 'Lithography using extreme-ultraviolet radiation around 13.5 nm in current commercial EUV systems.',
    noteVi: 'Quang khắc sử dụng bức xạ tử ngoại cực tím EUV khoảng 13,5 nm trong các hệ EUV thương mại hiện nay.',
  },
  {
    id: 'reticle',
    termEn: 'Reticle / photomask',
    termVi: 'Reticle / mặt nạ quang khắc',
    noteEn: 'Pattern-bearing mask used by the lithography system. EUV reticles are reflective rather than transmissive.',
    noteVi: 'Mặt nạ mang pattern được hệ quang khắc sử dụng. Reticle EUV hoạt động theo cơ chế phản xạ thay vì truyền qua.',
  },
  {
    id: 'numerical-aperture',
    termEn: 'Numerical aperture (NA)',
    termVi: 'Khẩu độ số (NA)',
    noteEn: 'Optical parameter related to the range of accepted ray angles and resolving capability; OpenEUV preserves the standard abbreviation NA.',
    noteVi: 'Tham số quang học liên quan đến dải góc tia được thu nhận và khả năng phân giải; OpenEUV giữ nguyên viết tắt quốc tế NA.',
  },
  {
    id: 'overlay',
    termEn: 'Overlay',
    termVi: 'Sai lệch chồng lớp (overlay)',
    noteEn: 'Relative alignment error between patterns from different lithographic layers.',
    noteVi: 'Sai lệch căn chỉnh tương đối giữa pattern của các lớp quang khắc khác nhau.',
  },
  {
    id: 'aberration',
    termEn: 'Optical aberration',
    termVi: 'Quang sai (aberration)',
    noteEn: 'Departure of an optical system from ideal image formation; examples include defocus, astigmatism and coma.',
    noteVi: 'Sai lệch của hệ quang khỏi quá trình tạo ảnh lý tưởng; ví dụ gồm defocus, astigmatism và coma.',
  },
  {
    id: 'metrology',
    termEn: 'Metrology',
    termVi: 'Đo lường chính xác / metrology',
    noteEn: 'Measurement systems and methods used to estimate position, focus, overlay and other quantities needed for lithography control.',
    noteVi: 'Hệ thống và phương pháp đo để ước lượng vị trí, focus, overlay và các đại lượng cần cho điều khiển quang khắc.',
  },
  {
    id: 'multilayer',
    termEn: 'Multilayer mirror',
    termVi: 'Gương đa lớp (multilayer mirror)',
    noteEn: 'Stack of thin layers engineered for constructive reflection at EUV wavelengths; OpenEUV models this only educationally.',
    noteVi: 'Chồng nhiều lớp mỏng được thiết kế để tăng phản xạ giao thoa ở bước sóng EUV; OpenEUV chỉ mô hình hóa ở mức giáo dục.',
  },
  {
    id: 'wafer-stage',
    termEn: 'Wafer stage',
    termVi: 'Bàn định vị wafer (wafer stage)',
    noteEn: 'Motion platform that positions and scans the wafer while interacting with metrology and focus/overlay control.',
    noteVi: 'Cụm chuyển động định vị và quét wafer, phối hợp với metrology cùng điều khiển focus/overlay.',
  },
  {
    id: 'collector',
    termEn: 'Collector mirror',
    termVi: 'Gương collector / gương thu EUV',
    noteEn: 'Reflective optical element associated with collecting usable EUV radiation from the source region.',
    noteVi: 'Phần tử quang phản xạ dùng để thu và hướng phần bức xạ EUV hữu ích từ vùng nguồn sáng.',
  },
  {
    id: 'pellicle',
    termEn: 'Pellicle / membrane',
    termVi: 'Màng bảo vệ mask (pellicle / membrane)',
    noteEn: 'Thin membrane concept associated with protecting the reticle environment; exact commercial implementations vary and may be proprietary.',
    noteVi: 'Khái niệm màng mỏng liên quan đến bảo vệ môi trường reticle; cách triển khai thương mại cụ thể có thể khác nhau và mang tính độc quyền.',
  },
  {
    id: 'anamorphic',
    termEn: 'Anamorphic optics',
    termVi: 'Quang học anamorphic',
    noteEn: 'Optics with different magnification in orthogonal directions; ASML publicly describes 4× / 8× demagnification for High-NA EUV.',
    noteVi: 'Hệ quang có độ phóng đại khác nhau theo hai phương vuông góc; ASML công khai mô tả thu nhỏ 4× / 8× cho High-NA EUV.',
  },
]
