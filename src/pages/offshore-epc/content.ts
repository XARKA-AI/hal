/** Offshore EPC page copy (English) — project case studies. */
export const offshoreEpcOfferings: string[] = [
  "3Ph & 2Ph Separators",
  "Gas Compressor Retrofits",
  "Gas Turbines – Retrofits",
  "Crude Transfer Systems",
  "Deaeration and Water Injection System",
  "Gas Dehydration Systems",
  "Condensate Handling Systems",
  "Produced Water Treatment Systems",
]

/** One-line scope copy for the offering detail dialog (matches `offshoreEpcOfferings` order). */
export const offshoreEpcOfferingDetails: string[] = [
  "Separation packages engineered for offshore duty — from concept and process design through fabrication interfaces, installation support, and commissioning.",
  "Compressor upgrades and retrofits integrated with existing platform utilities, controls, and safety systems, executed with minimal production impact.",
  "Gas turbine control and package modernisation, including fuel, instrumentation, and protection systems aligned to current OEM and operator standards.",
  "Crude and product transfer systems — pumps, piping, metering, and custody interfaces — designed for reliable marine and platform operations.",
  "Deaeration, water injection, and related utility packages scoped for offshore space, weight, and operability constraints.",
  "Dehydration and conditioning systems to stabilise gas quality for compression, export, or flare minimisation offshore.",
  "Condensate handling, storage, and offloading interfaces coordinated with production separators and export headers.",
  "Produced water treatment trains sized for regulatory discharge or reinjection, with instrumentation suitable for unmanned or minimum-manning platforms.",
]

const OFFERING_CARD_IMAGES = [
  "hal-3.webp",
  "hal-2.webp",
  "hal-1.webp",
  "fleet-aerial.webp",
  "hal-4.webp",
  "hal-5.webp",
  "hal-6.webp",
  "about-platform.webp",
] as const

export interface OffshoreEpcOfferingCard {
  title: string
  /** Path segment under `public/images/`. */
  image: string
  detail: string
}

/** L&T-style grid cards: title, photo, and dialog body (English; titles match `offshoreEpcOfferings`). */
export const offshoreEpcOfferingCards: OffshoreEpcOfferingCard[] = offshoreEpcOfferings.map(
  (title, i) => ({
    title,
    image: OFFERING_CARD_IMAGES[i] ?? "main.webp",
    detail: offshoreEpcOfferingDetails[i] ?? "",
  })
)

export const offshoreEpcSubcategories: string[] = [
  "Engineering & Design",
  "Process Systems",
  "Mechanical Equipment",
  "Electrical Systems",
  "Instrumentation & Controls",
  "Safety Systems",
  "Flare System",
  "Piping Networks",
  "Utility Systems",
]

export interface OffshoreEpcProject {
  id: string
  index: number
  title: string
  scope: string[]
  highlights: string[]
  achievements: string[]
  /** Optional hero image inside the case-study card (filename under `public/images/`). */
  cardBackground?: string
}

export const offshoreEpcProjects: OffshoreEpcProject[] = [
  {
    id: "solar-turbine-ongc",
    index: 1,
    title: "Solar turbine control system, ONGC",
    cardBackground: "solar_dac.webp",
    scope: [
      "Replacement of obsolete control, instrumentation and package systems for six Solar turbine-driven Booster Gas Compressors at ONGC offshore platform with latest Turbotronic-5 control system.",
      "Survey, engineering, dismantle, new installation and commissioning.",
    ],
    highlights: [
      "Upgradation from obsolete controls to Turbotronic-5 & 6 across offshore platforms.",
      "Complete replacement of control, instrumentation, F&G and fuel systems.",
      "Work executed in live operating conditions with minimal shutdown.",
      "Integration with existing Booster Gas Compressor package systems.",
    ],
    achievements: [
      "Successful commissioning with minimum production downtime.",
      "Improved turbine reliability and safety through latest control system.",
      "Shutdown completed within planned schedule.",
      "Zero LTI (loss time incident).",
    ],
  },
  {
    id: "gas-compressors-bcpb",
    index: 2,
    title: "Retrofitting of gas compressors, BCPB-2 platform",
    scope: [
      "Retrofitting of the existing gas compression system at BCPB-2 platform to operate at a lower suction pressure of 10 kg/cm² instead of 25 kg/cm², enabling handling of low-pressure gas, improving evacuation capability, and enhancing the ultimate recovery and field life of the Bassein reservoir.",
    ],
    highlights: [
      "Retrofitting of four process gas compressors (PGC – A, B, C, D) with replacement of air coolers, condensate pumps and related piping.",
      "Enhanced production by reducing inlet pressure of separators.",
    ],
    achievements: [
      "Commissioned ahead of schedule.",
      "All four PGCs retrofitted with minimal shutdown and taken into operation.",
      "Zero accident / no near-miss – completed with highest HSE standards.",
    ],
  },
  {
    id: "mol-pumps-bhs",
    index: 3,
    title: "Replacement of 02 MOL pumps – BHS platform, ONGC",
    scope: [
      "The project involved replacement of two Main Oil Line (MOL) pumps—P-350 and P-360—out of the existing three-pump system at BHS platform, with new 350 m³/hr capacity pumps, while retaining the third pump (P-370) of 700 m³/hr. The objective was to improve operational reliability and maintain steady crude evacuation through the MOL network.",
    ],
    highlights: [
      "Supply, installation and commissioning of two MOL pump packages.",
      "Integration with existing DCS/PLC, MOVs, control valves and flow measurement systems.",
      "Complete piping, valves, strainers, utilities, lubrication system and instrumentation.",
      "LCP, vibration & temperature sensing systems, probes and control logic integration.",
      "Deck strengthening and associated structural works.",
    ],
    achievements: [
      "Both pumps commissioned ahead of schedule and put into service.",
      "Zero accident / no near-miss – completed with highest HSE standards.",
    ],
  },
]
