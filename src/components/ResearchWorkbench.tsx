import { t, type Language } from '../i18n'
import { AberrationFocusLab } from './AberrationFocusLab'
import { AnamorphicLab } from './AnamorphicLab'
import { FourierImagingLab } from './FourierImagingLab'
import { HighNAComparison } from './HighNAComparison'
import { Mask3DEffectsLab } from './Mask3DEffectsLab'
import { MirrorVacuumConceptLab } from './MirrorVacuumConceptLab'
import { MultilayerSimulator } from './MultilayerSimulator'
import { WaferStageLab } from './WaferStageLab'

const labGuide = [
  {
    id: 'high-na',
    titleEn: 'Low-NA ↔ High-NA',
    titleVi: 'Low-NA ↔ High-NA',
    bodyEn: 'Compare NA 0.33 and 0.55 using educational resolution proxies and public High-NA facts.',
    bodyVi: 'So sánh NA 0,33 và 0,55 bằng proxy phân giải giáo dục cùng các dữ kiện High-NA công khai.',
  },
  {
    id: 'anamorphic',
    titleEn: 'Anamorphic 4× / 8×',
    titleVi: 'Anamorphic 4× / 8×',
    bodyEn: 'Visualize ASML’s public description of different demagnification in orthogonal directions and the smaller exposure field.',
    bodyVi: 'Minh họa mô tả công khai của ASML về độ thu nhỏ khác nhau theo hai phương vuông góc và vùng phơi sáng nhỏ hơn.',
  },
  {
    id: 'fourier',
    titleEn: 'Fourier imaging',
    titleVi: 'Fourier imaging',
    bodyEn: 'See a normalized square pattern as spatial-frequency harmonics and watch an ideal pupil transfer attenuate high-frequency detail.',
    bodyVi: 'Xem pattern vuông chuẩn hóa dưới dạng các harmonic spatial-frequency và quan sát pupil lý tưởng làm suy giảm chi tiết tần số cao.',
  },
  {
    id: 'vacuum-mirrors',
    titleEn: 'Why vacuum & mirrors?',
    titleVi: 'Vì sao cần vacuum & mirrors?',
    bodyEn: 'Compare normalized absorption and cumulative reflection transfer using public evidence that EUV is strongly absorbed by air and conventional transmissive materials.',
    bodyVi: 'So sánh hấp thụ chuẩn hóa và tổn hao phản xạ tích lũy dựa trên bằng chứng công khai rằng EUV bị không khí và vật liệu truyền qua thông thường hấp thụ mạnh.',
  },
  {
    id: 'multilayer',
    titleEn: 'Multilayer & polarization',
    titleVi: 'Multilayer & phân cực',
    bodyEn: 'Explore s/p polarization and thin-film interference with an educational characteristic-matrix model and provenance-aware data adapters.',
    bodyVi: 'Khám phá phân cực s/p và giao thoa màng mỏng bằng mô hình characteristic-matrix giáo dục cùng adapter dữ liệu có provenance.',
  },
  {
    id: 'mask-3d',
    titleEn: 'Mask 3D effects',
    titleVi: 'Hiệu ứng 3D của mask',
    bodyEn: 'Build intuition for oblique illumination and mask-height shadowing without claiming a production mask recipe.',
    bodyVi: 'Tạo trực giác về chiếu xiên và shadowing do chiều cao mask mà không giả định recipe mask sản xuất.',
  },
  {
    id: 'aberration',
    titleEn: 'Aberration, focus & overlay',
    titleVi: 'Quang sai, focus & overlay',
    bodyEn: 'Use normalized proxies to learn how image formation, focus/leveling and layer alignment concepts relate.',
    bodyVi: 'Dùng các proxy chuẩn hóa để hiểu mối liên hệ giữa tạo ảnh, focus/leveling và căn chỉnh chồng lớp.',
  },
  {
    id: 'stage',
    titleEn: '6-DoF wafer stage',
    titleVi: 'Wafer stage 6 bậc tự do',
    bodyEn: 'Move X/Y/Z and Rx/Ry/Rz conceptually while keeping proprietary servo and control-law details out of scope.',
    bodyVi: 'Thao tác X/Y/Z và Rx/Ry/Rz ở mức khái niệm, không tái dựng servo hay control law độc quyền.',
  },
]

export function ResearchWorkbench({ language }: { language: Language }) {
  return (
    <section className="workbench" id="labs" data-language={language}>
      <div className="section-heading workbench-heading"><div><div className="eyebrow">{t(language, 'workbench')}</div><h2>{t(language, 'workbenchTitle')}</h2><p className="muted">{t(language, 'workbenchBody')}</p></div><div className="workbench-badges"><span>13.5 nm</span><span>NA 0.33 → 0.55</span><span>4× / 8× anamorphic</span><span>Fourier / MTF</span><span>vacuum + mirrors</span><span>6-DoF</span><span>aberration + overlay</span></div></div>
      <div className="lab-guide" aria-label={language === 'vi' ? 'Hướng dẫn các mô phỏng kỹ thuật' : 'Technical lab guide'}>{labGuide.map((item) => <article key={item.id} data-lab-guide={item.id}><strong>{language === 'vi' ? item.titleVi : item.titleEn}</strong><p>{language === 'vi' ? item.bodyVi : item.bodyEn}</p></article>)}</div>
      <div className="lab-grid"><HighNAComparison /><AnamorphicLab /><FourierImagingLab language={language} /><MirrorVacuumConceptLab language={language} /><MultilayerSimulator /><Mask3DEffectsLab /></div>
      <AberrationFocusLab />
      <WaferStageLab />
    </section>
  )
}
