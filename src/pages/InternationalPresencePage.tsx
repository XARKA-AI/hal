import { useEffect, type ReactNode } from "react"
import { Link } from "react-router"
import { motion } from "framer-motion"
import {
  BadgeCheck,
  CreditCard,
  Factory,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useLanguage } from "../components/language-context"
import { PageSeo } from "../components/seo"
import { ROUTE_SEO } from "../config/site"
import { Footer } from "../sections/footer"
import { translatedLines } from "../lib/i18n-helpers"
import landGeoJsonRaw from "../data/ne_110m_land.geojson?raw"

const KSA = "#E87722"
const UAE = "#005CB9"
const NAVY = "#001F3F"

const leadershipCards = [
  {
    id: "sanjeev",
    photo: "/images/chairman-sanjeev-agarwal.webp",
    objectPosition: "center 18%",
  },
  {
    id: "anant",
    photo: "/images/vice-chairman-anant-agarwal.webp",
    objectPosition: "center 12%",
  },
  {
    id: "vineet",
    photo: "/images/ceo-vineet-agarwal.webp",
    objectPosition: "center 16%",
  },
  {
    id: "musalli",
    photo: "/images/musalli-almuammar.webp",
    objectPosition: "center center",
  },
] as const

const MAP_W = 1200
const MAP_H = 560
const LAT_MAX = 78
const LAT_MIN = -56
const LNG_MIN = -170
const LNG_MAX = 190
/** Inland of the Gulf coast so the marks sit on the peninsula, not in the water. */
const KSA_PIN = { lat: 24.0, lng: 45.1 }
const UAE_PIN = { lat: 23.7, lng: 54.2 }

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
}

type GeoRing = [number, number][]
type LandFeatureCollection = {
  features: Array<{
    geometry:
      | { type: "Polygon"; coordinates: GeoRing[] }
      | { type: "MultiPolygon"; coordinates: GeoRing[][] }
  }>
}

function projectMap(lng: number, lat: number) {
  return {
    x: ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * MAP_W,
    y: ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * MAP_H,
  }
}

function splitRingAtDateline(ring: GeoRing) {
  const closed =
    ring.length > 1 && ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1]
      ? ring.slice(0, -1)
      : ring
  const segments: GeoRing[] = []
  let current: GeoRing = []
  for (const coordinate of closed) {
    if (current.length === 0) {
      current.push(coordinate)
      continue
    }
    const previous = current[current.length - 1]
    if (Math.abs(coordinate[0] - previous[0]) > 180) {
      if (current.length > 1) segments.push(current)
      current = [coordinate]
      continue
    }
    current.push(coordinate)
  }
  if (current.length > 1) segments.push(current)
  return segments
}

