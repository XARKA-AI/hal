import { useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useLanguage } from "../../components/language-context"
import {
  STANDARD_PAGE_HERO_SECTION_CLASS,
  StandardPageHeroInset,
} from "../../components/standard-page-hero-inset"
import { Footer } from "../../sections/footer"
import {
  SOLAR_TURBINE_GALLERY_IMAGES,
  SOLAR_TURBINE_GRID_SIZES,
  SOLAR_TURBINE_HERO_IMAGE,
  SOLAR_TURBINE_HERO_MAX_WIDTH,
  SOLAR_TURBINE_HERO_SIZES,
  SOLAR_TURBINE_SCOPE_KEYS,
} from "./solar-turbine-content"
import { SolarTurbinePicture } from "./SolarTurbinePicture"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
}

/**
 * The photo is lit by blue LED strips, so every region already reads cool
 * (B/R 1.16–1.69) and adding more blue only flattens it toward monochrome. The
 * grade instead builds a diagonal: deepen the coldest area (racks and cabinets,
 * upper left) and lift the one warm anchor (the lit floor, lower right). Multiply
 * must come before soft-light or the warm pass gets crushed back out.
 */
const GRADE_LAYERS = {
  hero: [
    // Carries the headline: dark at the left, clearing to reveal the photo.
    "bg-[linear-gradient(105deg,rgba(1,12,26,0.84)_0%,rgba(1,12,26,0.56)_40%,rgba(1,10,22,0.24)_72%,transparent_100%)]",
    "bg-[linear-gradient(to_top,rgba(1,10,22,0.66),rgba(1,10,22,0.16)_46%,transparent_76%)]",
    "bg-[radial-gradient(72%_70%_at_88%_86%,rgba(255,182,108,0.28),transparent_62%)] mix-blend-soft-light",
    "bg-[radial-gradient(125%_105%_at_50%_40%,transparent_38%,rgba(0,6,16,0.5)_100%)]",
  ],
  card: [
    "bg-[radial-gradient(100%_90%_at_8%_0%,rgba(6,28,56,0.4),transparent_62%)] mix-blend-multiply transition-opacity duration-700 group-hover:opacity-60",
    "bg-[radial-gradient(95%_85%_at_84%_92%,rgba(255,186,112,0.5),rgba(255,168,86,0.16)_42%,transparent_70%)] mix-blend-soft-light",
    "bg-[radial-gradient(112%_112%_at_50%_46%,transparent_40%,rgba(4,12,24,0.34)_100%)]",
  ],
} as const

function CinematicGrade({ variant }: { variant: keyof typeof GRADE_LAYERS }) {
  return (
    <>
      {GRADE_LAYERS[variant].map((layer) => (
        <div
          key={layer}
          className={cn("pointer-events-none absolute inset-0", layer)}
          aria-hidden
        />
      ))}
    </>
  )
}

// The hero is the only eager image: it carries LCP. Everything below the fold
// stays lazy so the grid never competes with it for bandwidth. No preload link
// is injected here on purpose — with `srcSet` in play a preload that doesn't
// match the chosen variant byte-for-byte costs a second download.
export function SolarTurbineGalleryPage() {
  const { t, language } = useLanguage()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = `${t("flagshipPage.gallery.solarHeroTitle")} | HAL Offshore`
    return () => {
      document.title = "HAL Offshore"
    }
  }, [t])

  const dir = language === "ar" ? "rtl" : "ltr"

  return (
    <div className="bg-background text-foreground" dir={dir}>
      <main>
        <section className={STANDARD_PAGE_HERO_SECTION_CLASS}>
          <SolarTurbinePicture
            index={SOLAR_TURBINE_HERO_IMAGE}
            alt=""
            sizes={SOLAR_TURBINE_HERO_SIZES}
            maxWidth={SOLAR_TURBINE_HERO_MAX_WIDTH}
            priority
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center [filter:contrast(1.06)_saturate(1.02)]"
          />
          <CinematicGrade variant="hero" />

          <StandardPageHeroInset
            crumbs={[
              { to: "/businesses", label: t("offshoreEpc.heroKicker") },
              { to: "/businesses/flagship-projects", label: t("flagshipPage.pageTitle") },
              { label: t("flagshipPage.gallery.solarShortTitle") },
            ]}
            title={t("flagshipPage.gallery.solarHeroTitle")}
          />
        </section>

        <section className="relative border-t border-neutral-200 bg-white py-10 sm:py-12 md:py-14">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <motion.div {...fadeUp} transition={{ duration: 0.55 }} className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#001F3F]">
                {t("flagshipPage.solar.caseKicker")}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-[2.125rem] md:text-[2.5rem] md:leading-[1.15]">
                {t("flagshipPage.solar.caseTitle")}
              </h2>
              <span
                className="mt-6 inline-block h-[3px] w-14 rounded-full bg-[#001F3F]"
                aria-hidden
              />
              <div className="mt-7">
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                  {t("flagshipPage.solar.scopeLabel")}
                </h3>
                <p className="mt-3 text-[0.975rem] leading-relaxed text-neutral-700 sm:text-base">
                  {t("flagshipPage.solar.scopeBody")}
                </p>
                <ul className="mt-5 space-y-3 text-[0.975rem] leading-relaxed text-neutral-700 sm:text-base">
                  {SOLAR_TURBINE_SCOPE_KEYS.map((key) => (
                    <li key={key} className="flex gap-2.5">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#001F3F]/55"
                        aria-hidden
                      />
                      <span className="text-pretty">{t(key)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="relative border-t border-neutral-200 bg-gradient-to-b from-neutral-50 to-white py-10 sm:py-12 md:py-14">
          <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
            <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
              {SOLAR_TURBINE_GALLERY_IMAGES.map((index, i) => (
                <motion.figure
                  key={index}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: (i % 2) * 0.06 }}
                  className="group relative overflow-hidden rounded-2xl bg-neutral-900 shadow-xl shadow-black/[0.14] ring-1 ring-black/[0.06] transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/[0.22] md:col-span-2 md:max-w-4xl md:justify-self-center"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                    <SolarTurbinePicture
                      index={index}
                      alt={`${t("flagshipPage.case.solar.alt")} — ${i + 1}`}
                      sizes={SOLAR_TURBINE_GRID_SIZES}
                      priority={i < 2}
                      className="h-full w-full object-cover transition-[transform,filter] duration-700 ease-out [filter:contrast(1.1)_saturate(1.04)_brightness(1.02)] group-hover:scale-[1.04] group-hover:[filter:contrast(1.16)_saturate(1.12)_brightness(1.04)]"
                    />
                    <CinematicGrade variant="card" />
                    <div
                      className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10"
                      aria-hidden
                    />
                  </div>
                </motion.figure>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
