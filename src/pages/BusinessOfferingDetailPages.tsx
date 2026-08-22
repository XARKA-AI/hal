import { useEffect, useMemo } from "react"
import { Link } from "react-router"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import {
  Anchor,
  Award,
  ClipboardList,
  Droplets,
  Factory,
  Flame,
  Gauge,
  MapPin,
  Recycle,
  Ship,
  Images,
  Sparkles,
  Zap,
} from "lucide-react"
import { useLanguage } from "../components/language-context"
import {
  STANDARD_PAGE_HERO_SECTION_CLASS,
  StandardPageHeroInset,
} from "../components/standard-page-hero-inset"
import { Footer } from "../sections/footer"
import { NANDASAN_GALLERY_ROUTE } from "./flagship/nandasan-content"
import {
  BCPB2_CARD_SIZES,
  BCPB2_GALLERY_ROUTE,
  bcpb2ImageSrcSet,
} from "./flagship/bcpb2-content"
import {
  MOL_PUMPS_CARD_SIZES,
  MOL_PUMPS_GALLERY_ROUTE,
  molPumpsImageSrcSet,
} from "./flagship/mol-pumps-content"
import {
  SOLAR_TURBINE_CARD_SIZES,
  SOLAR_TURBINE_GALLERY_ROUTE,
  solarTurbineImageSrcSet,
} from "./flagship/solar-turbine-content"
import { CLUSTER_C_GALLERY_ROUTE } from "./flagship/cluster-c-content"
import {
  DCU_CARD_SIZES,
  DCU_NUMALIGARH_GALLERY_ROUTE,
  dcuImageSrcSet,
} from "./flagship/dcu-numaligarh-content"

export type BusinessOfferingVariant = "greenEnergy" | "flagship" | "upstreamOilGas"

