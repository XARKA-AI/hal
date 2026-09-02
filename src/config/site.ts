/** Public site URL — override with VITE_SITE_URL in production if needed. */
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") ??
  "https://haloffshore.com"

export const SITE_NAME = "HAL Offshore Limited"
export const SITE_TAGLINE =
  "India's trusted oil and gas offshore services provider — fleet management, marine logistics, and energy solutions."
export const SITE_LOCALE = "en_IN"

export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/hero-1-mobile.webp`

export type SeoMeta = {
  title: string
  description: string
  path: string
  noindex?: boolean
}

/** Per-route SEO defaults (Helmet overrides on each page if needed). */
export const ROUTE_SEO: Record<string, SeoMeta> = {
  "/": {
    title: `${SITE_NAME} | Offshore & Onshore Oil & Gas Services`,
    description: SITE_TAGLINE,
    path: "/",
  },
  "/about": {
    title: `About Us | ${SITE_NAME}`,
    description:
      "Learn about HAL Offshore — our leadership, journey, HSE commitment, and decades of excellence in India's oil and gas sector.",
    path: "/about",
  },
  "/about/international-presence": {
    title: `International Presence | ${SITE_NAME}`,
    description:
      "HAL Group international offices — HAL Energy LLC in Al Khobar, Saudi Arabia, and HAL Contracting LLC in Abu Dhabi, UAE. Mumbai remains the registered headquarters of HAL Offshore Limited.",
    path: "/about/international-presence",
  },
  "/businesses": {
    title: `Businesses | ${SITE_NAME}`,
    description:
      "Explore HAL Offshore businesses: offshore EPC, onshore EPC, upstream oil & gas, BOO/OM, green energy, and flagship projects.",
    path: "/businesses",
  },
  "/businesses/offshore-epc": {
    title: `Offshore EPC | ${SITE_NAME}`,
    description:
      "Offshore engineering, procurement, and construction services for India's oil and gas industry.",
    path: "/businesses/offshore-epc",
  },
  "/businesses/onshore-epc": {
    title: `Onshore EPC | ${SITE_NAME}`,
    description:
      "Onshore EPC capabilities — pipelines, compressors, facilities, and integrated project delivery.",
    path: "/businesses/onshore-epc",
  },
  "/businesses/offshore-epc/projects": {
    title: `Offshore EPC Projects | ${SITE_NAME}`,
    description:
      "Reference offshore EPC projects delivered by HAL Offshore for Indian oil and gas operators.",
    path: "/businesses/offshore-epc/projects",
  },
  "/businesses/onshore-epc/projects": {
    title: `Onshore EPC Projects | ${SITE_NAME}`,
    description:
      "Onshore EPC projects — surface facilities, field infrastructure, replacements and LSTK commissioning.",
    path: "/businesses/onshore-epc/projects",
  },
  "/businesses/upstream-oil-gas": {
    title: `Upstream Oil & Gas | ${SITE_NAME}`,
    description: "Upstream oil and gas services and solutions from HAL Offshore.",
    path: "/businesses/upstream-oil-gas",
  },
  "/businesses/boo-om": {
    title: `BOO / O&M | ${SITE_NAME}`,
    description: "Build-own-operate and operations & maintenance services.",
    path: "/businesses/boo-om",
  },
  "/businesses/green-energy": {
    title: `Green Energy | ${SITE_NAME}`,
    description: "Green and renewable energy initiatives from HAL Offshore.",
    path: "/businesses/green-energy",
  },
  "/businesses/flagship-projects": {
    title: `Flagship Projects | ${SITE_NAME}`,
    description: "Flagship offshore and onshore projects delivered by HAL Offshore.",
    path: "/businesses/flagship-projects",
  },
  "/businesses/flagship-projects/nandasan": {
    title: `Nandasan Project | ${SITE_NAME}`,
    description: "Nandasan flagship project gallery and case study.",
    path: "/businesses/flagship-projects/nandasan",
  },
  "/businesses/flagship-projects/bcpb-2": {
    title: `BCPB-2 Compressor Retrofit | ${SITE_NAME}`,
    description:
      "Enhanced recovery of Bassein field through retrofitting of existing compressors at BCPB-2 platform.",
    path: "/businesses/flagship-projects/bcpb-2",
  },
  "/businesses/flagship-projects/mol-pumps": {
    title: `MOL Pumps — BHS Platform | ${SITE_NAME}`,
    description: "Replacement of MOL pumps at BHS platform — flagship project gallery and case study.",
    path: "/businesses/flagship-projects/mol-pumps",
  },
  "/businesses/flagship-projects/solar-turbine": {
    title: `Solar Turbine Control | ${SITE_NAME}`,
    description:
      "Replacement of Solar turbine control systems for 6 PGCs at BCPA and BCPB platforms on LSTK basis.",
    path: "/businesses/flagship-projects/solar-turbine",
  },
  "/businesses/flagship-projects/cluster-c": {
    title: `Cluster C | ${SITE_NAME}`,
    description: "Cluster C onshore EPC delivery — flagship project gallery and case study.",
    path: "/businesses/flagship-projects/cluster-c",
  },
  "/businesses/flagship-projects/dcu-numaligarh": {
    title: `DCU Revamp — Numaligarh Refinery | ${SITE_NAME}`,
    description:
      "Coke Drum Structure Package for the DCU revamp at the Numaligarh Refinery Expansion Project — EPC, testing and commissioning gallery and case study.",
    path: "/businesses/flagship-projects/dcu-numaligarh",
  },
  "/careers": {
    title: `Careers | ${SITE_NAME}`,
    description: "Join HAL Offshore — submit your résumé and a short note for future openings.",
    path: "/careers",
  },
  "/contact": {
    title: `Contact | ${SITE_NAME}`,
    description: "Contact HAL Offshore for enquiries about offshore services, EPC, and partnerships.",
    path: "/contact",
  },
}

export function resolveSeoMeta(pathname: string): SeoMeta {
  const normalizedPathname =
    pathname === "/index.html" ? "/" : pathname.replace(/\/index\.html$/, "")

  if (ROUTE_SEO[normalizedPathname]) return ROUTE_SEO[normalizedPathname]

  const match = Object.keys(ROUTE_SEO)
    .filter((p) => p !== "/")
    .sort((a, b) => b.length - a.length)
    .find((p) => normalizedPathname.startsWith(p))

  if (match) return ROUTE_SEO[match]

  return {
    title: SITE_NAME,
    description: SITE_TAGLINE,
    path: normalizedPathname,
    noindex: normalizedPathname.startsWith("/haloffshore"),
  }
}

export const PUBLIC_ROUTES = Object.values(ROUTE_SEO).map((m) => m.path)