const landPaths = (() => {
  const data = JSON.parse(landGeoJsonRaw) as LandFeatureCollection
  const paths: string[] = []
  for (const feature of data.features) {
    const polygons =
      feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates
    for (const polygon of polygons) {
      const outer = polygon[0]
      if (!outer || outer.length < 2) continue
      for (const segment of splitRingAtDateline(outer)) {
        const d = segment
          .map(([lng, lat], i) => {
            const p = projectMap(lng, lat)
            return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`
          })
          .join(" ")
        if (d) paths.push(`${d} Z`)
      }
    }
  }
  return paths
})()

function DottedWorldMap() {
  const ksa = projectMap(KSA_PIN.lng, KSA_PIN.lat)
  const uae = projectMap(UAE_PIN.lng, UAE_PIN.lat)

  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        <pattern id="presence-world-dots" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="2.2" cy="2.2" r="1.45" fill="#8A939E" />
        </pattern>
        <clipPath id="presence-world-clip">
          <rect width={MAP_W} height={MAP_H} />
        </clipPath>
      </defs>
      <g clipPath="url(#presence-world-clip)">
        {landPaths.map((d, i) => (
          <path key={i} d={d} fill="url(#presence-world-dots)" />
        ))}
        <MapPinGlyph x={ksa.x} y={ksa.y} color={KSA} />
        <MapPinGlyph x={uae.x} y={uae.y} color={UAE} />
      </g>
    </svg>
  )
}

function MapPinGlyph({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="16" fill={color} opacity="0.1" />
      <circle r="10" fill="none" stroke={color} strokeWidth="1.25" opacity="0.35" />
      <circle r="5.5" fill="none" stroke={color} strokeWidth="1.35" opacity="0.55" />
      <path
        d="M0 0c0 0 9.6-11.2 9.6-17.2A9.6 9.6 0 0 0-9.6-17.2C-9.6-11.2 0 0 0 0z"
        fill={color}
      />
      <circle cx="0" cy="-17.2" r="3.1" fill="white" />
    </g>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: LucideIcon
  label: string
  value: string
  accent: string
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${accent}18`, color: accent }}
      >
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
          {label}
        </p>
        <p className="mt-0.5 break-all text-sm font-semibold sm:text-[0.9375rem]" style={{ color: NAVY }}>
          {value}
        </p>
      </div>
    </div>
  )
}

function OfficeCard({
  accent,
  logoSrc,
  title,
  location,
  children,
}: {
  accent: string
  logoSrc: string
  title: string
  location: string
  children: ReactNode
}) {
  return (
    <article className="flex h-full min-h-full flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_10px_40px_-18px_rgba(0,31,63,0.18)]">
      <div className="h-[3px] w-full shrink-0" style={{ backgroundColor: accent }} />
      <div className="flex flex-1 flex-col p-6 sm:p-7 md:p-8">
        <div className="flex items-center gap-4">
          <img
            src={logoSrc}
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 object-contain"
            aria-hidden
          />
          <div>
            <h2 className="text-lg font-bold tracking-tight sm:text-xl" style={{ color: NAVY }}>
              {title}
            </h2>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-neutral-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} aria-hidden />
              {location}
            </p>
          </div>
        </div>
        {children}
      </div>
    </article>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mt-7 border-t border-neutral-200 pt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#001F3F]">
      {children}
    </p>
  )
}

function ContactLinks({
  accent,
  phone,
  phoneHref,
  email,
}: {
  accent: string
  phone: string
  phoneHref: string
  email: string
}) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      <a
        href={phoneHref}
        className="inline-flex items-center gap-2 font-semibold hover:underline"
        style={{ color: accent }}
        dir="ltr"
      >
        <Phone className="h-4 w-4 shrink-0" aria-hidden />
        {phone}
      </a>
      <span className="hidden text-neutral-300 sm:inline" aria-hidden>
        |
      </span>
      <a
        href={`mailto:${email}`}
        className="inline-flex items-center gap-2 break-all font-semibold hover:underline"
        style={{ color: accent }}
      >
        <Mail className="h-4 w-4 shrink-0" aria-hidden />
        {email}
      </a>
    </div>
  )
}

