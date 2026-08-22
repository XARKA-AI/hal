import { useEffect } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "../../components/language-context"
import {
  STANDARD_PAGE_HERO_SECTION_CLASS,
  StandardPageHeroInset,
} from "../../components/standard-page-hero-inset"
import { Footer } from "../../sections/footer"
import {
  DCU_FEATURE_IMAGE,
  DCU_FEATURE_SIZES,
  DCU_GALLERY_IMAGES,
  DCU_GRID_SIZES,
  DCU_HERO_IMAGE,
  DCU_HERO_MAX_WIDTH,
  DCU_HERO_SIZES,
} from "./dcu-numaligarh-content"
import { DcuNumaligarhPicture } from "./DcuNumaligarhPicture"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
}

// The hero is the only eager image: it carries LCP. Everything below the fold
// stays lazy so the grid never competes with it for bandwidth. No preload link
// is injected here on purpose — with `srcSet` in play a preload that doesn't
// match the chosen variant byte-for-byte costs a second download.
// Title / description / canonical come from `SiteSeo`, which resolves them from
// `ROUTE_SEO` by pathname — the route is registered there, so no per-page
// override is needed.
export function DcuNumaligarhGalleryPage() {
  const { t, language } = useLanguage()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const dir = language === "ar" ? "rtl" : "ltr"

  return (
    <div className="bg-background text-foreground" dir={dir}>
      <main>
        <section className={STANDARD_PAGE_HERO_SECTION_CLASS}>
          <DcuNumaligarhPicture
            index={DCU_HERO_IMAGE}
            alt=""
            sizes={DCU_HERO_SIZES}
            maxWidth={DCU_HERO_MAX_WIDTH}
            priority
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#030912]/50" aria-hidden />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#001F3F]/78 via-[#001F3F]/62 to-[#051020]/88"
            aria-hidden
          />

          <StandardPageHeroInset
            crumbs={[
              { to: "/businesses", label: t("offshoreEpc.heroKicker") },
              { to: "/businesses/flagship-projects", label: t("flagshipPage.pageTitle") },
              { label: t("flagshipPage.gallery.dcuShortTitle") },
            ]}
            title={t("flagshipPage.gallery.dcuHeroTitle")}
          />
        </section>

        <section className="relative border-t border-neutral-200 bg-white py-10 sm:py-12 md:py-14">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="grid items-start gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.55 }}
                className="lg:col-span-7"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#001F3F]">
                  {t("flagshipPage.dcu.caseKicker")}
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-neutral-900 sm:text-[1.875rem] md:text-[2.125rem] md:leading-[1.2]">
                  {t("flagshipPage.dcu.caseTitle")}
                </h2>
                <span
                  className="mt-6 inline-block h-[3px] w-14 rounded-full bg-[#001F3F]"
                  aria-hidden
                />
                <div className="mt-7">
                  <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                    {t("flagshipPage.dcu.natureLabel")}
                  </h3>
                  <p className="mt-3 text-[0.975rem] leading-relaxed text-neutral-700 sm:text-base">
                    {t("flagshipPage.dcu.natureBody")}
                  </p>
                </div>
                <div className="mt-7">
                  <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                    {t("flagshipPage.dcu.scopeLabel")}
                  </h3>
                  <p className="mt-3 text-[0.975rem] leading-relaxed text-neutral-700 sm:text-base">
                    {t("flagshipPage.dcu.scopeBody")}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6 }}
                className="relative lg:col-span-5"
              >
                <div
                  className="absolute -bottom-4 -right-4 hidden h-full w-full rounded-2xl border-2 border-[#001F3F]/35 lg:block"
                  aria-hidden
                />
                <div className="relative overflow-hidden rounded-2xl shadow-[0_24px_50px_-12px_rgba(0,0,0,0.25)] ring-1 ring-black/[0.06]">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900 sm:aspect-[3/4] lg:aspect-[4/5]">
                    <DcuNumaligarhPicture
                      index={DCU_FEATURE_IMAGE}
                      alt={t("flagshipPage.gallery.dcuAlt")}
                      sizes={DCU_FEATURE_SIZES}
                      className="h-full w-full object-cover [filter:contrast(1.1)_saturate(1.18)_brightness(1.02)]"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.16),transparent_55%)] mix-blend-overlay"
                      aria-hidden
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent"
                      aria-hidden
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 z-10 px-5 pb-5 pt-12">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
                        {t("detail.gallery.inFocus")}
                      </p>
                      <p className="mt-1 text-sm font-semibold leading-snug text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.6)] sm:text-base">
                        {t("flagshipPage.dcu.featureImageCaption")}
                      </p>
                    </figcaption>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="relative border-t border-neutral-200 bg-gradient-to-b from-neutral-50 to-white py-10 sm:py-12 md:py-14">
          <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
            <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#001F3F]">
                {t("flagshipPage.dcu.photosKicker")}
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-[1.75rem] md:text-3xl">
                {t("flagshipPage.dcu.photosTitle")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 md:text-base">
                {t("flagshipPage.dcu.photosLead")}
              </p>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
              {DCU_GALLERY_IMAGES.map((index, i) => (
                <motion.figure
                  key={index}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: (i % 2) * 0.06 }}
                  className="group relative overflow-hidden rounded-2xl bg-neutral-900 shadow-xl shadow-black/[0.14] ring-1 ring-black/[0.06] transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/[0.22]"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                    <DcuNumaligarhPicture
                      index={index}
                      alt={`${t("flagshipPage.gallery.dcuAlt")} — ${i + 1}`}
                      sizes={DCU_GRID_SIZES}
                      className="h-full w-full object-cover transition-[transform,filter] duration-700 ease-out [filter:contrast(1.12)_saturate(1.2)_brightness(1.03)] group-hover:scale-[1.04] group-hover:[filter:contrast(1.2)_saturate(1.32)_brightness(1.05)]"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.2),transparent_55%)] mix-blend-overlay"
                      aria-hidden
                    />
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
