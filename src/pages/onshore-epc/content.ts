/** Onshore EPC page — reference projects (English copy). */

export interface OnshoreStat {
  label: string
  value: string
}

export interface OnshoreEpcGalleryImage {
  /** Relative to /public — e.g. "onshore-projects/asp-injection-viraj-1.webp". */
  src: string
  alt: string
}

export interface OnshoreEpcProject {
  id: string
  index: number
  title: string
  meta: string
  /** Optional: not every reference project has a documented scope yet. */
  scope?: string[]
  highlights?: string[]
  achievements?: string[]
  stats?: OnshoreStat[]
  cardBackground?: string
  /** Optional photo gallery rendered below the scope/highlights/achievements blocks. */
  gallery?: OnshoreEpcGalleryImage[]
}

export const onshoreCapabilities: string[] = [
  "LSTK & lump-sum turnkey delivery",
  "Surface production, treatment & disposal systems",
  "Gas and oil processing to statutory quality norms",
  "Water injection, disposal & utility integration",
  "Dismantling, hook-up, testing & commissioning",
  "End-to-end project management & HSE leadership",
]

/** Dialog copy for the onshore “Our offerings” grid (same order as `onshoreCapabilities`). */
export const onshoreCapabilityDetails: string[] = [
  "Full LSTK contracting with defined scope, schedule and commercial envelope—single accountability from engineering through commissioning.",
  "Greenfield and brownfield surface facilities covering separation, treatment, storage and export interfaces aligned to operator standards.",
  "Process design and equipment selection to meet statutory product specs, flaring limits and environmental norms.",
  "Integrated water injection, produced water handling, disposal and utility systems with control and safeguarding philosophy.",
  "Structured demolition, tie-ins, pre-commissioning and handover planning to minimise downtime and interface risk.",
  "Dedicated PMO, construction management and HSE systems with reporting aligned to client governance and audits.",
]

const ONSHORE_OFFERING_IMAGES = [
  "hal-4.webp",
  "hal-2.webp",
  "hal-3.webp",
  "about-platform.webp",
  "hal-1.webp",
  "hal-6.webp",
] as const

export interface OnshoreOfferingCard {
  title: string
  image: string
  detail: string
}

export const onshoreOfferingCards: OnshoreOfferingCard[] = onshoreCapabilities.map((title, i) => ({
  title,
  image: ONSHORE_OFFERING_IMAGES[i] ?? "hal-5.webp",
  detail: onshoreCapabilityDetails[i] ?? "",
}))

