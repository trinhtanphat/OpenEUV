export type AssemblyStage = {
  id: string
  subsystem: string
  title: { en: string; vi: string }
  summary: { en: string; vi: string }
  publicEvidence: { en: string; vi: string }
  boundary: { en: string; vi: string }
  dependencies: string[]
  outputs: { en: string[]; vi: string[] }
  status: 'documented-function' | 'public-inference' | 'illustrative'
}

export const assemblyStages: AssemblyStage[] = [
  {
    id: 'architecture',
    subsystem: 'system',
    title: { en: 'Architecture & module interfaces', vi: 'Kiến trúc & giao diện module' },
    summary: { en: 'Start from the public functional decomposition: source, illumination, reticle, projection, wafer stage, metrology and vacuum.', vi: 'Bắt đầu từ phân rã chức năng công khai: nguồn EUV, chiếu sáng, reticle, projection, wafer stage, metrology và vacuum.' },
    publicEvidence: { en: 'Manufacturer technology pages, system overviews and public patents establish the functional blocks.', vi: 'Trang công nghệ của hãng, tổng quan hệ thống và patent công khai xác lập các khối chức năng.' },
    boundary: { en: 'Exact mechanical interfaces, tolerances and proprietary integration specifications are not reconstructed.', vi: 'Không tái dựng giao diện cơ khí chính xác, dung sai hay thông số tích hợp độc quyền.' },
    dependencies: [],
    outputs: { en: ['Functional block map', 'Evidence IDs', 'Unknown-interface list'], vi: ['Bản đồ khối chức năng', 'Evidence ID', 'Danh sách giao diện chưa biết'] },
    status: 'documented-function',
  },
  {
    id: 'platform',
    subsystem: 'vacuum',
    title: { en: 'Vacuum & mechanical platform', vi: 'Nền tảng vacuum & cơ khí' },
    summary: { en: 'Represent the common platform that supports modules in an EUV-compatible low-pressure environment.', vi: 'Biểu diễn nền tảng chung hỗ trợ các module trong môi trường áp suất thấp phù hợp EUV.' },
    publicEvidence: { en: 'Public EUV explanations establish that air absorbs EUV and reflective optics operate in vacuum.', vi: 'Nguồn EUV công khai xác nhận không khí hấp thụ EUV và hệ quang phản xạ vận hành trong vacuum.' },
    boundary: { en: 'No chamber dimensions, pump sizing, service layout or vendor mechanical drawings are implied.', vi: 'Không suy ra kích thước chamber, sizing bơm, service layout hay bản vẽ cơ khí hãng.' },
    dependencies: ['architecture'],
    outputs: { en: ['Concept platform', 'Vacuum boundary', 'Module attachment zones'], vi: ['Nền tảng khái niệm', 'Ranh giới vacuum', 'Vùng gắn module'] },
    status: 'documented-function',
  },
  {
    id: 'source',
    subsystem: 'source',
    title: { en: 'EUV source module integration', vi: 'Tích hợp module nguồn EUV' },
    summary: { en: 'Model the source as a separately integrated functional module feeding a collector and illumination path.', vi: 'Mô hình hóa nguồn như một module chức năng tích hợp riêng, cấp ánh sáng vào collector và đường chiếu sáng.' },
    publicEvidence: { en: 'Public manufacturer and patent material describes target-droplet, plasma-source and collector concepts.', vi: 'Nguồn hãng và patent công khai mô tả các khái niệm target-droplet, plasma source và collector.' },
    boundary: { en: 'OpenEUV intentionally omits real laser operating instructions, source recipes, timings and hazardous laboratory procedures.', vi: 'OpenEUV chủ động không cung cấp hướng dẫn vận hành laser thật, recipe nguồn, timing hay quy trình phòng thí nghiệm nguy hiểm.' },
    dependencies: ['platform'],
    outputs: { en: ['Source envelope', 'Collector concept', 'Evidence-linked source nodes'], vi: ['Envelope nguồn', 'Collector concept', 'Node nguồn gắn evidence'] },
    status: 'documented-function',
  },
  {
    id: 'illumination',
    subsystem: 'illuminator',
    title: { en: 'Illumination module', vi: 'Module chiếu sáng' },
    summary: { en: 'Trace the conceptual handoff from collected EUV into an illumination system that prepares light for the reflective mask.', vi: 'Theo dõi bàn giao khái niệm từ EUV đã thu vào hệ chiếu sáng chuẩn bị ánh sáng cho reflective mask.' },
    publicEvidence: { en: 'Public ASML/ZEISS material identifies illumination as a major optical subsystem and reports high component complexity.', vi: 'Tài liệu công khai ASML/ZEISS xác định illumination là subsystem quang học lớn và cho thấy độ phức tạp linh kiện cao.' },
    boundary: { en: 'Mirror prescriptions, coatings, alignment tolerances and proprietary pupil-shaping mechanisms remain unknown.', vi: 'Prescription gương, coating, dung sai căn chỉnh và cơ chế pupil-shaping độc quyền vẫn là unknown.' },
    dependencies: ['source'],
    outputs: { en: ['Illumination block', 'Optical handoff', 'Open questions'], vi: ['Khối illumination', 'Bàn giao quang học', 'Câu hỏi mở'] },
    status: 'public-inference',
  },
  {
    id: 'reticle',
    subsystem: 'reticle',
    title: { en: 'Reticle stage & reflective mask', vi: 'Reticle stage & reflective mask' },
    summary: { en: 'Integrate the reflective-mask handling and positioning concept between illumination and projection optics.', vi: 'Tích hợp khái niệm giữ/định vị reflective mask giữa illumination và projection optics.' },
    publicEvidence: { en: 'Published patents and academic mask models establish reflective reticle support, shielding and mask-stack concepts.', vi: 'Patent công khai và mô hình mask học thuật xác lập các khái niệm hỗ trợ reticle phản xạ, shielding và mask stack.' },
    boundary: { en: 'No production mask pattern, clamp geometry, stage-control law or cleanliness recipe is represented.', vi: 'Không biểu diễn pattern mask sản xuất, hình học clamp, control law của stage hay recipe vệ sinh.' },
    dependencies: ['illumination'],
    outputs: { en: ['Reticle concept asset', 'Mask evidence links', 'Lifecycle questions'], vi: ['Reticle concept asset', 'Liên kết evidence mask', 'Câu hỏi lifecycle'] },
    status: 'documented-function',
  },
  {
    id: 'projection',
    subsystem: 'projection',
    title: { en: 'Projection optics integration', vi: 'Tích hợp projection optics' },
    summary: { en: 'Connect the reflective mask to a multi-mirror projection objective and the wafer image plane.', vi: 'Kết nối reflective mask với objective projection nhiều gương và mặt phẳng ảnh trên wafer.' },
    publicEvidence: { en: 'Manufacturer information, patents and academic optics papers support reflective multi-mirror projection and High-NA concepts.', vi: 'Nguồn hãng, patent và paper quang học hỗ trợ projection phản xạ nhiều gương và khái niệm High-NA.' },
    boundary: { en: 'OpenEUV does not claim the real mirror prescription, dimensions, surface maps or production alignment procedure.', vi: 'OpenEUV không tuyên bố prescription gương thật, kích thước, surface map hay quy trình alignment sản xuất.' },
    dependencies: ['reticle'],
    outputs: { en: ['Projection concept asset', 'Mirror labels', 'Low-NA/High-NA learning links'], vi: ['Projection concept asset', 'Label gương', 'Liên kết học Low-NA/High-NA'] },
    status: 'documented-function',
  },
  {
    id: 'stage-metrology',
    subsystem: 'wafer',
    title: { en: 'Wafer stage & metrology', vi: 'Wafer stage & metrology' },
    summary: { en: 'Combine conceptual wafer positioning, six-degree-of-freedom motion, focus/leveling and measurement loops.', vi: 'Kết hợp định vị wafer khái niệm, chuyển động 6 bậc tự do, focus/leveling và các vòng đo lường.' },
    publicEvidence: { en: 'Public lithography explanations and patents establish precision stages, positioning and metrology as core functions.', vi: 'Nguồn lithography và patent công khai xác lập precision stage, positioning và metrology là chức năng cốt lõi.' },
    boundary: { en: 'Control gains, servo architecture, sensor placement and production overlay algorithms are not reconstructed.', vi: 'Không tái dựng gain điều khiển, kiến trúc servo, vị trí sensor hay thuật toán overlay sản xuất.' },
    dependencies: ['projection'],
    outputs: { en: ['6-DoF teaching model', 'Focus/overlay mapping', 'Measurement unknowns'], vi: ['Mô hình học 6-DoF', 'Mapping focus/overlay', 'Unknown về đo lường'] },
    status: 'documented-function',
  },
  {
    id: 'integration',
    subsystem: 'system',
    title: { en: 'System integration & qualification', vi: 'Tích hợp hệ thống & qualification' },
    summary: { en: 'Treat separately tested modules as a system-integration problem: interfaces, alignment, calibration, verification and release to operation.', vi: 'Xem các module đã test riêng như bài toán tích hợp hệ thống: interface, alignment, calibration, verification và đưa vào vận hành.' },
    publicEvidence: { en: 'ASML publicly describes High-NA systems as modular, with modules tested independently before integration.', vi: 'ASML công khai mô tả hệ High-NA theo module, với các module được test độc lập trước khi tích hợp.' },
    boundary: { en: 'This is a systems-engineering learning sequence, not an installation manual or service procedure.', vi: 'Đây là chuỗi học systems engineering, không phải installation manual hay service procedure.' },
    dependencies: ['platform', 'source', 'illumination', 'reticle', 'projection', 'stage-metrology'],
    outputs: { en: ['Interface checklist', 'Calibration concept map', 'Qualification evidence/unknowns'], vi: ['Checklist interface', 'Bản đồ calibration', 'Evidence/unknowns qualification'] },
    status: 'documented-function',
  },
]
