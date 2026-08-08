const steps = [
  ['01', 'Prepare', 'Wafer enters the lithography module after upstream preparation.'],
  ['02', 'Coat', 'A photosensitive imaging layer is applied. OpenEUV intentionally omits chemistry and recipe details.'],
  ['03', 'Condition', 'The imaging stack is conditioned for the exposure step.'],
  ['04', 'Align & measure', 'Alignment and wafer-surface measurements establish the exposure coordinate context.'],
  ['05', 'EUV expose', 'The scanner projects the reticle pattern onto the wafer using reflective EUV optics.'],
  ['06', 'Post-exposure condition', 'The exposed imaging layer proceeds through the process module without recipe parameters here.'],
  ['07', 'Develop', 'The latent image becomes a patterned resist image.'],
  ['08', 'Inspect', 'Pattern quality is measured before downstream pattern transfer and subsequent layers.'],
]

export function FabFlow() {
  return (
    <section className="research-section fab-flow" id="fab-flow">
      <div className="research-heading"><div><span className="eyebrow">Process context</span><h2>Where the EUV scanner fits</h2><p>A conceptual lithography flow that gives the scanner context without publishing chemical recipes, tool settings or proprietary foundry process details.</p></div><span className="evidence-pill academic">Conceptual overview</span></div>
      <div className="fab-flow-grid">{steps.map(([number, title, detail]) => <article key={number} className={title === 'EUV expose' ? 'scanner-step' : ''}><span>{number}</span><h3>{title}</h3><p>{detail}</p></article>)}</div>
    </section>
  )
}