export function InternationalPresencePage() {
  const seo = ROUTE_SEO["/about/international-presence"]
  const { t, language, strings } = useLanguage()
  const dir = language === "ar" ? "rtl" : "ltr"
  const ksaAddress = translatedLines(t, strings, "presencePage.ksa.address")
  const uaeAddressRows = [
    { label: t("presencePage.uae.addr.companyLabel"), value: t("presencePage.uae.addr.companyValue") },
    { label: t("presencePage.uae.addr.officeLabel"), value: t("presencePage.uae.addr.officeValue") },
    { label: t("presencePage.uae.addr.buildingLabel"), value: t("presencePage.uae.addr.buildingValue") },
    { label: t("presencePage.uae.addr.streetLabel"), value: t("presencePage.uae.addr.streetValue") },
    { label: t("presencePage.uae.addr.poBoxLabel"), value: t("presencePage.uae.addr.poBoxValue") },
    { label: t("presencePage.uae.addr.emirateLabel"), value: t("presencePage.uae.addr.emirateValue") },
    { label: t("presencePage.uae.addr.countryLabel"), value: t("presencePage.uae.addr.countryValue") },
  ] as const

  useEffect(() => {
    document.title = `${t("presencePage.pageTitle")} | HAL Offshore`
    window.scrollTo(0, 0)
    return () => {
      document.title = "HAL Offshore"
    }
  }, [t])

  return (
    <div className="min-h-screen bg-white text-[#001F3F]" dir={dir}>
      <PageSeo title={seo.title} description={seo.description} path={seo.path} />
      <main className="relative overflow-hidden pt-20 sm:pt-24">
        <div
          className="pointer-events-none absolute inset-x-0 top-10 z-0 sm:top-6"
          aria-hidden
        >
          <div className="mx-auto max-w-6xl px-2 sm:px-4">
            <div className="ml-auto aspect-[1200/560] w-[min(100%,820px)] opacity-90 lg:w-[740px] xl:w-[820px]">
              <DottedWorldMap />
            </div>
          </div>
        </div>

        <section className="relative z-10 px-5 pb-6 pt-8 sm:px-6 sm:pt-10 md:pb-8">
          <div className="mx-auto max-w-6xl">
            <motion.div {...fadeUp} transition={{ duration: 0.45 }} className="max-w-xl">
              <p className="text-sm font-bold tracking-[0.04em]">
                <span style={{ color: KSA }}>HAL</span>{" "}
                <span className="text-[#001F3F]">{t("presencePage.group")}</span>
              </p>
              <nav
                className="mt-4 flex flex-wrap items-center gap-1.5 text-sm text-neutral-500"
                aria-label="Breadcrumb"
              >
                <Link to="/" className="hover:text-[#001F3F]">
                  {t("businesses.breadcrumb.home")}
                </Link>
                <span aria-hidden>/</span>
                <Link to="/about" className="hover:text-[#001F3F]">
                  {t("nav.about")}
                </Link>
                <span aria-hidden>/</span>
                <span className="font-medium text-[#001F3F]">{t("nav.about.internationalPresence")}</span>
              </nav>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#001F3F] sm:text-4xl md:text-5xl">
                {t("presencePage.headline")}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
                {t("presencePage.lead")}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="relative z-10 px-5 pb-12 sm:px-6 md:pb-16">
          <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-2 lg:gap-7">
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="flex h-full flex-col"
            >
              <OfficeCard
                accent={KSA}
                logoSrc="/logos/oil-rig.webp?v=2"
                title={t("presencePage.ksa.title")}
                location={t("presencePage.ksa.location")}
              >
                <SectionLabel>{t("presencePage.companyInfo")}</SectionLabel>
                <InfoRow
                  icon={FileText}
                  label={t("presencePage.ksa.crLabel")}
                  value={t("presencePage.ksa.crValue")}
                  accent={KSA}
                />
                <InfoRow
                  icon={BadgeCheck}
                  label={t("presencePage.ksa.natLabel")}
                  value={t("presencePage.ksa.natValue")}
                  accent={KSA}
                />
                <InfoRow
                  icon={Factory}
                  label={t("presencePage.ksa.anidLabel")}
                  value={t("presencePage.ksa.anidValue")}
                  accent={KSA}
                />
                <InfoRow
                  icon={UserRound}
                  label={t("presencePage.ksa.vendorLabel")}
                  value={t("presencePage.ksa.vendorValue")}
                  accent={KSA}
                />

                <SectionLabel>{t("presencePage.officeAddress")}</SectionLabel>
                <div className="mt-3 flex gap-3">
                  <MapPin className="mt-1 h-5 w-5 shrink-0" style={{ color: KSA }} aria-hidden />
                  <address className="not-italic text-sm leading-relaxed text-neutral-700">
                    {ksaAddress.map((line, i) => (
                      <span key={line} className={`block ${i === 0 ? "font-semibold text-[#001F3F]" : ""}`}>
                        {line}
                      </span>
                    ))}
                  </address>
                </div>

                <div className="mt-auto">
                <SectionLabel>{t("presencePage.contactPerson")}</SectionLabel>
                <p className="mt-3 flex items-start gap-3 text-sm font-semibold" style={{ color: NAVY }}>
                  <UserRound className="mt-0.5 h-4 w-4 shrink-0" style={{ color: KSA }} aria-hidden />
                  {t("presencePage.ksa.contactName")}
                </p>
                <ContactLinks
                  accent={KSA}
                  phone={t("presencePage.ksa.phone")}
                  phoneHref="tel:+966556524049"
                  email={t("presencePage.ksa.email")}
                />
                </div>
              </OfficeCard>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="flex h-full flex-col"
            >
              <OfficeCard
                accent={UAE}
                logoSrc="/logos/building.webp?v=2"
                title={t("presencePage.uae.title")}
                location={t("presencePage.uae.location")}
              >
                <SectionLabel>{t("presencePage.companyInfo")}</SectionLabel>
                <InfoRow
                  icon={FileText}
                  label={t("presencePage.uae.licenceLabel")}
                  value={t("presencePage.uae.licenceValue")}
                  accent={UAE}
                />
                <InfoRow
                  icon={BadgeCheck}
                  label={t("presencePage.uae.adcciLabel")}
                  value={t("presencePage.uae.adcciValue")}
                  accent={UAE}
                />
                <InfoRow
                  icon={CreditCard}
                  label={t("presencePage.uae.icpLabel")}
                  value={t("presencePage.uae.icpValue")}
                  accent={UAE}
                />

                <SectionLabel>{t("presencePage.officeAddress")}</SectionLabel>
                <div className="mt-3 flex gap-3">
                  <MapPin className="mt-1 h-5 w-5 shrink-0" style={{ color: UAE }} aria-hidden />
                  <address className="not-italic text-sm leading-relaxed text-neutral-700">
                    {uaeAddressRows.map((row) => (
                      <span key={row.label} className="block">
                        <span className="font-semibold text-[#001F3F]">{row.label}:</span> {row.value}
                      </span>
                    ))}
                  </address>
                </div>

                <div className="mt-auto">
                <SectionLabel>{t("presencePage.contactPerson")}</SectionLabel>
                <p className="mt-3 flex items-start gap-3 text-sm font-semibold" style={{ color: NAVY }}>
                  <UserRound className="mt-0.5 h-4 w-4 shrink-0" style={{ color: UAE }} aria-hidden />
                  {t("presencePage.uae.contactName")}
                </p>
                <ContactLinks
                  accent={UAE}
                  phone={t("presencePage.uae.phone")}
                  phoneHref="tel:+971566619162"
                  email={t("presencePage.uae.email")}
                />
                </div>
              </OfficeCard>
            </motion.div>
          </div>

          <div className="mx-auto mt-14 max-w-6xl px-4 py-12 sm:mt-16 sm:px-6 sm:py-14 md:mt-20 md:px-10 md:py-16">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#E87722] sm:text-sm">
              {t("aboutPage.leadership.kicker")}
            </p>
            <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-[#001F3F] sm:text-4xl">
              {t("aboutPage.leadership.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-neutral-500 sm:text-base">
              {t("aboutPage.leadership.lead")}
            </p>
            <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-8 md:mt-12 md:gap-10">
              {leadershipCards.map((person, i) => {
                const base = `aboutPage.leadership.${person.id}`
                const paras = translatedLines(t, strings, `${base}.p`)
                const role2 = `${base}.role2`
                return (
                  <motion.article
                    key={person.id}
                    {...fadeUp}
                    transition={{ duration: 0.45, delay: i * 0.04 }}
                    className="rounded-2xl border border-neutral-300 bg-white px-6 py-10 shadow-[0_12px_32px_-8px_rgba(0,31,63,0.28)] sm:px-10 sm:py-12 md:px-14"
                  >
                    <img
                      src={person.photo}
                      alt={t(`${base}.photoAlt`)}
                      width={128}
                      height={128}
                      className="mx-auto h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32"
                      style={{ objectPosition: person.objectPosition }}
                      decoding="async"
                    />
                    <h3 className="mt-6 text-center text-xl font-bold text-[#001F3F] sm:text-2xl">
                      {t(`${base}.name`)}
                    </h3>
                    <p className="mt-2 text-center text-sm font-medium leading-snug text-[#E87722] sm:text-[0.9375rem]">
                      {t(`${base}.role`)}
                      {role2 in strings ? (
                        <>
                          <br />
                          {t(role2)}
                        </>
                      ) : null}
                    </p>
                    <div className="mx-auto mt-5 h-px w-16 bg-[#E87722]/80" aria-hidden />
                    <div className="mt-6 space-y-4 text-sm leading-relaxed text-neutral-600 sm:text-[0.9375rem] sm:leading-[1.7]">
                      {paras.map((para) => (
                        <p key={para.slice(0, 28)} className="text-pretty">
                          {para}
                        </p>
                      ))}
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </div>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mx-auto mt-10 flex max-w-xl items-center justify-center gap-2.5 rounded-full bg-[#E8F1FB] px-5 py-3 text-center text-sm font-medium text-[#001F3F] sm:mt-12 sm:px-8 sm:text-[0.9375rem]"
          >
            <Globe className="h-4 w-4 shrink-0" style={{ color: UAE }} aria-hidden />
            <Link to="/contact" className="hover:underline">
              {t("presencePage.cta")}
            </Link>
          </motion.p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
