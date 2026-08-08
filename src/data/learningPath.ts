export type LearningLevel = {
  id: string
  level: number
  title: { en: string; vi: string }
  goal: { en: string; vi: string }
  topics: { en: string[]; vi: string[] }
  labs: string[]
  contribution: { en: string; vi: string }
}

export const learningPath: LearningLevel[] = [
  {
    id: 'foundations',
    level: 0,
    title: { en: 'Foundations: chips & lithography', vi: 'Nền tảng: chip & lithography' },
    goal: { en: 'Understand why lithography exists and where exposure fits in semiconductor manufacturing.', vi: 'Hiểu vì sao cần lithography và exposure nằm ở đâu trong quá trình sản xuất bán dẫn.' },
    topics: {
      en: ['Wafer, resist and pattern transfer', 'Critical dimension intuition', 'Layers and alignment', 'DUV → EUV motivation'],
      vi: ['Wafer, resist và pattern transfer', 'Trực giác critical dimension', 'Các lớp và alignment', 'Động lực chuyển DUV → EUV'],
    },
    labs: ['Resolution playground', 'Fab flow'],
    contribution: { en: 'Improve beginner explanations and diagrams.', vi: 'Cải thiện giải thích/diagram cho người mới.' },
  },
  {
    id: 'optics',
    level: 1,
    title: { en: 'Optics: waves, NA & imaging', vi: 'Quang học: sóng, NA & imaging' },
    goal: { en: 'Build the optical vocabulary needed to reason about projection lithography.', vi: 'Xây vocabulary quang học cần thiết để hiểu projection lithography.' },
    topics: {
      en: ['Wavelength and diffraction', 'Numerical aperture', 'Spatial frequency and transfer functions', 'Reflective vs refractive optics'],
      vi: ['Bước sóng và diffraction', 'Numerical aperture', 'Spatial frequency và transfer function', 'Quang phản xạ vs khúc xạ'],
    },
    labs: ['Low-NA vs High-NA', 'Anamorphic field', 'Fourier imaging lab', 'Vacuum & mirrors concept lab'],
    contribution: { en: 'Add visual optics explainers and validate terminology.', vi: 'Thêm visual explainer quang học và kiểm tra thuật ngữ.' },
  },
  {
    id: 'euv-physics',
    level: 2,
    title: { en: 'EUV physics & multilayers', vi: 'Vật lý EUV & multilayer' },
    goal: { en: 'Understand why EUV uses reflective multilayer optics and vacuum.', vi: 'Hiểu vì sao EUV dùng quang phản xạ multilayer và vacuum.' },
    topics: {
      en: ['13.5 nm context', 'Absorption and vacuum', 'Complex refractive index', 'Thin-film interference and s/p polarization'],
      vi: ['Bối cảnh 13,5 nm', 'Hấp thụ và vacuum', 'Complex refractive index', 'Thin-film interference và phân cực s/p'],
    },
    labs: ['Vacuum & mirrors concept lab', 'Multilayer simulator', 'Optical constants adapter'],
    contribution: { en: 'Add lawful optical datasets and cross-check numerical models.', vi: 'Thêm optical dataset hợp pháp và cross-check mô hình số.' },
  },
  {
    id: 'scanner-systems',
    level: 3,
    title: { en: 'Scanner systems engineering', vi: 'Systems engineering của scanner' },
    goal: { en: 'Connect source, illumination, reticle, projection, wafer stage, metrology and vacuum as one system.', vi: 'Kết nối source, illumination, reticle, projection, wafer stage, metrology và vacuum thành một hệ thống.' },
    topics: {
      en: ['Subsystem interfaces', 'Exploded architecture', 'Reticle and mask handling concepts', 'Wafer-stage and metrology loops'],
      vi: ['Interface giữa subsystem', 'Kiến trúc exploded', 'Khái niệm reticle/mask handling', 'Wafer-stage và vòng metrology'],
    },
    labs: ['3D Atlas', 'Assembly Explorer', '6-DoF stage'],
    contribution: { en: 'Model evidence-backed concept nodes and open interface unknowns.', vi: 'Model node có evidence và các unknown về interface.' },
  },
  {
    id: 'high-na',
    level: 4,
    title: { en: 'High-NA & image-quality effects', vi: 'High-NA & hiệu ứng chất lượng ảnh' },
    goal: { en: 'Explore the public concepts that become more important as NA rises.', vi: 'Khám phá các khái niệm công khai quan trọng hơn khi NA tăng.' },
    topics: {
      en: ['0.33 → 0.55 NA', '4×/8× anamorphic imaging', 'Spatial-frequency filtering and mask 3D effects', 'Aberration, focus, leveling and overlay'],
      vi: ['NA 0,33 → 0,55', 'Imaging anamorphic 4×/8×', 'Spatial-frequency filtering và mask 3D effects', 'Aberration, focus, leveling và overlay'],
    },
    labs: ['Fourier imaging lab', 'Anamorphic lab', 'Mask 3D lab', 'Aberration/focus lab'],
    contribution: { en: 'Improve public-source High-NA visualizations without inventing proprietary prescriptions.', vi: 'Cải thiện visualization High-NA từ nguồn công khai mà không bịa prescription độc quyền.' },
  },
  {
    id: 'research',
    level: 5,
    title: { en: 'Research: evidence, patents & computation', vi: 'Nghiên cứu: evidence, patent & computation' },
    goal: { en: 'Move from learning the system to testing public hypotheses and improving provenance.', vi: 'Chuyển từ học hệ thống sang kiểm thử giả thuyết công khai và nâng provenance.' },
    topics: {
      en: ['Patent-family mapping', 'Electromagnetic mask models', 'Public computational imaging concepts', 'Evidence review and open unknowns'],
      vi: ['Mapping patent family', 'Mô hình điện từ cho mask', 'Khái niệm computational imaging công khai', 'Evidence review và open unknowns'],
    },
    labs: ['Patent Explorer', 'Evidence Dashboard', 'Reproducibility scripts'],
    contribution: { en: 'Add metadata, public datasets, reproducible simulations and clearly bounded hypotheses.', vi: 'Thêm metadata, public dataset, simulation tái lập được và giả thuyết có ranh giới rõ.' },
  },
]
