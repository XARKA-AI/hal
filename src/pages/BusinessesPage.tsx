import { useEffect } from "react"
import { Link } from "react-router"
import { motion } from "framer-motion"
import { Anchor, ChevronRight, Ship } from "lucide-react"
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

const BUSINESSES_HERO_BG = publicImagePath("images/hero-3.webp")

/** Hero segment cards: offshore and onshore only. */
const LANDING_SEGMENTS = [
  {
    id: "offshore" as const,
    href: "/businesses/offshore-epc",
    image: "/images/fleet-aerial.webp",
  },
  {
    id: "onshore" as const,
    href: "/businesses/onshore-epc",
    image: "/images/hal-2.webp",
  },
]

export function BusinessesPage() {
  const { t, language } = useLanguage()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const dir = language === "ar" ? "rtl" : "ltr"

  return (
    <div className="bg-white text-neutral-900" dir={dir}>
      <main>
        <section className={STANDARD_PAGE_HERO_SECTION_CLASS}>
          <img
            src={BUSINESSES_HERO_BG}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#001F3F]/90 via-[#001F3F]/68 to-black/35"
            aria-hidden
          />

          <StandardPageHeroInset
            crumbs={[
              { to: "/", label: t("businesses.breadcrumb.home") },
              { label: t("businesses.landing.pageTitle") },
            ]}
            title={t("businesses.landing.pageTitle")}
            afterTitle={
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 [text-shadow:0_1px_8px_rgba(0,0,0,0.65)] sm:text-lg md:leading-relaxed">
                {t("businesses.landing.lead")}
              </p>
            }
          />
        </section>

        {/* Two tall image columns — offshore | onshore */}
        <section className="bg-white px-4 pb-16 pt-4 sm:px-6 md:px-10 md:pb-20 md:pt-6">
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 md:gap-5">
            {LANDING_SEGMENTS.map((seg, index) => {
              const title = t(`businesses.row.${seg.id}.title`)
              const tags = t(`businesses.row.${seg.id}.tags`)
              return (
                <motion.div
                  key={seg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                >
                  <Link
                    to={seg.href}
                    className="group relative flex flex-col aspect-[4/5] min-h-[280px] w-full overflow-hidden rounded-sm bg-neutral-200 shadow-md ring-1 ring-black/[0.06] transition-shadow duration-300 hover:shadow-xl md:aspect-[4/5] md:min-h-0"
                  >
                    <img
                      src={seg.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                    <div className="relative mt-auto w-full bg-neutral-950/82 px-5 py-5 backdrop-blur-[6px] sm:px-6 sm:py-6 md:px-7 md:py-7">
                      <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-snug text-white/75">{tags}</p>
                      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-amber-300 transition-transform duration-200 group-hover:gap-2">
                        {t("businesses.landing.explore")}
                        <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Closing band */}
        <div className="relative flex min-h-[220px] h-[38vh] w-full items-center justify-center overflow-hidden md:min-h-[240px]">
          <img
            src="/images/hal-6.webp"
            alt=""
            className="absolute inset-0 h-full w-full scale-[1.08] object-cover blur-[2px] sm:blur-[3px]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-neutral-900/55 via-neutral-900/45 to-neutral-900/60"
            aria-hidden
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="relative z-10 mx-auto max-w-3xl px-6 text-center text-xl font-normal leading-relaxed text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.35)] sm:text-2xl md:px-10 md:text-[1.65rem] md:leading-relaxed"
          >
            {t("businesses.belief.before")}
            <Anchor
              className="mx-1.5 inline-block h-4 w-4 -translate-y-0.5 text-[#ffffff] sm:h-[1.05rem] sm:w-[1.05rem]"
              aria-hidden
            />
            {t("businesses.belief.mid")}
            <span className="font-semibold text-[#ffffff]">{t("businesses.belief.em")}</span>
            <Ship
              className="mx-1.5 inline-block h-4 w-4 -translate-y-0.5 text-[#ffffff] sm:h-[1.05rem] sm:w-[1.05rem]"
              aria-hidden
            />
            {t("businesses.belief.after")}
          </motion.p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
