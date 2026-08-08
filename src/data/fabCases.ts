export type FabCaseKind = 'foundry' | 'research-fab' | 'scanner-interface' | 'mask-lifecycle'

export type FabCase = {
  id: string
  kind: FabCaseKind
  organization: string
  year: string
  title: string
  summary: string
  whyItMatters: string
  claimIds: string[]
  publicBoundary: string
  unknowns: string[]
}

export const fabCases: FabCase[] = [
  {
    id: 'tsmc-volume-adoption',
    kind: 'foundry',
    organization: 'TSMC',
    year: '2019–2020',
    title: 'EUV moves into volume-production process families',
    summary: 'TSMC publicly identifies N7+ as its first EUV process to enter volume production and states that N6 uses additional EUV layers while building on the N7 family.',
    whyItMatters: 'This is foundry-integration evidence: it shows EUV entering real process families without treating the scanner itself as a TSMC-designed machine.',
    claimIds: ['TSMC-N7PLUS-001', 'TSMC-N6-001'],
    publicBoundary: 'OpenEUV records only the milestones and process-family statements that TSMC publishes.',
    unknowns: ['Exact confidential layer selection', 'Internal recipes and process windows', 'Yield and availability details not publicly established'],
  },
  {
    id: 'samsung-7lpp-v1',
    kind: 'foundry',
    organization: 'Samsung Foundry',
    year: '2018–2020',
    title: '7LPP wafer production to a dedicated EUV production line',
    summary: 'Samsung announced 7LPP EUV wafer production in 2018 and later reported that its V1 line had begun mass production as Samsung’s first semiconductor production line dedicated to EUV lithography.',
    whyItMatters: 'The pair of first-party milestones illustrates the difference between introducing an EUV process and scaling dedicated manufacturing capacity.',
    claimIds: ['SAMSUNG-7LPP-EUV-2018', 'SAMSUNG-V1-EUV-2020'],
    publicBoundary: 'The case does not infer mask counts, internal floor layout, tool count, proprietary inspection flows or operating parameters.',
    unknowns: ['Confidential recipe details', 'Per-product layer choices', 'Internal line configuration beyond the published description'],
  },
  {
    id: 'intel-highna-d1x',
    kind: 'research-fab',
    organization: 'Intel Foundry',
    year: '2024',
    title: 'High-NA scanner installation enters calibration at D1X',
    summary: 'Intel reported that installation of its ASML High-NA EUV system at D1X in Hillsboro was complete and calibration had started, describing the 165-ton tool as the industry’s first commercial High-NA EUV system.',
    whyItMatters: 'This is a public example of a next-generation scanner entering a semiconductor R&D/fab environment, distinct from claiming volume-production use for a specific node.',
    claimIds: ['INTEL-HIGHNA-D1X-2024', 'HIGHNA-NA-001'],
    publicBoundary: 'OpenEUV does not infer Intel’s calibration procedures, overlay targets, recipes or tool-control configuration.',
    unknowns: ['Calibration algorithms', 'Internal qualification criteria', 'Production insertion details beyond public statements'],
  },
  {
    id: 'micron-1gamma-euv',
    kind: 'foundry',
    organization: 'Micron',
    year: '2025',
    title: '1-gamma brings EUV into Micron DRAM production',
    summary: 'Micron publicly describes its 1-gamma DRAM technology as using EUV lithography and as its first DRAM node to use EUV in production.',
    whyItMatters: 'This broadens the atlas beyond logic foundries and shows EUV adoption in advanced memory manufacturing using first-party evidence.',
    claimIds: ['MICRON-1GAMMA-EUV-2025'],
    publicBoundary: 'OpenEUV does not infer Micron’s layer count, exposure conditions, resist stack, process window or product-specific patterning flow.',
    unknowns: ['Private layer selection', 'Internal process-control targets', 'Fab-specific operating recipes and yield data'],
  },
  {
    id: 'skhynix-1anm-euv',
    kind: 'foundry',
    organization: 'SK hynix',
    year: '2021',
    title: '1anm DRAM enters EUV mass production',
    summary: 'SK hynix announced mass production of 1anm 8Gb LPDDR4 DRAM using EUV equipment in July 2021 after partial EUV adoption in its preceding 1ynm generation.',
    whyItMatters: 'The milestone provides another first-party memory-manufacturing case and separates a public production milestone from unknown private recipe details.',
    claimIds: ['SKHYNIX-1ANM-EUV-2021'],
    publicBoundary: 'The case records only the published production milestone and does not reconstruct scanner settings, mask strategy, process recipes or defect-control thresholds.',
    unknowns: ['Exact EUV layer usage', 'Internal scanner/process settings', 'Private yield and defect-management targets'],
  },
  {
    id: 'rapidus-iim1-euv',
    kind: 'research-fab',
    organization: 'Rapidus',
    year: '2024–2025',
    title: 'NXE:3800E installation and patterning milestones at IIM-1',
    summary: 'Rapidus states that an ASML TWINSCAN NXE:3800E was installed at IIM-1 in December 2024, installation was completed by April 1, 2025, and full-auto EUV pattern exposure and development followed.',
    whyItMatters: 'This gives OpenEUV a public example of scanner installation and fab-track integration without converting that milestone into an installation manual.',
    claimIds: ['RAPIDUS-IIM1-EUV-2025', 'EUV-WAVELENGTH-001'],
    publicBoundary: 'OpenEUV records the published equipment and milestone statements only; installation procedures, qualification parameters and process recipes remain outside the reconstruction.',
    unknowns: ['Private tool-installation procedure', 'Qualification and calibration criteria', 'Process conditions and production readiness metrics beyond public statements'],
  },
  {
    id: 'source-contamination-collector',
    kind: 'scanner-interface',
    organization: 'Public ASML / ZEISS disclosures',
    year: 'Published patents',
    title: 'Source-material contamination and collector protection are explicit engineering concerns',
    summary: 'Published disclosures discuss contamination from plasma target material around EUV collection optics and collector-mirror concepts associated with source operation.',
    whyItMatters: 'It connects the plasma-source story to optical lifetime and contamination-control concerns without pretending to know a current production service recipe.',
    claimIds: ['PATENT-SOURCE-CONTAMINATION-001', 'PATENT-COLLECTOR-MIRROR-001'],
    publicBoundary: 'Patent disclosures establish concepts and problems; OpenEUV does not treat them as an exact service manual or current production implementation.',
    unknowns: ['Current proprietary mitigation stack', 'Maintenance intervals', 'Production cleaning procedures and thresholds'],
  },
  {
    id: 'reticle-membrane-mask-lifecycle',
    kind: 'mask-lifecycle',
    organization: 'Public ASML + academic disclosures',
    year: 'Public research',
    title: 'Reflective masks, membranes and mask-stack modeling form a separate lifecycle problem',
    summary: 'Public patents describe an EUV membrane concept around the reticle environment, while academic work models the reflective multilayer/protective/absorber mask stack.',
    whyItMatters: 'Mask handling, protection, inspection and imaging are not interchangeable with scanner-source engineering; they deserve their own evidence trail.',
    claimIds: ['PATENT-EUV-MEMBRANE-001', 'ACADEMIC-EUV-MASK-MODEL-001', 'PATENT-RETICLE-STAGE-001'],
    publicBoundary: 'The case is conceptual and does not specify proprietary mask-cleaning chemistry, defect criteria or fab-specific lifecycle steps.',
    unknowns: ['Current production mask lifecycle by foundry', 'Private inspection thresholds', 'Cleaning chemistry and acceptance criteria'],
  },
]
