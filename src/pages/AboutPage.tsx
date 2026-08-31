import { useEffect, useState, type ReactNode } from "react"
import { Link, useLocation } from "react-router"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Leaf,
  HardHat,
  ClipboardCheck,
} from "lucide-react"
import { useLanguage } from "../components/language-context"
import { PageSeo } from "../components/seo"
import { ROUTE_SEO } from "../config/site"
import {
  STANDARD_PAGE_HERO_SECTION_CLASS,
  StandardPageHeroInset,
} from "../components/standard-page-hero-inset"
import { Footer } from "../sections/footer"
import { GroupCompaniesSection } from "../sections/group-companies"
import { JOURNEY_MILESTONES } from "../data/journey-milestones"

const sectionNav = [
  { id: "overview", labelKey: "aboutPage.overview.title" },
  { id: "company", labelKey: "aboutPage.company.title" },
  { id: "subsidiaries", labelKey: "aboutPage.subsidiaries.title" },
  { id: "chairman", labelKey: "aboutPage.chairman.title" },
  { id: "vice-chairman", labelKey: "aboutPage.viceChairman.navLabel" },
  { id: "ceo", labelKey: "aboutPage.ceo.navLabel" },
  { id: "milestones", labelKey: "aboutPage.milestones.title" },
  { id: "hse", labelKey: "aboutPage.hse.kicker" },
  { id: "management", labelKey: "aboutPage.management.title" },
] as const

const managementTeam = [
  { name: "Mr. Sanjeev Agarwal", role: "Chairman and strategic leadership." },
  {
    name: "Mr. Anant Agarwal",
    role: "Vice Chairman — strategic oversight and business direction.",
  },
  {
    name: "Mr. Vineet Agarwal",
    role: "Chief Executive Officer & Chief Operating Officer — leading strategy, operations, and delivery across HAL programmes.",
  },
  {
    name: "Mr. Subrat Das",
    role: "Chief Financial Officer - finance, controls, compliance, and capital stewardship.",
  },
] as const

