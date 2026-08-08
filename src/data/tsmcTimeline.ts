export type FabMilestone = {
  year: number
  title: string
  detail: string
  sourceLabel: string
  sourceUrl: string
  evidenceClass: 'A'
}

export const tsmcTimeline: FabMilestone[] = [
  {
    year: 2019,
    title: 'N7+ enters volume production',
    detail: 'TSMC announced N7+ customer products in high volume and describes N7+ as its first EUV process to enter volume production.',
    sourceLabel: 'TSMC N7+ technology',
    sourceUrl: 'https://www.tsmc.com/english/campaign/N7plus',
    evidenceClass: 'A',
  },
  {
    year: 2020,
    title: 'N6 enters volume production',
    detail: 'TSMC states N6 uses additional EUV layers to simplify process flow and has been in volume production since 2020.',
    sourceLabel: 'TSMC advanced technology overview',
    sourceUrl: 'https://www.tsmc.com/english/dedicatedFoundry/technology/platform_smartphone_tech_advancedTech',
    evidenceClass: 'A',
  },
  {
    year: 2021,
    title: 'N7 / N7+ expand into more product categories',
    detail: 'TSMC reports N7 and N7+ expanding into consumer and automotive electronics manufacturing beginning in 2021.',
    sourceLabel: 'TSMC 7nm technology overview',
    sourceUrl: 'https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_7nm',
    evidenceClass: 'A',
  },
  {
    year: 2024,
    title: 'N6e qualified for production',
    detail: 'TSMC reports its N6e ultra-low-power technology was qualified for production in 2024, extending the N6 family built on the N7/N7+ lineage.',
    sourceLabel: 'TSMC 7nm technology overview',
    sourceUrl: 'https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_7nm',
    evidenceClass: 'A',
  },
]