export const onshoreEpcProjects: OnshoreEpcProject[] = [
  {
    id: "nandasan-surface-mehsana",
    index: 1,
    title: "Nandasan surface facilities",
    meta: "Mehsana asset · Oil, gas, effluent, water injection & disposal",
    cardBackground: "waterclean.webp",
    scope: [
      "Engineering, procurement, dismantling of identified old facilities, installation, hook-up, testing and commissioning of complete surface production, treatment and disposal facilities at Nandasan.",
      "Scope covered oil and gas production, effluent treatment, water injection and water disposal systems, executed on an LSTK basis with end-to-end project management and delivery.",
    ],
    highlights: [
      "Comprehensive facilities for gas, oil, effluent, water injection and disposal.",
      "Gas production: 2,98,000 SCMD (sales gas, PNGRB quality) and 1,80,000 SCMD (lift gas).",
      "Oil production: 806 m³/day; effluent treatment: 3,200 m³/day meeting PCB norms.",
      "Water injection: 2,100 m³/day and water disposal: 1,100 m³/day.",
    ],
    achievements: [
      "Successful commissioning of all surface facilities on an LSTK basis.",
      "Enhanced production and environmental compliance (as per PNGRB & PCB).",
      "Integrated multi-stream production with stable throughput.",
      "Zero LTI with strict adherence to HSE standards.",
    ],
    stats: [
      { label: "Sales gas", value: "2,98,000 SCMD" },
      { label: "Lift gas", value: "1,80,000 SCMD" },
      { label: "Oil", value: "806 m³/day" },
      { label: "Effluent treatment", value: "3,200 m³/day" },
      { label: "Water injection", value: "2,100 m³/day" },
      { label: "Water disposal", value: "1,100 m³/day" },
    ],
  },
  {
    id: "santhal-air-compressors-ongc",
    index: 2,
    title: "Replacement of well injection air compressors",
    meta: "ONGC · Santhal field",
    cardBackground: "hal-3.webp",
    scope: [
      "Replacement of existing air compressor facilities at Santhal by installing a new high-pressure air compressor plant to ensure continuous availability of HP compressed air for injector wells across the field.",
      "The system comprises five LP centrifugal plus five HP reciprocating compressor trains, delivering air from 0 bar(g) to 128 bar(g), executed within a new dedicated plot area.",
    ],
    highlights: [
      "Total plant capacity: 16 LSCMD (4 LSCMD × 4 working + 1 standby).",
      "Compressor configuration: LP centrifugal + HP reciprocating trains.",
      "RO water–based cooling system for inter-stage coolers.",
      "Continuous HP air supply for multiple injector wells across the field.",
    ],
    achievements: [
      "Enhanced reliability and continuous HP air availability across the asset.",
      "Upgraded compression system with improved cooling and operational performance.",
      "Increased uptime supporting seamless field injection requirements.",
    ],
    stats: [
      { label: "Plant capacity", value: "16 LSCMD" },
      { label: "Discharge pressure", value: "128 bar(g)" },
      { label: "LP trains", value: "5 × centrifugal" },
      { label: "HP trains", value: "5 × reciprocating" },
    ],
  },
  {
    id: "asp-injection-viraj-ahmedabad",
    index: 3,
    title: "Field-wide ASP Injection Scheme — Viraj",
    meta: "Ahmedabad asset · Alkaline Surfactant Polymer (ASP) flood",
    stats: [
      { label: "Site", value: "Ahmedabad" },
      { label: "Completion", value: "06 July 2019" },
      { label: "Schedule", value: "14 months from NOA" },
    ],
    gallery: [
      {
        src: "onshore-projects/asp-injection-viraj-1.webp",
        alt: "Field-wide ASP Injection Scheme facility at Viraj, Ahmedabad",
      },
      {
        src: "onshore-projects/asp-injection-viraj-2.webp",
        alt: "ASP Injection Scheme — process equipment at Viraj, Ahmedabad",
      },
    ],
  },
  {
    id: "mehsana-air-compressors-replacement",
    index: 4,
    title: "Replacement of Air Compressors — Mehsana Asset",
    meta: "ONGC · Mehsana",
    stats: [
      { label: "Site", value: "Mehsana" },
      { label: "Status", value: "Under commissioning" },
    ],
    gallery: [
      {
        src: "onshore-projects/mehsana-air-compressors-1.webp",
        alt: "Air compressor replacement project at Mehsana Asset",
      },
      {
        src: "onshore-projects/mehsana-air-compressors-2.webp",
        alt: "Air compressor plant overview, Mehsana Asset",
      },
    ],
  },
  {
    id: "linch-redevelopment-mehsana",
    index: 5,
    title: "Linch Redevelopment Project with 7-year O&M",
    meta: "ONGC · Mehsana asset · EPC + Operations & Maintenance",
    stats: [
      { label: "Site", value: "Mehsana" },
      { label: "O&M term", value: "7 years" },
      { label: "Status", value: "Under commissioning" },
    ],
    gallery: [
      {
        src: "onshore-projects/linch-redevelopment-1.webp",
        alt: "Linch redevelopment project facility at Mehsana Asset",
      },
    ],
  },
  {
    id: "rvmp-north-santhal",
    index: 6,
    title: "RVMP — North Santhal",
    meta: "ONGC · North Santhal field",
    stats: [
      { label: "Site", value: "North Santhal" },
      { label: "Completion", value: "17 Nov 2020" },
    ],
    gallery: [
      {
        src: "onshore-projects/rvmp-north-santhal-1.webp",
        alt: "RVMP project at North Santhal field",
      },
    ],
  },
  {
    id: "rvmp-south-santhal",
    index: 7,
    title: "RVMP — South Santhal",
    meta: "ONGC · South Santhal field",
    stats: [
      { label: "Site", value: "South Santhal" },
      { label: "Completion", value: "17 Nov 2020" },
    ],
    gallery: [
      {
        src: "onshore-projects/rvmp-south-santhal-1.webp",
        alt: "RVMP project at South Santhal field",
      },
    ],
  },
]
