import { useEffect, useMemo } from "react"
import { Link } from "react-router"
import { motion } from "framer-motion"
import {
  BadgeCheck,
  Beaker,
  Building2,
  Clock,
  Droplets,
  FileText,
  Filter,
  Gauge,
  Handshake,
  Shield,
  Sparkles,
  Trophy,
  TrendingUp,
} from "lucide-react"
import { useLanguage } from "../components/language-context"
import {
  STANDARD_PAGE_HERO_SECTION_CLASS,
  StandardPageHeroInset,
} from "../components/standard-page-hero-inset"
import { Footer } from "../sections/footer"

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

const BOO_HERO = publicImagePath("images/hero-platform.webp")
const BOO_FEATURE = publicImagePath("images/hal-4.webp")
const booHighlightIcons = [Building2, Handshake, Clock, FileText, Shield] as const
const booAchievementIcons = [Trophy, BadgeCheck, Shield, TrendingUp] as const

const OM_FEATURE = publicImagePath("images/waterc.webp")
const OM_HERO_BG = publicImagePath("images/waterclean.webp")
const omHighlightIcons = [Droplets, Beaker, Filter, Shield, Gauge] as const
const omAchievementIcons = [Trophy, Droplets, Gauge, Shield] as const

export function BooOmPage() {
  const { t, language } = useLanguage()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = `${t("booOmPage.pageTitle")} | HAL Offshore`
    return () => {
      document.title = "HAL Offshore"
    }
  }, [t])

  const dir = language === "ar" ? "rtl" : "ltr"

  const booHighlightKeys = useMemo(
    () => [1, 2, 3, 4, 5].map((i) => `botPage.highlight${i}` as const),
    []
  )
  const booAchievementKeys = useMemo(
    () => [1, 2, 3, 4].map((i) => `botPage.achievement${i}` as const),
    []
  )

  const omHighlightKeys = useMemo(
    () =>
      [1, 2, 3, 4, 5].map((i) => `omPage.pwtpHighlight${i}` as const),
    []
  )
  const omAchievementKeys = useMemo(
    () => [1, 2, 3, 4].map((i) => `omPage.pwtpAchievement${i}` as const),
    []
  )
  const omHighlights = useMemo(
    () => omHighlightKeys.map((key) => t(key)),
    [t, omHighlightKeys]
  )
  const omAchievements = useMemo(
    () => omAchievementKeys.map((key) => t(key)),
    [t, omAchievementKeys]
  )

  return (
    <div className="bg-background text-foreground" dir={dir}>
      <main>
        <section className={STANDARD_PAGE_HERO_SECTION_CLASS}>
          <img
            src={BOO_HERO}
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
              { label: t("booOmPage.pageTitle") },
            ]}
            title={t("booOmPage.pageTitle")}
            afterTitle={
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 [text-shadow:0_1px_8px_rgba(0,0,0,0.65)] sm:text-lg">
                {t("booOmPage.heroLead")}
              </p>
            }
          />
        </section>

        {/* BOO (Build Own Operate) — former BOOT detail content */}
        <section
          id="boo"
          className="relative overflow-hidden border-t border-neutral-200 py-14 sm:py-12 md:py-14"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <img
              src={BOO_FEATURE}
              alt=""
              className="absolute inset-0 h-full w-full scale-[1.1] object-cover object-center blur-md sm:scale-[1.08] sm:blur-lg"
              decoding="async"
            />
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#f7f7f8]/93 via-[#f5f5f7]/88 to-[#f0f1f4]/92"
            aria-hidden
          />
          <div className="absolute inset-0 bg-[#001F3F]/[0.07]" aria-hidden />

          <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6">
            <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mx-auto max-w-4xl">
              <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.18em] text-[#001F3F]">
                {t("booOmPage.booSectionLabel")}
              </p>
              <div className="rounded-2xl border border-neutral-200/90 bg-white/95 p-6 shadow-md backdrop-blur-sm sm:p-8 md:p-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  {t("botPage.caseKicker")}
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
                  {t("botPage.caseTitle")}
                </h2>

                <div className="mt-8 border-t border-neutral-200 pt-8">
                  <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                    {t("botPage.scopeLabel")}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-700 sm:text-[0.9375rem]">
                    {t("botPage.scopeBody")}
                  </p>
                </div>

                <div className="mt-8 border-t border-neutral-200 pt-8">
                  <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                    {t("botPage.highlightsTitle")}
                  </h3>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    {booHighlightKeys.map((key, i) => {
                      const Icon = booHighlightIcons[i] ?? Sparkles
                      return (
                        <div
                          key={key}
                          className="rounded-lg border border-neutral-100 bg-neutral-50/90 p-4 sm:p-5"
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                            <Icon className="h-5 w-5" aria-hidden />
                          </span>
                          <p className="mt-3 text-sm font-medium leading-snug text-neutral-800">{t(key)}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-8 border-t border-neutral-200 pt-8">
                  <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                    {t("botPage.achievementsTitle")}
                  </h3>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    {booAchievementKeys.map((key, i) => {
                      const Icon = booAchievementIcons[i] ?? Trophy
                      return (
                        <div
                          key={key}
                          className="rounded-lg border border-neutral-100 bg-neutral-50/90 p-4 sm:p-5"
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                            <Icon className="h-5 w-5" aria-hidden />
                          </span>
                          <p className="mt-3 text-sm leading-relaxed text-neutral-700">{t(key)}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-10 flex flex-col items-center gap-4 border-t border-neutral-200 pt-8 sm:flex-row sm:justify-center">
                  <Link
                    to="/contact"
                    className="inline-flex min-h-[2.75rem] items-center justify-center rounded-xl bg-[#001F3F] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#000F25]"
                  >
                    {t("botPage.ctaDiscuss")}
                  </Link>
                  <Link
                    to="/businesses"
                    className="text-sm font-semibold text-[#001F3F] underline-offset-4 hover:underline"
                  >
                    {t("offshoreEpc.allLines")}
                  </Link>
                </div>

                <p className="mt-8 text-center text-[11px] text-neutral-500">
                  {t("botPage.featureImageCaption")}
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* O&M — former O&M detail content */}
        <section
          id="om"
          className="relative overflow-hidden border-t border-neutral-200 py-14 sm:py-12 md:py-14"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <img
              src={OM_FEATURE}
              alt=""
              className="absolute inset-0 h-full w-full scale-[1.1] object-cover object-center blur-md sm:scale-[1.08] sm:blur-lg"
              decoding="async"
            />
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#f7f7f8]/93 via-[#f5f5f7]/88 to-[#f0f1f4]/92"
            aria-hidden
          />
          <div className="absolute inset-0 bg-[#001F3F]/[0.07]" aria-hidden />

          <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6">
            <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mx-auto max-w-4xl">
              <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.18em] text-[#001F3F]">
                {t("booOmPage.omSectionLabel")}
              </p>
              <div className="overflow-hidden rounded-2xl border border-neutral-200/90 shadow-md ring-1 ring-black/[0.04]">
                <div className="relative h-40 sm:h-48">
                  <img
                    src={OM_HERO_BG}
                    alt=""
                    className="h-full w-full object-cover object-center"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001F3F]/75 to-transparent" />
                  <p className="absolute bottom-4 left-5 right-5 text-sm text-white/90 sm:left-8">
                    {t("omPage.heroLead")}
                  </p>
                </div>
                <div className="bg-white/95 p-6 backdrop-blur-sm sm:p-8 md:p-10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    {t("omPage.caseKicker")}
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
                    {t("omPage.pwtpTitle")}
                  </h2>

                  <div className="mt-8 border-t border-neutral-200 pt-8">
                    <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                      {t("omPage.scopeLabel")}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-700 sm:text-[0.9375rem]">
                      {t("omPage.scopeBody")}
                    </p>
                  </div>

                  <div className="mt-8 border-t border-neutral-200 pt-8">
                    <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                      {t("omPage.highlightsTitle")}
                    </h3>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                      {omHighlights.map((text, i) => {
                        const Icon = omHighlightIcons[i] ?? Droplets
                        return (
                          <div
                            key={i}
                            className="rounded-lg border border-neutral-100 bg-neutral-50/90 p-4 sm:p-5"
                          >
                            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                              <Icon className="h-5 w-5" aria-hidden />
                            </span>
                            <p className="mt-3 text-sm font-medium leading-snug text-neutral-800">{text}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-8 border-t border-neutral-200 pt-8">
                    <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                      {t("omPage.achievementsTitle")}
                    </h3>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                      {omAchievements.map((text, i) => {
                        const Icon = omAchievementIcons[i] ?? Trophy
                        return (
                          <div
                            key={i}
                            className="rounded-lg border border-neutral-100 bg-neutral-50/90 p-4 sm:p-5"
                          >
                            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                              <Icon className="h-5 w-5" aria-hidden />
                            </span>
                            <p className="mt-3 text-sm leading-relaxed text-neutral-700">{text}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-10 flex flex-col items-center gap-4 border-t border-neutral-200 pt-8 sm:flex-row sm:justify-center">
                    <Link
                      to="/contact"
                      className="inline-flex min-h-[2.75rem] items-center justify-center rounded-xl bg-[#001F3F] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#000F25]"
                    >
                      {t("omPage.ctaDiscuss")}
                    </Link>
                    <Link
                      to="/businesses"
                      className="text-sm font-semibold text-[#001F3F] underline-offset-4 hover:underline"
                    >
                      {t("offshoreEpc.allLines")}
                    </Link>
                  </div>

                  <p className="mt-8 text-center text-[11px] text-neutral-500">
                    {t("omPage.featureImageCaption")}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
