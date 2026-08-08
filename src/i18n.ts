import { translateValue } from './lib/i18nCore.mjs'

export type Language = 'en' | 'vi'

const copy = {
  en: {
    navExplorer: 'Explorer',
    navLabs: 'Labs',
    navPatents: 'Patents',
    navFab: 'Fab cases',
    navEvidence: 'Evidence',
    navContribute: 'Contribute',
    heroKicker: 'Open-source EUV engineering atlas',
    heroTitle: "Explore one of humanity's most complex machines.",
    heroBody: 'Reconstruct EUV lithography from lawful public evidence — in 3D. Learn the physics, map patents, test educational models, and turn every unknown into a contributor mission.',
    explore: 'Explore scanner',
    missions: 'Find a mission',
    workbench: 'Research workbench',
    workbenchTitle: 'Physics, optics & motion labs',
    workbenchBody: 'Every lab states its assumptions and intentionally stops short of proprietary manufacturing recipes or machine-control details.',
    subsystemKnown: 'What we know',
    subsystemQuestions: 'Open contributor questions',
    evidenceContext: 'Contextual evidence',
    evidenceNodeNote: 'This node identifies an OpenEUV concept-asset group. Linked evidence supports functions and concepts, not the exact illustrated geometry.',
    evidenceNoDirect: 'No direct validated claim is mapped yet. Treat this as a contributor gap, not proof that the component is undocumented.',
    evidenceOpenQuestions: 'Open questions',
    glossaryEyebrow: 'EN ↔ VI technical terminology',
    glossaryTitle: 'Technical glossary',
    glossaryBody: 'Keep international semiconductor terms recognizable while giving Vietnamese readers a precise working translation. Claim IDs, citations and evidence classes stay language-neutral.',
    assembled: 'Assembled',
    exploded: 'Exploded',
    language: 'VI',
  },
  vi: {
    navExplorer: 'Khám phá',
    navLabs: 'Mô phỏng',
    navPatents: 'Bằng sáng chế',
    navFab: 'Tích hợp fab',
    navEvidence: 'Nguồn chứng cứ',
    navContribute: 'Đóng góp',
    heroKicker: 'Bản đồ kỹ thuật EUV mã nguồn mở',
    heroTitle: 'Khám phá một trong những cỗ máy phức tạp nhất con người từng chế tạo.',
    heroBody: 'Tái dựng quang khắc EUV từ nguồn công khai hợp pháp dưới dạng 3D. Học vật lý, lập bản đồ bằng sáng chế, chạy mô hình giáo dục và biến các phần chưa biết thành nhiệm vụ contributor.',
    explore: 'Khám phá máy',
    missions: 'Nhận nhiệm vụ',
    workbench: 'Phòng nghiên cứu',
    workbenchTitle: 'Phòng thí nghiệm vật lý, quang học và chuyển động',
    workbenchBody: 'Mỗi mô phỏng đều nêu rõ giả định và chủ động dừng trước các công thức chế tạo độc quyền, recipe sản xuất hoặc chi tiết điều khiển máy không công khai.',
    subsystemKnown: 'Điều đã biết từ nguồn công khai',
    subsystemQuestions: 'Câu hỏi mở cho contributor',
    evidenceContext: 'Chứng cứ theo ngữ cảnh',
    evidenceNodeNote: 'Tên node này chỉ một nhóm hình học khái niệm do OpenEUV tạo. Chứng cứ liên kết hỗ trợ chức năng hoặc nguyên lý, không xác nhận hình học minh họa là thiết kế thương mại thật.',
    evidenceNoDirect: 'Chưa có claim đã kiểm chứng liên kết trực tiếp. Hãy coi đây là khoảng trống nghiên cứu cho contributor, không phải bằng chứng rằng thành phần này không được công khai.',
    evidenceOpenQuestions: 'Câu hỏi còn mở',
    glossaryEyebrow: 'Thuật ngữ kỹ thuật EN ↔ VI',
    glossaryTitle: 'Từ điển thuật ngữ EUV',
    glossaryBody: 'Giữ nguyên các thuật ngữ bán dẫn quốc tế cần thiết, đồng thời cung cấp cách diễn đạt tiếng Việt chính xác để contributor Việt Nam và quốc tế dùng cùng một hệ khái niệm. Claim ID, citation và evidence class luôn dùng chung.',
    assembled: 'Lắp hoàn chỉnh',
    exploded: 'Tách cụm',
    language: 'EN',
  },
} as const

export type CopyKey = keyof typeof copy.en

export function t(language: Language, key: CopyKey): string {
  return translateValue(copy as unknown as Record<string, Record<string, string>>, language, key)
}

export type SubsystemLocalizedCopy = {
  title: string
  subtitle: string
  description: string
  facts: string[]
  openQuestions: string[]
}