function ValenceSectionHeader({
  label,
  title,
  description,
  dark = false,
  className = "",
}: {
  label?: string
  title: string
  description?: string
  dark?: boolean
  className?: string
}) {
  return (
    <div className={`mx-auto max-w-4xl text-center ${className}`}>
      {label ? (
        <p
          className={`mb-5 text-sm font-semibold uppercase tracking-[0.2em] sm:mb-6 sm:text-base md:text-lg ${
            dark ? "text-white" : "text-neutral-500"
          }`}
        >
          {label}
        </p>
      ) : null}
      <h2
        className={`text-balance text-3xl font-bold tracking-[-0.02em] sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.05] ${
          dark ? "text-white" : "text-[#001F3F]"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mx-auto mt-6 max-w-2xl text-pretty text-base leading-[1.65] sm:mt-8 sm:text-lg md:text-xl md:leading-[1.65] ${
            dark ? "text-white/80" : "text-neutral-600"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}

const fullBleedFrameDefault =
  "relative aspect-[5/3] w-full overflow-hidden bg-neutral-200 sm:aspect-[21/9] md:aspect-[2.5/1]"

function FullBleedImage({
  src,
  alt,
  className = "",
  overlay,
  blurBackground = false,
  overlayContainerClassName,
  frameClassName,
}: {
  src: string
  alt: string
  className?: string
  overlay?: ReactNode
  /** Frosted scrim + backdrop blur for busy photos (quote overlays, etc.). */
  blurBackground?: boolean
  /** Override default centered overlay box (tall copy blocks: no overflow-y — avoids scroll trapping). */
  overlayContainerClassName?: string
  /** Override inner photo aspect (taller frame when overlay has more text). */
  frameClassName?: string
}) {
  return (
    <figure
      className={`relative left-1/2 mt-12 w-screen -translate-x-1/2 motion-safe:transition-opacity motion-safe:duration-500 md:mt-16 lg:mt-20 mb-16 md:mb-24 lg:mb-28 ${className}`}
    >
      <div className={frameClassName ?? fullBleedFrameDefault}>
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
        {overlay ? (
          <>
            {blurBackground ? (
              <>
                <div
                  className="absolute inset-0 bg-[#001F3F]/65 backdrop-blur-md supports-[backdrop-filter]:bg-[#001F3F]/48 supports-[backdrop-filter]:backdrop-blur-xl"
                  aria-hidden
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#001F3F]/80 via-[#001F3F]/25 to-[#001F3F]/10 supports-[backdrop-filter]:from-[#001F3F]/55 supports-[backdrop-filter]:via-[#001F3F]/15 supports-[backdrop-filter]:to-transparent"
                  aria-hidden
                />
              </>
            ) : (
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#001F3F]/92 via-[#001F3F]/55 to-[#001F3F]/25"
                aria-hidden
              />
            )}
            <div
              className={
                overlayContainerClassName ??
                "absolute inset-0 z-10 flex items-center justify-center px-6 py-10 sm:px-10 md:px-12 md:py-14"
              }
            >
              {overlay}
            </div>
          </>
        ) : null}
      </div>
    </figure>
  )
}

export function AboutPage() {
  const seo = ROUTE_SEO["/about"]
  const { t, language } = useLanguage()
  const location = useLocation()
  const dir = language === "ar" ? "rtl" : "ltr"
  const [activeSection, setActiveSection] = useState<string>(sectionNav[0].id)

  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.replace(/^#/, ""))
      const run = () => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      const t0 = window.requestAnimationFrame(() => {
        window.setTimeout(run, 40)
      })
      return () => cancelAnimationFrame(t0)
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior })
  }, [location.pathname, location.hash])

  useEffect(() => {
    const ids = sectionNav.map((s) => s.id)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting && e.target.id)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id)
        }
      },
      { root: null, rootMargin: "-12% 0px -55% 0px", threshold: [0, 0.08, 0.2, 0.35, 0.5] }
    )

    const els: Element[] = []
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) {
        observer.observe(el)
        els.push(el)
      }
    })

    return () => {
      els.forEach((el) => observer.unobserve(el))
      observer.disconnect()
    }
  }, [])

  const activeForHash = location.hash.replace(/^#/, "")
  const sidebarActive = activeForHash && sectionNav.some((s) => s.id === activeForHash) ? activeForHash : activeSection

  return (
    <div className="overflow-x-hidden bg-background text-foreground" dir={dir}>
      <PageSeo title={seo.title} description={seo.description} path={seo.path} />
      <main>
        <section className={STANDARD_PAGE_HERO_SECTION_CLASS}>
          <div
            className="absolute inset-0 bg-[url('/images/about-platform.webp')] bg-cover bg-center"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#001F3F]/90 via-[#001F3F]/68 to-black/35"
            aria-hidden
          />
          <StandardPageHeroInset
            crumbs={[
              { to: "/", label: t("businesses.breadcrumb.home") },
              { label: t("nav.about") },
            ]}
            title={t("nav.about")}
            afterTitle={
              <Link
                to={{ pathname: "/about", hash: "#overview" }}
                className="group mt-8 inline-flex items-center gap-3 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white shadow-sm backdrop-blur-sm transition-all duration-300 ease-out hover:border-white hover:bg-white hover:text-[#001F3F] hover:shadow-md sm:mt-10 md:px-7 md:py-4 md:text-base"
              >
                {t("aboutPage.overview.title")}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </Link>
            }
          />
        </section>

        {/* Trust strip + in-page #overview target */}
        <div id="overview" className="scroll-mt-40 border-b border-neutral-200/80 bg-neutral-50/40">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-14 sm:grid-cols-3 sm:gap-10 sm:py-10 md:py-12 lg:px-12 xl:px-14">
            {[
              { v: "aboutPage.overview.stat1" },
              { v: "aboutPage.overview.stat2" },
              { v: "aboutPage.overview.stat4" },
            ].map((row) => (
              <div key={row.v} className="text-center">
                <p className="font-mono text-2xl font-bold tabular-nums text-[#001F3F] sm:text-3xl md:text-4xl lg:text-[2.75rem]">
                  {t(`${row.v}.value`)}
                </p>
                <p className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500 sm:text-sm">
                  {t(`${row.v}.label`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Centered column: sticky section nav + all sections (no side rail — avoids content sitting right of viewport) */}
        <div className="w-full">
          <div className="sticky top-16 z-20 border-b border-neutral-200/90 bg-white/90 py-3.5 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
            <p className="sr-only">{t("aboutPage.jumpNav.label")}</p>
            <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-2 px-4 pb-0.5 pt-0.5 sm:gap-2.5 sm:px-6 md:px-8 lg:px-10">
              {sectionNav.map((item) => (
                <Link
                  key={item.id}
                  to={{ pathname: "/about", hash: `#${item.id}` }}
                  className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-semibold transition-all duration-300 ease-out sm:px-5 sm:text-sm ${
                    sidebarActive === item.id
                      ? "bg-[#001F3F] text-white shadow-sm"
                      : "bg-neutral-100/90 text-neutral-700 hover:bg-neutral-200/90 hover:text-[#001F3F]"
                  }`}
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-12 md:px-8 md:pb-32 md:pt-14 lg:pt-16 lg:pb-36 xl:px-10">
            {/* HAL Company — heading + copy live on full-bleed image */}
            <section id="company" className="scroll-mt-40 border-t border-neutral-200/80 pt-6 md:pt-8 lg:pt-10">
              <FullBleedImage
                src="/images/hal-3.webp"
                alt=""
                blurBackground
                frameClassName="relative aspect-[4/5] w-full overflow-hidden bg-neutral-200 sm:aspect-[5/4] md:aspect-[4/3] lg:aspect-[3/2] xl:aspect-[14/9] 2xl:aspect-[16/10]"
                overlayContainerClassName="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 lg:py-12"
                className="!mt-0 mb-16 md:mb-24 lg:mb-28"
                overlay={
                  <div className="mx-auto w-full max-w-4xl text-center">
                    <ValenceSectionHeader
                      label={t("aboutPage.company.kicker")}
                      title={t("aboutPage.headline")}
                      dark
                      className="mb-0 max-w-4xl [&_h2]:drop-shadow-md [&_p]:drop-shadow-sm"
                    />
                    <ul
                      className="mx-auto mt-6 max-w-2xl list-disc space-y-2.5 ps-5 text-start text-pretty text-sm leading-[1.7] text-white/90 [text-shadow:0_1px_14px_rgba(0,0,0,0.5)] marker:text-white sm:mt-8 sm:space-y-3 sm:ps-6 sm:text-base md:text-lg md:leading-[1.75]"
                    >
                      {([1, 2, 3, 4, 5, 6] as const).map((n) => (
                        <li key={n}>{t(`aboutPage.company.bullet.${n}`)}</li>
                      ))}
                    </ul>
                  </div>
                }
              />
            </section>

            <GroupCompaniesSection />

            <section
              id="chairman"
              className="scroll-mt-40 -mx-6 rounded-sm border-y border-neutral-200/90 bg-neutral-50/60 px-6 py-12 md:-mx-8 md:px-8 md:py-16 lg:mx-0 lg:px-0 lg:py-20"
            >
              <ValenceSectionHeader
                label={t("aboutPage.chairman.kicker")}
                title={t("aboutPage.chairman.title")}
              />
              <div className="mt-14 grid items-start gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-0">
                <div className="lg:col-span-5">
                  <div className="relative mx-auto max-w-md">
                    <div className="aspect-[4/5] overflow-hidden bg-neutral-200 shadow-md">
                      <img
                        src="/images/chairman-sanjeev-agarwal.webp"
                        srcSet="/images/chairman-sanjeev-agarwal.webp 896w"
                        sizes="(min-width: 1024px) 28rem, 90vw"
                        width={896}
                        height={1120}
                        alt={t("aboutPage.chairman.photoAlt")}
                        className="h-full w-full object-cover object-[center_18%]"
                        decoding="async"
                      />
                    </div>
                    <div className="mt-8 border-s-4 border-[#001F3F] ps-6 md:mt-10">
                      <p className="text-xl font-bold text-[#001F3F] md:text-2xl">{t("aboutPage.chairman.name")}</p>
                      <p className="mt-2 text-base font-medium leading-snug text-neutral-600">{t("aboutPage.chairman.role")}</p>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-7">
                  <div className="space-y-7 text-base leading-[1.75] text-neutral-600 md:space-y-8 md:text-lg">
                    <p className="text-pretty">{t("aboutPage.chairman.p1")}</p>
                    <p className="text-pretty">{t("aboutPage.chairman.p2")}</p>
                    <p className="text-pretty">{t("aboutPage.chairman.p3")}</p>
                  </div>
                </div>
              </div>
            </section>

            <section
              id="vice-chairman"
              className="scroll-mt-40 border-t border-neutral-200/80 bg-white py-12 md:py-16 lg:py-20"
            >
              <ValenceSectionHeader
                label={t("aboutPage.viceChairman.kicker")}
                title={t("aboutPage.viceChairman.title")}
              />
              <div className="mt-14 grid items-start gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-0">
                <div className="lg:col-span-5">
                  <div className="relative mx-auto max-w-md">
                    <div className="aspect-[4/5] overflow-hidden bg-neutral-200 shadow-md">
                      <img
                        src="/images/vice-chairman-anant-agarwal.webp"
                        srcSet="/images/vice-chairman-anant-agarwal.webp 896w"
                        sizes="(min-width: 1024px) 28rem, 90vw"
                        width={896}
                        height={1120}
                        alt={t("aboutPage.viceChairman.photoAlt")}
                        className="h-full w-full object-cover object-[center_12%]"
                        decoding="async"
                      />
                    </div>
                    <div className="mt-8 border-s-4 border-[#001F3F] ps-6 md:mt-10">
                      <p className="text-xl font-bold text-[#001F3F] md:text-2xl">{t("aboutPage.viceChairman.name")}</p>
                      <p className="mt-2 text-base font-medium leading-snug text-neutral-600">{t("aboutPage.viceChairman.role")}</p>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-7">
                  <div className="space-y-7 text-base leading-[1.75] text-neutral-600 md:space-y-8 md:text-lg">
                    <p className="text-pretty">{t("aboutPage.viceChairman.p1")}</p>
                    <p className="text-pretty">{t("aboutPage.viceChairman.p2")}</p>
                    <p className="text-pretty">{t("aboutPage.viceChairman.p3")}</p>
                  </div>
                </div>
              </div>
            </section>

            <section
              id="ceo"
              className="scroll-mt-40 border-t border-neutral-200/80 bg-white py-12 md:py-16 lg:py-20"
            >
              <ValenceSectionHeader
                label={t("aboutPage.ceo.kicker")}
                title={t("aboutPage.ceo.title")}
              />
              <div className="mt-14 grid items-start gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-0">
                <div className="lg:col-span-5">
                  <div className="relative mx-auto max-w-md">
                    <div className="aspect-[4/5] overflow-hidden bg-neutral-200 shadow-md">
                      <img
                        src="/images/ceo-vineet-agarwal.webp"
                        srcSet="/images/ceo-vineet-agarwal.webp 896w"
                        sizes="(min-width: 1024px) 28rem, 90vw"
                        width={896}
                        height={1120}
                        alt={t("aboutPage.ceo.photoAlt")}
                        className="h-full w-full object-cover object-[center_20%]"
                        decoding="async"
                      />
                    </div>
                    <div className="mt-8 border-s-4 border-[#001F3F] ps-6 md:mt-10">
                      <p className="text-xl font-bold text-[#001F3F] md:text-2xl">{t("aboutPage.ceo.name")}</p>
                      <p className="mt-2 text-base font-medium leading-snug text-neutral-600">{t("aboutPage.ceo.role")}</p>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-7">
                  <div className="space-y-7 text-base leading-[1.75] text-neutral-600 md:space-y-8 md:text-lg">
                    <p className="text-pretty">{t("aboutPage.ceo.p1")}</p>
                    <p className="text-pretty">{t("aboutPage.ceo.p2")}</p>
                    <p className="text-pretty">{t("aboutPage.ceo.p3")}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Our journey and milestones */}
            <section id="milestones" className="scroll-mt-40 border-t border-neutral-200/80 pt-20 md:pt-28 lg:pt-32">
              <div id="journey" className="scroll-mt-40" />
              <ValenceSectionHeader title={t("aboutPage.milestones.title")} />
              <ol className="mx-auto mt-14 max-w-3xl list-none md:mt-20">
                {JOURNEY_MILESTONES.map((item, i) => {
                  const isLast = i === JOURNEY_MILESTONES.length - 1
                  return (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-32px" }}
                      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: Math.min(i * 0.04, 0.24) }}
                      className="grid grid-cols-[auto_1fr] gap-x-5 pb-12 last:pb-0 md:gap-x-8"
                    >
                      <div className="flex flex-col items-center">
                        <span className="rounded bg-[#001F3F] px-3 py-1 text-center font-mono text-sm font-bold whitespace-nowrap text-white md:px-4 md:py-1.5 md:text-base lg:px-5 lg:py-2">
                          {t(`aboutPage.milestones.${item.id}.year`)}
                        </span>
                        {!isLast ? (
                          <span
                            className="mt-3 min-h-10 w-px flex-1 bg-[#001F3F]/20"
                            aria-hidden
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 pt-0.5">
                        {"hideTitle" in item && item.hideTitle ? null : (
                          <h3 className="text-lg font-bold text-[#001F3F] md:text-xl">
                            {t(`aboutPage.milestones.${item.id}.title`)}
                          </h3>
                        )}
                        <p className={`text-pretty text-base leading-[1.75] text-neutral-700 md:text-lg ${"hideTitle" in item && item.hideTitle ? "" : "mt-2"}`}>
                          {t(`aboutPage.milestones.${item.id}.body`)}
                        </p>
                        {"listKeys" in item && item.listKeys ? (
                          <ul className="mt-4 list-disc space-y-1.5 ps-5 text-pretty text-base leading-[1.75] text-neutral-700 md:text-lg">
                            {item.listKeys.map((listKey) => (
                              <li key={listKey}>{t(`aboutPage.milestones.${item.id}.${listKey}`)}</li>
                            ))}
                          </ul>
                        ) : null}
                        {"extraBody" in item && item.extraBody ? (
                          <p className="mt-4 text-pretty text-base leading-[1.75] text-neutral-700 md:text-lg">
                            {t(`aboutPage.milestones.${item.id}.body2`)}
                          </p>
                        ) : null}
                      </div>
                    </motion.li>
                  )
                })}
              </ol>
            </section>

            {/* HSE — divider list */}
            <section id="hse" className="scroll-mt-40 border-t border-neutral-200/80 pt-20 md:pt-28 lg:pt-32">
              <ValenceSectionHeader
                label={t("aboutPage.hse.kicker")}
                title={t("aboutPage.hse.title")}
                description={t("aboutPage.hse.lead")}
              />
              <ul className="mt-16 border-t border-neutral-200 md:mt-20">
                {(
                  [
                    { icon: HardHat, k: "card1" },
                    { icon: ClipboardCheck, k: "card2" },
                    { icon: Leaf, k: "card3" },
                  ] as const
                ).map((item, i) => (
                  <motion.li
                    key={item.k}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.06 }}
                    className="grid gap-7 border-b border-neutral-200 py-12 md:grid-cols-12 md:items-start md:gap-x-12 md:gap-y-0 md:py-14 lg:py-10"
                  >
                    <div className="flex gap-5 md:col-span-4 lg:col-span-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#001F3F] text-white">
                        <item.icon className="h-5 w-5" aria-hidden />
                      </div>
                      <h3 className="pt-1.5 text-lg font-bold text-[#001F3F] md:text-xl">
                        {t(`aboutPage.hse.${item.k}.title`)}
                      </h3>
                    </div>
                    <p className="text-base leading-[1.75] text-neutral-600 md:col-span-8 md:text-lg lg:col-span-9">
                      {t(`aboutPage.hse.${item.k}.body`)}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </section>

            {/* Management — list rows */}
            <section id="management" className="scroll-mt-40 border-t border-neutral-200/80 pt-20 md:pt-28 lg:pt-32">
              <ValenceSectionHeader
                label={t("aboutPage.management.kicker")}
                title={t("aboutPage.management.title")}
                description={t("aboutPage.management.lead")}
              />
              <ul className="mt-16 border-t border-neutral-200 md:mt-20">
                {managementTeam.map((member, i) => (
                  <motion.li
                    key={member.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.05 }}
                    className="flex flex-col gap-4 border-b border-neutral-200 py-12 md:flex-row md:items-baseline md:gap-x-16 md:gap-y-0 md:py-14 lg:py-10"
                  >
                    <p className="text-xl font-bold text-[#001F3F] md:w-[38%] md:max-w-md md:text-2xl">
                      {member.name}
                    </p>
                    <p className="text-base leading-[1.7] text-neutral-600 md:flex-1 md:text-lg">
                      {member.role}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </section>

            <div className="mt-20 flex flex-col items-center justify-center gap-4 sm:mt-24 sm:flex-row sm:flex-wrap sm:gap-5 md:mt-28">
              <Link
                to="/businesses"
                className="inline-flex min-h-12 w-full items-center justify-center bg-[#001F3F] px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-300 ease-out hover:bg-[#000F25] hover:shadow-md sm:w-auto"
              >
                {t("aboutPage.cta.businesses")}
              </Link>
              <Link
                to="/contact"
                className="inline-flex min-h-12 w-full items-center justify-center border-2 border-[#001F3F] px-8 py-3.5 text-base font-semibold text-[#001F3F] transition-all duration-300 ease-out hover:bg-[#001F3F]/5 hover:shadow-sm sm:w-auto"
              >
                {t("aboutPage.cta.contact")}
              </Link>
            </div>
          </div>
        </div>

        {/* Final CTA band */}
        <section className="relative flex min-h-[360px] items-center justify-center overflow-hidden py-14 md:min-h-[440px] md:py-20">
          <div
            className="absolute inset-0 bg-[url('/images/hal-5.webp')] bg-cover bg-center"
            aria-hidden
          />
          <div className="absolute inset-0 bg-[#001F3F]/88" aria-hidden />
          <div className="relative z-10 mx-auto max-w-2xl px-6 text-center sm:px-8">
            <p className="text-2xl font-bold leading-snug text-white md:text-3xl md:leading-tight lg:text-[2rem] lg:leading-tight">
              {t("cta.title")}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
