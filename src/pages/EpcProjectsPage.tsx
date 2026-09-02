import { useEffect } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "../components/language-context"
import {
  STANDARD_PAGE_HERO_SECTION_CLASS,
  StandardPageHeroInset,
} from "../components/standard-page-hero-inset"
import { Footer } from "../sections/footer"
import { offshoreEpcProjects } from "./offshore-epc/content"
import { onshoreEpcProjects } from "./onshore-epc/content"
import { OnshoreProjectCaseStudy } from "./onshore-epc/OnshoreProjectCaseStudy"
import {
  resolveOffshoreProject,
  resolveOnshoreProject,
} from "../lib/resolve-translated-content"

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

function cardBackgroundSrc(project: {
  cardBackground?: string
  gallery?: Array<{ src: string }>
}): string | null {
  if (project.cardBackground) {
    return project.cardBackground.includes("/")
      ? publicImagePath(project.cardBackground)
      : publicImagePath(`images/${project.cardBackground}`)
  }
  if (project.gallery?.[0]?.src) {
    return publicImagePath(`images/${project.gallery[0].src}`)
  }
  return null
}

const OFFSHORE_HERO = publicImagePath("images/main.webp")
const ONSHORE_HERO = publicImagePath("images/hal-5.webp")

export function OffshoreEpcProjectsPage() {
  return <EpcProjectsPage variant="offshore" />
}

export function OnshoreEpcProjectsPage() {
  return <EpcProjectsPage variant="onshore" />
}

function EpcProjectsPage({ variant }: { variant: "offshore" | "onshore" }) {
  const { t, language, strings } = useLanguage()
  const isOnshore = variant === "onshore"
  const ns = isOnshore ? "onshoreEpc" : "offshoreEpc"
  const dir = language === "ar" ? "rtl" : "ltr"

  useEffect(() => {
    document.title = `${t(`${ns}.pageTitle`)} | HAL Offshore`
    return () => {
      document.title = "HAL Offshore"
    }
  }, [ns, t])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [variant])

  const projects = isOnshore
    ? onshoreEpcProjects.map((project) => resolveOnshoreProject(project, t, strings))
    : offshoreEpcProjects.map((project) => resolveOffshoreProject(project, t, strings))

  return (
    <div className="bg-background text-foreground" dir={dir}>
      <main>
        <section className={STANDARD_PAGE_HERO_SECTION_CLASS}>
          <img
            src={isOnshore ? ONSHORE_HERO : OFFSHORE_HERO}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
            decoding="async"
            fetchPriority="high"
            sizes="100vw"
          />
          {isOnshore ? (
            <div className="absolute inset-0 bg-gradient-to-r from-[#001F3F]/90 via-[#001F3F]/68 to-black/35" />
          ) : (
            <>
              <div className="absolute inset-0 bg-[#030912]/50" aria-hidden />
              <div
                className="absolute inset-0 bg-gradient-to-b from-[#001F3F]/78 via-[#001F3F]/65 to-[#051020]/88"
                aria-hidden
              />
            </>
          )}

          <StandardPageHeroInset
            crumbs={[
              { to: "/", label: t("businesses.breadcrumb.home") },
              { label: t(`${ns}.pageTitle`) },
            ]}
            title={t(`${ns}.pageTitle`)}
          />
        </section>

        <section className="scroll-mt-28 border-t border-neutral-200 bg-white py-10 sm:py-12 md:py-14">
          <div className="mx-auto max-w-7xl px-5 sm:px-6">
            <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#001F3F]">
                {t(`${ns}.projects`)}
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-[1.75rem] md:text-3xl">
                {t(`${ns}.projectsTitle`)}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
                {t(`${ns}.projectsLead`)}
              </p>
            </motion.div>

            <div className="mt-10 space-y-6">
              {projects.map((project, i) => (
                <OnshoreProjectCaseStudy
                  key={project.id}
                  project={project}
                  pIdx={i}
                  cardBgSrc={cardBackgroundSrc(project)}
                  t={t}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
