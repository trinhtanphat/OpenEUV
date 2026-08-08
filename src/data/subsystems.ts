export type EvidenceClass = 'official' | 'patent' | 'academic' | 'inferred' | 'unknown'

export type Subsystem = {
  id: string
  short: string
  title: string
  subtitle: string
  confidence: EvidenceClass
  description: string
  facts: string[]
  openQuestions: string[]
}

export const subsystems: Subsystem[] = [
  {
    id: 'source',
    short: 'SRC',
    title: 'EUV light source',
    subtitle: 'Tin plasma → 13.5 nm radiation',
    confidence: 'official',
    description: 'Conceptual public-source reconstruction of the source chain: drive laser, tin droplet target, plasma, collector and intermediate focus.',
    facts: ['Commercial EUV scanners use 13.5 nm radiation.', 'Laser-produced plasma converts energy into EUV radiation.', 'The collector redirects usable EUV toward the illumination system.'],
    openQuestions: ['How should the public model represent debris mitigation without implying proprietary geometry?', 'Which public patents best constrain collector topology?'],
  },
  {
    id: 'illuminator', short: 'ILL', title: 'Illumination system', subtitle: 'Shapes pupil and field illumination', confidence: 'official',
    description: 'Reflective optics transform source radiation into the illumination conditions needed at the reflective mask.',
    facts: ['EUV optical paths are reflective rather than transmissive.', 'High-NA illumination hardware is substantially larger than earlier EUV generations.'],
    openQuestions: ['Map published illumination concepts to a neutral, non-proprietary 3D layout.'],
  },
  {
    id: 'reticle', short: 'RET', title: 'Reticle & mask stage', subtitle: 'Reflective patterned mask', confidence: 'patent',
    description: 'The reticle carries the circuit pattern and is scanned in synchrony with the wafer stage.',
    facts: ['EUV masks are reflective multilayer structures.', 'Scan exposure coordinates reticle and wafer motion.'],
    openQuestions: ['Build a public patent family map for reticle clamping, scanning and contamination controls.'],
  },
  {
    id: 'projection', short: 'PROJ', title: 'Projection optics', subtitle: 'Reflective imaging to the wafer', confidence: 'official',
    description: 'A chain of precision mirrors forms a demagnified image of the mask pattern on the resist-coated wafer.',
    facts: ['ZEISS reports High-NA projection optics contain more than 40,000 parts.', 'High-NA increases numerical aperture from 0.33 to 0.55.'],
    openQuestions: ['Which published optical layouts are representative enough for educational ray visualization?', 'Separate confirmed geometry from illustrative geometry.'],
  },
  {
    id: 'wafer', short: 'WFR', title: 'Wafer stage', subtitle: 'Nanometer-class motion & alignment', confidence: 'official',
    description: 'The wafer stage positions a 300 mm wafer while metrology closes the motion-control loop during scanning.',
    facts: ['Exposure is a tightly synchronized scanning process.', 'Stage motion, focus and overlay are coupled to metrology and control.'],
    openQuestions: ['Create a simplified six-degree-of-freedom motion visualization.'],
  },
  {
    id: 'metrology', short: 'MET', title: 'Metrology & control', subtitle: 'Measure → estimate → compensate', confidence: 'inferred',
    description: 'This layer visualizes the control architecture conceptually: position sensing, focus, dose, thermal drift and feedback.',
    facts: ['Modern lithography depends on continuous measurement and compensation.', 'The exact control implementation is proprietary and intentionally not reproduced.'],
    openQuestions: ['Add cited educational models for overlay, focus and aberration control.'],
  },
  {
    id: 'vacuum', short: 'VAC', title: 'Vacuum & contamination control', subtitle: 'Protect the EUV optical path', confidence: 'patent',
    description: 'EUV is strongly attenuated by matter, so source, optics and exposure regions require vacuum-compatible handling and contamination management.',
    facts: ['Public patents describe vacuum exposure chambers and load locks.', 'Wafer and reticle handling must bridge atmospheric and vacuum environments.'],
    openQuestions: ['Model only conceptual pumping zones, not proprietary facility recipes.'],
  },
]

export const sourceLinks = [
  { label: 'ASML — EUV technology', href: 'https://www.asml.com/en/technology/lithography-principles' },
  { label: 'ZEISS — High-NA EUV', href: 'https://www.zeiss.com/semiconductor-manufacturing-technology/inspiring-technology/high-na-euv-lithography.html' },
  { label: 'TSMC — N7+ EUV', href: 'https://www.tsmc.com/english/campaign/N7plus' },
  { label: 'Google Patents — EUV optical example', href: 'https://patents.google.com/patent/US6803994B2/en' },
]
