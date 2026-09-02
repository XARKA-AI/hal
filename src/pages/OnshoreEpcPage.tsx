import { useEffect } from "react"
import { Navigate, useLocation } from "react-router"
import { motion, useReducedMotion } from "framer-motion"
import { useLanguage } from "../components/language-context"
import {
  STANDARD_PAGE_HERO_SECTION_CLASS,
  StandardPageHeroInset,
} from "../components/standard-page-hero-inset"
import { Footer } from "../sections/footer"
import { translatedLines } from "../lib/i18n-helpers"

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
}

function publicImagePath(file: string): string {
  const base = import.meta.env.BASE_URL
  const path = file.replace(/^\//, "")
  if (base === "./" || base === ".") return `/${path}`
  return base.endsWith("/") ? `${base}${path}` : `${base}/${path}`
}

const HERO_IMAGE = publicImagePath("images/hal-5.webp")
const CAPABILITIES_BG = publicImagePath("images/hal-1.webp")

const OFFERING_IDS = [1, 2, 3, 4, 5, 6] as const
const DELIVERY_IDS = [1, 2, 3, 4] as const

export function OnshoreEpcPage() {
  const { t, language, strings } = useLanguage()
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const revealProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const },
      }

  const footprintPrimary = translatedLines(t, strings, "onshoreEpc.footprint.primary")
  const footprintAdditional = translatedLines(t, strings, "onshoreEpc.footprint.additional")

  useEffect(() => {
    document.title = `${t("onshoreEpc.pageTitle")} | HAL Offshore`
    return () => {
      document.title = "HAL Offshore"
    }
  }, [t])

  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.replace(/^#/, ""))
      const frame = window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
      })
      return () => window.cancelAnimationFrame(frame)
    }
    window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  const dir = language === "ar" ? "rtl" : "ltr"

  if (location.hash === "#onshore-projects") {
    return <Navigate to="/businesses/onshore-epc/projects" replace />
  }

  return (
    <div className="bg-background text-foreground" dir={dir}>
      <main>
        <section className={STANDARD_PAGE_HERO_SECTION_CLASS}>
          <img
            src={HERO_IMAGE}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
            decoding="async"
            fetchPriority="high"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001F3F]/90 via-[#001F3F]/68 to-black/35" />

          <StandardPageHeroInset
            crumbs={[
              { to: "/businesses", label: t("offshoreEpc.heroKicker") },
              { label: t("onshoreEpc.pageTitle") },
            ]}
            title={t("onshoreEpc.pageTitle")}
          />
        </section>

        {/* Narrative band (matches Offshore EPC pattern) */}
        <section className="border-b border-neutral-200 bg-white py-12 sm:py-14 md:py-16">
          <div className="mx-auto max-w-4xl px-5 sm:px-6">
            <motion.p
              {...fadeUp}
              transition={{ duration: 0.5 }}
              className="text-center text-base leading-relaxed text-neutral-700 md:text-lg md:leading-relaxed"
            >
              {t("onshoreEpc.heroLead")}
            </motion.p>
          </div>
        </section>

        <section
          id="onshore-offerings"
          className="relative border-t border-neutral-200 bg-gradient-to-b from-neutral-50 to-white py-10 sm:py-12 md:py-14"
        >
          <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#001F3F]">
                {t("onshoreEpc.offerings")}
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-[1.75rem] md:text-3xl">
                {t("onshoreEpc.offeringsSectionTitle")}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
                {t("onshoreEpc.offeringsGridLead")}
              </p>
            </motion.div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {DELIVERY_IDS.map((id, i) => (
                <motion.article
                  key={id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="rounded-xl border border-neutral-200/90 bg-white p-5 shadow-sm ring-1 ring-black/[0.03]"
                >
                  <p className="font-mono text-xs font-semibold text-[#001F3F]">
                    {String(id).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-base font-bold leading-snug text-neutral-900">
                    {t(`onshoreEpc.delivery.${id}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {t(`onshoreEpc.delivery.${id}.body`)}
                  </p>
                </motion.article>
              ))}
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {OFFERING_IDS.map((id, i) => (
                <motion.article
                  key={id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.2) }}
                  className="border-t-2 border-[#001F3F] bg-white px-1 pt-5 pb-2"
                >
                  <h3 className="text-lg font-bold text-neutral-900">
                    {t(`onshoreEpc.offering.${id}.title`)}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-neutral-600">
                    {t(`onshoreEpc.offering.${id}.detail`)}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-neutral-200 border-b border-neutral-200/90 bg-white py-10 sm:py-10 md:py-12">
          <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
            <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#001F3F]">
                {t("onshoreEpc.capabilitiesKicker")}
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-neutral-900 md:text-4xl">
                {t("onshoreEpc.capabilitiesTitle")}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
                {t("onshoreEpc.capabilitiesLead")}
              </p>
            </motion.div>

            <motion.div
              {...revealProps}
              className="mt-8 rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-md shadow-black/[0.05] ring-1 ring-black/[0.03] sm:p-6"
            >
              <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#001F3F]">
                {t("onshoreEpc.footprint.primaryKicker")}
              </p>
              <h3 className="mt-2 text-balance text-center text-lg font-semibold uppercase tracking-[0.02em] text-neutral-900 sm:text-xl">
                {t("onshoreEpc.footprint.primaryTitle")}
              </h3>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {footprintPrimary.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 rounded-lg border border-neutral-200/80 bg-[#faf9f7] px-3.5 py-3 text-sm leading-relaxed text-neutral-700"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#001F3F]" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              {...revealProps}
              className="mt-5 rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-md shadow-black/[0.05] ring-1 ring-black/[0.03] sm:p-6"
            >
              <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#001F3F]">
                {t("onshoreEpc.footprint.additionalKicker")}
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {footprintAdditional.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 rounded-lg border border-neutral-200/80 bg-[#faf9f7] px-3.5 py-3 text-sm font-medium leading-relaxed text-neutral-800"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#001F3F]" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        <div className="relative h-36 w-full overflow-hidden sm:h-44 md:h-52">
          <img
            src={CAPABILITIES_BG}
            alt=""
            className="h-full w-full object-cover object-center"
            loading="lazy"
            decoding="async"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#001F3F]/75 via-[#001F3F]/45 to-transparent"
            aria-hidden
          />
          <div className="absolute inset-0 flex items-center px-6 sm:px-10">
            <p className="max-w-md text-lg leading-snug text-white/95 sm:text-xl md:text-2xl [text-shadow:0_2px_12px_rgba(0,0,0,0.4)]">
              {t("onshoreEpc.imageBandQuote")}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
