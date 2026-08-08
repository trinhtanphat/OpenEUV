export const assetNodeEvidence: Record<string, string[]> = {
  SourceFrame: ['EUV-WAVELENGTH-001', 'PATENT-SOURCE-CONTAMINATION-001'],
  CollectorConcept: ['PATENT-SOURCE-CONTAMINATION-001', 'PATENT-DROPLET-ACCELERATOR-001'],
  DropletGenerator: ['PATENT-DROPLET-ACCELERATOR-001'],
  PlasmaMarker: ['EUV-WAVELENGTH-001', 'PATENT-SOURCE-CONTAMINATION-001'],
  LaserInput: ['EUV-WAVELENGTH-001'],
  IntermediateFocus: ['EUV-WAVELENGTH-001'],
  ContaminationShield: ['PATENT-SOURCE-CONTAMINATION-001'],
  ReticleFrame: ['PATENT-RETICLE-STAGE-001', 'ACADEMIC-EUV-MASK-MODEL-001'],
  ReflectiveMask: ['PATENT-RETICLE-STAGE-001', 'ACADEMIC-EUV-MASK-MODEL-001'],
  'ShieldingConcept-L': ['PATENT-RETICLE-STAGE-001'],
  'ShieldingConcept-R': ['PATENT-RETICLE-STAGE-001'],
  'StageGuide-A': ['PATENT-RETICLE-STAGE-001'],
  'StageGuide-B': ['PATENT-RETICLE-STAGE-001'],
  OpticalBench: ['HIGHNA-NA-001', 'HIGHNA-PARTS-001', 'PATENT-REFLECTIVE-MEMBER-001'],
  'MirrorConcept-1': ['HIGHNA-NA-001', 'HIGHNA-PARTS-001', 'ACADEMIC-MOSI-MULTILAYER-001'],
  'MirrorConcept-2': ['HIGHNA-NA-001', 'HIGHNA-PARTS-001', 'ACADEMIC-MOSI-MULTILAYER-001'],
  'MirrorConcept-3': ['HIGHNA-NA-001', 'HIGHNA-PARTS-001', 'ACADEMIC-MOSI-MULTILAYER-001'],
  'MirrorConcept-4': ['HIGHNA-NA-001', 'HIGHNA-PARTS-001', 'ACADEMIC-MOSI-MULTILAYER-001'],
  MetrologyFrame: ['HIGHNA-PARTS-001'],
}

export const assetNodeGeometryStatus: Record<string, 'documented-function' | 'inferred-link' | 'illustrative-geometry'> = Object.fromEntries(
  Object.keys(assetNodeEvidence).map((name) => [name, 'illustrative-geometry']),
)
