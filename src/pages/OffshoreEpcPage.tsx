import { useEffect } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "../components/language-context"
import {
  STANDARD_PAGE_HERO_SECTION_CLASS,
  StandardPageHeroInset,
} from "../components/standard-page-hero-inset"
import { Footer } from "../sections/footer"

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
}

/** Public `images/*` — root-absolute when `base` is `./` so nested routes still resolve. */
function publicImagePath(file: string): string {
  const base = import.meta.env.BASE_URL
  const path = file.replace(/^\//, "")
  if (base === "./" || base === ".") return `/${path}`
  return base.endsWith("/") ? `${base}${path}` : `${base}/${path}`
}

const HERO_MAIN = publicImagePath("images/main.webp")

const OFFERING_IDS = [1, 2, 3, 4, 5, 6, 7, 8] as const
const DELIVERY_IDS = [1, 2, 3, 4] as const
const DISCIPLINE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const

export function OffshoreEpcPage() {
  const { t, language } = useLanguage()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = `${t("offshoreEpc.pageTitle")} | HAL Offshore`
    return () => {
      document.title = "HAL Offshore"
    }
  }, [t])

  const dir = language === "ar" ? "rtl" : "ltr"

  return (
    <div className="bg-background text-foreground" dir={dir}>
      <main>
        {/* Hero */}
        <section className={STANDARD_PAGE_HERO_SECTION_CLASS}>
          <img
            src={HERO_MAIN}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
            decoding="async"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-[#030912]/50" aria-hidden />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#001F3F]/78 via-[#001F3F]/65 to-[#051020]/88"
            aria-hidden
          />

          <StandardPageHeroInset
            crumbs={[
              { to: "/businesses", label: t("offshoreEpc.heroKicker") },
              { label: t("offshoreEpc.pageTitle") },
            ]}
            title={t("offshoreEpc.pageTitle")}
          />
        </section>

        <section className="border-b border-neutral-200 bg-white py-12 sm:py-14 md:py-16">
          <div className="mx-auto max-w-4xl px-5 sm:px-6">
            <motion.p
              {...fadeUp}
              transition={{ duration: 0.5 }}
              className="text-center text-base leading-relaxed text-neutral-700 md:text-lg md:leading-relaxed"
            >
              {t("offshoreEpc.heroLead")}
            </motion.p>
          </div>
        </section>

        <section
          id="offshore-projects"
          className="relative border-t border-neutral-200 bg-gradient-to-b from-neutral-50 to-white py-10 sm:py-12 md:py-14"
        >
          <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#001F3F]">
                {t("offshoreEpc.offerings")}
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-[1.75rem] md:text-3xl">
                {t("offshoreEpc.offeringsSectionTitle")}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
                {t("offshoreEpc.offeringsGridLead")}
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
                    {t(`offshoreEpc.delivery.${id}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {t(`offshoreEpc.delivery.${id}.body`)}
                  </p>
                </motion.article>
              ))}
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
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
                    {t(`offshoreEpc.offering.${id}.title`)}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-neutral-600">
                    {t(`offshoreEpc.offering.${id}.detail`)}
                  </p>
                </motion.article>
              ))}
            </div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mt-14 border-t border-neutral-200 pt-10"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#001F3F]">
                {t("offshoreEpc.subcategories")}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
                {t("offshoreEpc.subcategoriesLead")}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {DISCIPLINE_IDS.map((id) => (
                  <li
                    key={id}
                    className="rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-sm font-medium text-neutral-800"
                  >
                    {t(`offshoreEpc.subcategory.${id}`)}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