export const subsystemVi: Record<string, SubsystemLocalizedCopy> = {
  source: {
    title: 'Nguồn sáng EUV',
    subtitle: 'Plasma thiếc → bức xạ 13,5 nm',
    description: 'Bản tái dựng khái niệm từ nguồn công khai của chuỗi tạo sáng: laser kích thích, giọt thiếc, plasma, collector và intermediate focus.',
    facts: ['Máy quang khắc EUV thương mại sử dụng bức xạ khoảng 13,5 nm.', 'Plasma tạo bởi laser chuyển năng lượng thành bức xạ EUV.', 'Collector hướng phần EUV hữu ích về hệ chiếu sáng.'],
    openQuestions: ['Nên minh họa cơ chế giảm debris thế nào mà không ám chỉ hình học độc quyền?', 'Những patent công khai nào giúp ràng buộc mô hình collector tốt nhất?'],
  },
  illuminator: {
    title: 'Hệ chiếu sáng (illumination system)',
    subtitle: 'Định hình pupil và vùng chiếu sáng',
    description: 'Hệ quang học phản xạ biến đổi bức xạ từ nguồn thành điều kiện chiếu sáng phù hợp tại mặt nạ phản xạ.',
    facts: ['Đường truyền quang EUV dùng gương phản xạ thay vì thấu kính truyền qua.', 'Phần cứng illumination High-NA có quy mô lớn hơn đáng kể so với các thế hệ EUV trước.'],
    openQuestions: ['Ánh xạ các khái niệm illumination đã công bố thành bố cục 3D trung tính, không độc quyền.'],
  },
  reticle: {
    title: 'Reticle & mask stage',
    subtitle: 'Mặt nạ phản xạ mang pattern',
    description: 'Reticle mang pattern của mạch và được quét đồng bộ với wafer stage trong quá trình phơi sáng.',
    facts: ['Mask EUV là cấu trúc phản xạ đa lớp (multilayer).', 'Phơi sáng kiểu scan phối hợp chuyển động reticle và wafer.'],
    openQuestions: ['Mở rộng family map cho các patent công khai về clamp, scan và kiểm soát nhiễm bẩn quanh reticle.'],
  },
  projection: {
    title: 'Quang học chiếu (projection optics)',
    subtitle: 'Tạo ảnh phản xạ lên wafer',
    description: 'Chuỗi gương chính xác tạo ảnh thu nhỏ của pattern trên mask lên lớp resist phủ trên wafer.',
    facts: ['ZEISS công bố projection optics High-NA có hơn 40.000 bộ phận.', 'High-NA nâng numerical aperture từ 0,33 lên 0,55.'],
    openQuestions: ['Bố cục quang học công khai nào đủ đại diện cho ray visualization giáo dục?', 'Tách rõ hình học được xác nhận với hình học chỉ để minh họa.'],
  },
  wafer: {
    title: 'Wafer stage',
    subtitle: 'Chuyển động và căn chỉnh wafer độ chính xác cao',
    description: 'Wafer stage định vị wafer 300 mm trong khi hệ metrology đóng vòng phản hồi chuyển động khi scan.',
    facts: ['Phơi sáng là quá trình scan cần đồng bộ chặt chẽ.', 'Chuyển động stage, focus và overlay liên hệ với metrology và control.'],
    openQuestions: ['Mở rộng mô phỏng 6 bậc tự do với các mô hình giáo dục có citation rõ ràng.'],
  },
  metrology: {
    title: 'Metrology & control',
    subtitle: 'Đo → ước lượng → bù sai lệch',
    description: 'Lớp này minh họa kiến trúc điều khiển ở mức khái niệm: cảm biến vị trí, focus, dose, thermal drift và feedback.',
    facts: ['Quang khắc hiện đại phụ thuộc vào đo lường và bù sai lệch liên tục.', 'Cách triển khai control chính xác là độc quyền và OpenEUV chủ động không tái dựng.'],
    openQuestions: ['Bổ sung mô hình giáo dục có nguồn cho overlay, focus và aberration control.'],
  },
  vacuum: {
    title: 'Chân không & kiểm soát nhiễm bẩn',
    subtitle: 'Bảo vệ đường truyền quang EUV',
    description: 'EUV bị vật chất hấp thụ rất mạnh, vì vậy vùng nguồn sáng, quang học và phơi sáng cần cơ chế vận hành tương thích chân không và quản lý contamination.',
    facts: ['Patent công khai mô tả exposure chamber chân không và load lock.', 'Wafer và reticle phải được xử lý khi chuyển giữa môi trường khí quyển và chân không.'],
    openQuestions: ['Chỉ mô hình hóa pumping zone ở mức khái niệm, không tái dựng facility recipe độc quyền.'],
  },
}