function publicImagePath(file: string): string {
  const base = import.meta.env.BASE_URL
  const path = file.replace(/^\//, "")
  if (base === "./" || base === ".") return `/${path}`
  return base.endsWith("/") ? `${base}${path}` : `${base}/${path}`
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
}

interface VariantGalleryImage {
  /** Path relative to /public (e.g. "images/flagship-projects/foo.webp"). */
  src: string
  altKey: string
  captionKey?: string
  /** Navigates to a dedicated gallery page when the card is clicked. */
  galleryHref?: string
  /**
   * Set together when the photo has pre-generated width variants, so the card
   * downloads a phone-sized file instead of the full-width one. Photos without
   * variants simply omit both and fall back to `src`.
   */
  srcSet?: string
  sizes?: string
}

interface VariantImageHighlight {
  src: string
  altKey: string
  titleKey: string
  bodyKey: string
}

const CONFIG: Record<
  BusinessOfferingVariant,
  {
    ns: string
    hero: string
    highlightIcons: readonly LucideIcon[]
    /** When false, the capabilities / highlights band is omitted. */
    showHighlights?: boolean
    gallery?: readonly VariantGalleryImage[]
    galleryHeadingKey?: string
    galleryKickerKey?: string
    imageHighlights?: readonly VariantImageHighlight[]
  }
> = {
  upstreamOilGas: {
    ns: "upstreamOilGasPage",
    hero: "images/main.webp",
    highlightIcons: [Droplets, Flame, Factory, Anchor, Gauge],
  },
  greenEnergy: {
    ns: "greenEnergyPage",
    hero: "images/waterclean.webp",
    highlightIcons: [Recycle, Factory, Flame, Droplets, Zap],
    imageHighlights: [
      {
        src: "images/hal-2.webp",
        altKey: "greenEnergyPage.highlight1Alt",
        titleKey: "greenEnergyPage.highlight1Title",
        bodyKey: "greenEnergyPage.highlight1Body",
      },
      {
        src: "images/onshore-projects/mehsana-air-compressors-1.webp",
        altKey: "greenEnergyPage.highlight2Alt",
        titleKey: "greenEnergyPage.highlight2Title",
        bodyKey: "greenEnergyPage.highlight2Body",
      },
      {
        src: "images/hero-platform.webp",
        altKey: "greenEnergyPage.highlight3Alt",
        titleKey: "greenEnergyPage.highlight3Title",
        bodyKey: "greenEnergyPage.highlight3Body",
      },
      {
        src: "images/waterclean.webp",
        altKey: "greenEnergyPage.highlight4Alt",
        titleKey: "greenEnergyPage.highlight4Title",
        bodyKey: "greenEnergyPage.highlight4Body",
      },
      {
        src: "images/flagship-projects/bcpb-2-facility.webp",
        altKey: "greenEnergyPage.highlight5Alt",
        titleKey: "greenEnergyPage.highlight5Title",
        bodyKey: "greenEnergyPage.highlight5Body",
      },
    ],
  },
  flagship: {
    ns: "flagshipPage",
    hero: "nandasan/7.webp",
    highlightIcons: [Award, Ship, MapPin, ClipboardList, Sparkles],
    showHighlights: false,
    galleryKickerKey: "detail.gallery.kickerFlagship",
    galleryHeadingKey: "detail.gallery.headingFlagship",
    gallery: [
      {
        src: "dcu-numaligarh/1-1200.webp",
        srcSet: dcuImageSrcSet(1),
        sizes: DCU_CARD_SIZES,
        altKey: "flagshipPage.gallery.dcuAlt",
        captionKey: "flagshipPage.gallery.dcuCaption",
        galleryHref: DCU_NUMALIGARH_GALLERY_ROUTE,
      },
      {
        src: "images/flagship-projects/nandasan-facility.webp",
        altKey: "flagshipPage.gallery.nandasanAlt",
        captionKey: "flagshipPage.gallery.nandasanCaption",
        galleryHref: NANDASAN_GALLERY_ROUTE,
      },
      {
        src: "images/flagship-projects/cluster-c-2.webp",
        altKey: "flagshipPage.gallery.clusterAlt",
        captionKey: "flagshipPage.gallery.clusterCaption",
        galleryHref: CLUSTER_C_GALLERY_ROUTE,
      },
      {
        src: "bcpb-2/1-1200.webp",
        srcSet: bcpb2ImageSrcSet(1),
        sizes: BCPB2_CARD_SIZES,
        altKey: "flagshipPage.case.bassein.alt",
        captionKey: "flagshipPage.case.bassein.caption",
        galleryHref: BCPB2_GALLERY_ROUTE,
      },
      {
        src: "solar-turbine/1-1200.webp",
        srcSet: solarTurbineImageSrcSet(1),
        sizes: SOLAR_TURBINE_CARD_SIZES,
        altKey: "flagshipPage.case.solar.alt",
        captionKey: "flagshipPage.case.solar.caption",
        galleryHref: SOLAR_TURBINE_GALLERY_ROUTE,
      },
      {
        src: "mol-pumps/1-1200.webp",
        srcSet: molPumpsImageSrcSet(1),
        sizes: MOL_PUMPS_CARD_SIZES,
        altKey: "flagshipPage.case.mol.alt",
        captionKey: "flagshipPage.case.mol.caption",
        galleryHref: MOL_PUMPS_GALLERY_ROUTE,
      },
    ],
  },
}

function BusinessOfferingDetailPage({ variant }: { variant: BusinessOfferingVariant }) {
  const { t, language } = useLanguage()
  const cfg = CONFIG[variant]
  const ns = cfg.ns

  const titleKey = `${ns}.pageTitle`
  const highlightKeys = useMemo(
    () => [1, 2, 3, 4, 5].map((i) => `${ns}.highlight${i}` as const),
    [ns]
  )

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = `${t(titleKey)} | HAL Offshore`
    return () => {
      document.title = "HAL Offshore"
    }
  }, [t, titleKey])

  const dir = language === "ar" ? "rtl" : "ltr"
  const HERO_BG = publicImagePath(cfg.hero)

  return (
    <div className="bg-background text-foreground" dir={dir}>
      <main>
        {/* ─── Hero ─────────────────────────────────────────────────────── */}
        <section className={STANDARD_PAGE_HERO_SECTION_CLASS}>
          <img
            src={HERO_BG}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
            decoding="async"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-[#030912]/50" aria-hidden />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#001F3F]/78 via-[#001F3F]/62 to-[#051020]/88"
            aria-hidden
          />

          <StandardPageHeroInset
            crumbs={[
              { to: "/businesses", label: t("offshoreEpc.heroKicker") },
              { label: t(titleKey) },
            ]}
            title={t(titleKey)}
          />
        </section>

        {/* ─── Gallery (flagship variant only) ───────────────────────────── */}
        {cfg.gallery && cfg.gallery.length > 0 ? (
          <section className="relative border-t border-neutral-200 bg-gradient-to-b from-neutral-50 to-white py-10 sm:py-12 md:py-14">
            <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.5 }}
                className="max-w-2xl"
              >
                {cfg.galleryKickerKey ? (
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#001F3F]">
                    {t(cfg.galleryKickerKey)}
                  </p>
                ) : null}
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-[1.75rem] md:text-3xl">
                  {t(cfg.galleryHeadingKey ?? "detail.gallery.headingDefault")}
                </h3>
              </motion.div>

              <div
                className={`mt-10 grid gap-5 sm:gap-6 ${
                  cfg.gallery.length === 1
                    ? "grid-cols-1"
                    : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                {cfg.gallery.map((photo, i) => {
                  const galleryHref = photo.galleryHref
                  const cardMotion = {
                    initial: { opacity: 0, y: 28 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, margin: "-60px" },
                    transition: { duration: 0.5, delay: i * 0.08 },
                  }
                  const cardClass =
                    "group relative w-full overflow-hidden rounded-2xl bg-neutral-900 text-left shadow-xl shadow-black/[0.14] ring-1 ring-black/[0.06] transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/[0.22]"

                  const inner = (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                      <img
                        src={publicImagePath(photo.src)}
                        srcSet={photo.srcSet}
                        sizes={photo.sizes}
                        alt={t(photo.altKey)}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-[transform,filter] duration-700 ease-out [filter:contrast(1.12)_saturate(1.2)_brightness(1.03)] group-hover:scale-[1.04] group-hover:[filter:contrast(1.2)_saturate(1.32)_brightness(1.05)]"
                      />
                      <div
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.2),transparent_55%)] mix-blend-overlay"
                        aria-hidden
                      />
                      <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
                        aria-hidden
                      />
                      <div
                        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10"
                        aria-hidden
                      />
                      {galleryHref ? (
                        <div
                          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/40 group-focus-visible:bg-black/40"
                          aria-hidden
                        >
                          <span className="inline-flex translate-y-2 items-center gap-2 rounded-full border border-white/25 bg-black/55 px-4 py-2 text-sm font-semibold text-white opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                            <Images className="h-4 w-4 shrink-0" aria-hidden />
                            {t("flagshipPage.gallery.viewProject")}
                          </span>
                        </div>
                      ) : null}
                      {photo.captionKey ? (
                        <figcaption className="absolute inset-x-0 bottom-0 z-10 px-5 pb-5 pt-14 sm:px-6 sm:pb-6">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ffffff] [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
                            {t("detail.gallery.captionTag")}
                          </p>
                          <p className="mt-1 text-base font-semibold leading-snug text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.55)] sm:text-lg">
                            {t(photo.captionKey)}
                          </p>
                        </figcaption>
                      ) : null}
                    </div>
                  )

                  if (galleryHref) {
                    return (
                      <motion.div key={photo.src} {...cardMotion} className={cardClass}>
                        <Link
                          to={galleryHref}
                          className="block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#001F3F] focus-visible:ring-offset-2"
                          aria-label={`${t(photo.altKey)} — ${t("flagshipPage.gallery.viewProject")}`}
                        >
                          {inner}
                        </Link>
                      </motion.div>
                    )
                  }

                  return (
                    <motion.figure key={photo.src} {...cardMotion} className={cardClass}>
                      {inner}
                    </motion.figure>
                  )
                })}
              </div>
            </div>

          </section>
        ) : null}

        {/* ─── Highlights: capability cards on light grey ────────────────── */}
        {cfg.showHighlights !== false ? (
        <section className="relative border-t border-neutral-200 bg-neutral-50 py-10 sm:py-12 md:py-14">
          <div
            className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#001F3F]/[0.08] blur-3xl"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
            <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#001F3F]">
                {t("detail.capabilities.kicker")}
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-[1.75rem] md:text-3xl">
                {t(`${ns}.highlightsTitle`)}
              </h3>
            </motion.div>

            {cfg.imageHighlights && cfg.imageHighlights.length > 0 ? (
              <div className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {cfg.imageHighlights.map((item, i) => {
                  const Icon = cfg.highlightIcons[i] ?? Sparkles
                  return (
                    <motion.article
                      key={item.src}
                      initial={{ opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.5, delay: i * 0.06 }}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm ring-1 ring-black/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-[#001F3F]/35 hover:shadow-xl hover:shadow-black/[0.1]"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                        <img
                          src={publicImagePath(item.src)}
                          alt={t(item.altKey)}
                          loading={i < 2 ? "eager" : "lazy"}
                          decoding="async"
                          className="h-full w-full object-cover transition-[transform,filter] duration-700 ease-out [filter:contrast(1.08)_saturate(1.12)_brightness(1.02)] group-hover:scale-[1.04] group-hover:[filter:contrast(1.14)_saturate(1.22)_brightness(1.04)]"
                        />
                        <div
                          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
                          aria-hidden
                        />
                        <div
                          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10"
                          aria-hidden
                        />
                        <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFCA23] text-[#001F3F] shadow-lg shadow-black/20">
                          <Icon className="h-5 w-5" aria-hidden />
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        <h4 className="text-lg font-bold leading-snug text-neutral-900">
                          {t(item.titleKey)}
                        </h4>
                        <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-neutral-600">
                          {t(item.bodyKey)}
                        </p>
                      </div>
                    </motion.article>
                  )
                })}
              </div>
            ) : (
              <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {highlightKeys.map((key, i) => {
                  const Icon = cfg.highlightIcons[i] ?? Sparkles
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 22 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.45, delay: i * 0.05 }}
                      className="group relative overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#001F3F]/50 hover:shadow-xl hover:shadow-black/[0.08]"
                    >
                      <span
                        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#001F3F]/[0.07] transition-transform duration-500 group-hover:scale-110"
                        aria-hidden
                      />
                      <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[#001F3F] text-white shadow-md shadow-black/[0.08] transition-colors duration-300 group-hover:bg-white group-hover:text-[#001F3F]">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <p className="relative mt-5 text-[0.975rem] font-medium leading-snug text-neutral-800">
                        {t(key)}
                      </p>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
        ) : null}

      </main>

      <Footer />
    </div>
  )
}

export function UpstreamOilGasPage() {
  return <BusinessOfferingDetailPage variant="upstreamOilGas" />
}

export function GreenEnergyPage() {
  return <BusinessOfferingDetailPage variant="greenEnergy" />
}

export function FlagshipProjectsPage() {
  return <BusinessOfferingDetailPage variant="flagship" />
}
