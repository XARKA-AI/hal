import { useId, useMemo } from "react"
import { Link } from "react-router"
import { ArrowRight, Building2, Globe, MapPin } from "lucide-react"
import { useLanguage } from "../components/language-context"
import landGeoJsonRaw from "../data/ne_110m_land.geojson?raw"

const MAP_W = 1000
const MAP_H = 480

type GeoRing = [number, number][]
type LandFeatureCollection = {
  features: Array<{
    geometry:
      | { type: "Polygon"; coordinates: GeoRing[] }
      | { type: "MultiPolygon"; coordinates: GeoRing[][] }
  }>
}

function project(lng: number, lat: number): [number, number] {
  return [((lng + 180) / 360) * MAP_W, ((90 - lat) / 180) * MAP_H]
}

function ringToPath(ring: GeoRing): string {
  if (!ring.length) return ""
  const parts = ring.map(([lng, lat], i) => {
    const [x, y] = project(lng, lat)
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`
  })
  return `${parts.join(" ")} Z`
}

function landPaths(): string[] {
  const data = JSON.parse(landGeoJsonRaw) as LandFeatureCollection
  const out: string[] = []
  for (const feature of data.features) {
    const g = feature.geometry
    if (g.type === "Polygon") {
      out.push(g.coordinates.map(ringToPath).join(" "))
    } else {
      for (const poly of g.coordinates) {
        out.push(poly.map(ringToPath).join(" "))
      }
    }
  }
  return out
}

function DottedWorldMap({ patternId }: { patternId: string }) {
  const paths = useMemo(landPaths, [])

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <pattern
          id={patternId}
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.2" cy="1.2" r="1.05" fill="#9aa8b8" />
        </pattern>
      </defs>
      {paths.map((d, i) => (
        <path key={i} d={d} fill={`url(#${patternId})`} />
      ))}
    </svg>
  )
}

/** Font Awesome 6 “oil-well” (free solid) glyph. */
function IconOilWell() {
  return (
    <svg viewBox="0 0 576 512" className="h-8 w-8" fill="currentColor" aria-hidden>
      <path d="M256 32c0-17.7 14.3-32 32-32s32 14.3 32 32V37.1c38.9 4.5 74.1 21.4 101.7 46.7L448 64c17.7 0 32 14.3 32 32s-14.3 32-32 32h-12.8l-46.5 46.5c12.5 22.6 19.3 48.5 19.3 76.3v21.2L512 272c17.7 0 32 14.3 32 32s-14.3 32-32 32H64c-17.7 0-32-14.3-32-32s14.3-32 32-32h106.1V250.8c0-27.8 6.8-53.7 19.3-76.3L142.8 128H128c-17.7 0-32-14.3-32-32s14.3-32 32-32h26.3C149.9 58.5 185.1 41.6 224 37.1V32zM240 256h96V250.8c0-26.5-21.5-48-48-48s-48 21.5-48 48V256zM96 352h64v128H96V352zm320 0h64v128H416V352zM96 512h384c17.7 0 32-14.3 32-32s-14.3-32-32-32H96c-17.7 0-32 14.3-32 32s14.3 32 32 32z" />
    </svg>
  )
}

export function GroupCompaniesSection() {
  const { t } = useLanguage()
  const uid = useId().replace(/:/g, "")
  const patternId = `group-map-dots-${uid}`

  const cards = [
    {
      nameKey: "aboutPage.subsidiaries.ksa.name" as const,
      placeKey: "aboutPage.subsidiaries.ksa.place" as const,
      icon: <IconOilWell />,
    },
    {
      nameKey: "aboutPage.subsidiaries.uae.name" as const,
      placeKey: "aboutPage.subsidiaries.uae.place" as const,
      icon: <Building2 size={28} strokeWidth={1.75} aria-hidden />,
    },
  ]

  return (
    <section
      id="subsidiaries"
      className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 scroll-mt-40 overflow-hidden bg-white py-20 md:py-24 lg:py-28"
    >
      <div className="absolute inset-0 opacity-70">
        <DottedWorldMap patternId={patternId} />
      </div>
      <div className="absolute inset-0 bg-white/55" aria-hidden />

      <div className="relative mx-auto max-w-5xl px-6 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#E87722] sm:w-12" aria-hidden />
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500 sm:text-xs">
              {t("aboutPage.subsidiaries.kicker")}
            </p>
            <span className="h-px w-10 bg-[#E87722] sm:w-12" aria-hidden />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#001F3F] sm:text-4xl md:text-[2.75rem] md:leading-tight">
            {t("aboutPage.subsidiaries.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-neutral-500 sm:mt-5 sm:text-base md:text-lg">
            {t("aboutPage.subsidiaries.lead")}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-[820px] gap-6 sm:mt-14 md:grid-cols-2 md:gap-8">
          {cards.map(({ nameKey, placeKey, icon }) => (
            <article
              key={nameKey}
              className="rounded-2xl bg-white px-8 py-10 text-center shadow-[0_18px_50px_rgba(15,40,70,0.1)]"
            >
              <div className="mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-[#D9ECF7] text-[#001F3F]">
                {icon}
              </div>
              <h3 className="mt-6 text-lg font-bold text-[#001F3F] md:text-xl">
                {t(nameKey)}
              </h3>
              <div className="relative mx-auto mt-4 h-px w-full max-w-[220px] bg-neutral-200" aria-hidden>
                <span className="absolute left-1/2 top-1/2 h-[2px] w-10 -translate-x-1/2 -translate-y-1/2 bg-[#E87722]" />
              </div>
              <p className="mt-4 flex items-center justify-center gap-2 text-[15px] text-neutral-500">
                <MapPin className="h-4 w-4 shrink-0 text-[#1B4F8A]" aria-hidden />
                <span>{t(placeKey)}</span>
              </p>
            </article>
          ))}
        </div>

        <p className="mt-12 text-center">
          <Link
            to={{ pathname: "/contact", hash: "#subsidiaries" }}
            className="relative inline-flex items-center gap-1.5 pb-1.5 text-[15px] font-semibold text-[#1B4F8A]"
          >
            {t("aboutPage.subsidiaries.cta")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            <span
              className="absolute bottom-0 left-1/2 h-[3px] w-14 -translate-x-1/2 rounded-full bg-[#E87722]"
              aria-hidden
            />
          </Link>
        </p>

        <div className="mt-14 overflow-hidden rounded-2xl bg-[#E8F0F6] md:mt-16 md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(220px,0.85fr)]">
          <div className="flex items-center gap-5 px-6 py-7 sm:gap-6 sm:px-8 sm:py-8">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[#1B4F8A] shadow-sm sm:h-16 sm:w-16">
              <Globe className="h-7 w-7" strokeWidth={1.7} aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1B4F8A]">
                {t("aboutPage.globalReach.kicker")}
              </p>
              <h3 className="mt-1.5 text-xl font-bold leading-snug text-[#001F3F] sm:text-2xl">
                {t("aboutPage.globalReach.title")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500 sm:text-[15px]">
                {t("aboutPage.globalReach.body")}
              </p>
            </div>
          </div>
          <div className="relative min-h-[160px] md:min-h-0">
            <img
              src="/images/hero-2.webp"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
