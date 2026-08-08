export type Language = 'en' | 'vi'

const copy = {
  en: {
    navExplorer: 'Explorer',
    navLabs: 'Labs',
    navPatents: 'Patents',
    navFab: 'TSMC timeline',
    navEvidence: 'Evidence',
    navContribute: 'Contribute',
    heroKicker: 'Open-source EUV engineering atlas',
    heroTitle: "Explore one of humanity's most complex machines.",
    heroBody: 'Reconstruct EUV lithography from lawful public evidence — in 3D. Learn the physics, map patents, test educational models, and turn every unknown into a contributor mission.',
    explore: 'Explore scanner',
    missions: 'Find a mission',
    workbench: 'Research workbench',
    workbenchTitle: 'From fundamentals to High-NA research.',
    workbenchBody: 'Interactive labs connect optics, multilayers, patents, stage motion and foundry history without pretending our reconstruction is proprietary CAD.',
    assembled: 'Assembled',
    exploded: 'Exploded',
    language: 'VI',
  },
  vi: {
    navExplorer: 'Khám phá',
    navLabs: 'Mô phỏng',
    navPatents: 'Bằng sáng chế',
    navFab: 'TSMC',
    navEvidence: 'Nguồn chứng cứ',
    navContribute: 'Đóng góp',
    heroKicker: 'Bản đồ kỹ thuật EUV mã nguồn mở',
    heroTitle: 'Khám phá một trong những cỗ máy phức tạp nhất con người từng chế tạo.',
    heroBody: 'Tái dựng quang khắc EUV từ nguồn công khai hợp pháp dưới dạng 3D. Học vật lý, lập bản đồ bằng sáng chế, chạy mô hình giáo dục và biến các phần chưa biết thành nhiệm vụ contributor.',
    explore: 'Khám phá máy',
    missions: 'Nhận nhiệm vụ',
    workbench: 'Phòng nghiên cứu',
    workbenchTitle: 'Từ nền tảng đến High-NA chuyên sâu.',
    workbenchBody: 'Các mô phỏng liên kết quang học, multilayer, bằng sáng chế, chuyển động stage và lịch sử foundry, đồng thời luôn phân biệt mô hình công khai với CAD độc quyền.',
    assembled: 'Lắp hoàn chỉnh',
    exploded: 'Tách cụm',
    language: 'EN',
  },
} as const

export type CopyKey = keyof typeof copy.en

export function t(language: Language, key: CopyKey): string {
  return copy[language][key]
}

export const subsystemVi: Record<string, { title: string; subtitle: string }> = {
  source: { title: 'Nguồn sáng EUV', subtitle: 'Laser, giọt thiếc, plasma và collector' },
  illuminator: { title: 'Hệ chiếu sáng', subtitle: 'Định hình và phân phối chùm EUV' },
  reticle: { title: 'Reticle & mask stage', subtitle: 'Mặt nạ phản xạ và chuyển động quét' },
  projection: { title: 'Quang học chiếu', subtitle: 'Hệ gương phản xạ tạo ảnh lên wafer' },
  wafer: { title: 'Wafer stage', subtitle: 'Định vị và quét wafer độ chính xác cao' },
  metrology: { title: 'Đo lường & điều khiển', subtitle: 'Feedback, hiệu chỉnh và đồng bộ' },
  vacuum: { title: 'Chân không & nhiễm bẩn', subtitle: 'Môi trường truyền EUV và kiểm soát contamination' },
}
