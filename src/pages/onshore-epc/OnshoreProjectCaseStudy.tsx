import { useId, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, ClipboardList, Sparkles, Trophy } from "lucide-react"
import type { OnshoreEpcProject } from "./content"

function publicImagePath(file: string): string {
  const base = import.meta.env.BASE_URL
  const path = file.replace(/^\//, "")
  if (base === "./" || base === ".") return `/${path}`
  return base.endsWith("/") ? `${base}${path}` : `${base}/${path}`
}

function ListBlock({
  title,
  icon: Icon,
  items,
}: {
  title: string
  icon: typeof ClipboardList
  items: string[]
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-600">
          {title}
        </h4>
      </div>
      <ul className="space-y-3 text-sm leading-relaxed text-neutral-700 sm:text-[0.9375rem]">
        {items.map((line, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" aria-hidden />
            <span className="text-pretty">{line}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
}

interface OnshoreProjectCaseStudyProps {
  project: Pick<OnshoreEpcProject, "id" | "index" | "title"> &
    Partial<Pick<OnshoreEpcProject, "meta" | "scope" | "highlights" | "achievements" | "stats" | "gallery">>
  pIdx: number
  cardBgSrc: string | null
  t: (key: string) => string
}

export function OnshoreProjectCaseStudy({ project, pIdx, cardBgSrc, t }: OnshoreProjectCaseStudyProps) {
  const panelId = useId()
  const [detailsOpen, setDetailsOpen] = useState(!cardBgSrc)

  const hasLists =
    (project.scope?.length ?? 0) > 0 ||
    (project.highlights?.length ?? 0) > 0 ||
    (project.achievements?.length ?? 0) > 0

  const expandedBody = (
    <>
      {project.stats && project.stats.length > 0 ? (
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {project.stats.map((s, si) => (
            <div
              key={si}
              className="rounded-lg border border-neutral-200/80 bg-white/95 px-3.5 py-3"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                {s.label}
              </p>
              <p className="mt-1 text-base font-semibold tabular-nums text-[#001F3F] sm:text-lg">
                {s.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {hasLists ? (
        <div
          className={`grid gap-4 lg:grid-cols-3 ${project.stats?.length ? "mt-6" : ""}`}
        >
          {project.scope?.length ? (
            <ListBlock title={t("offshoreEpc.scope")} icon={ClipboardList} items={project.scope} />
          ) : null}
          {project.highlights?.length ? (
            <ListBlock
              title={t("offshoreEpc.keyHighlights")}
              icon={Sparkles}
              items={project.highlights}
            />
          ) : null}
          {project.achievements?.length ? (
            <ListBlock
              title={t("offshoreEpc.achievements")}
              icon={Trophy}
              items={project.achievements}
            />
          ) : null}
        </div>
      ) : null}

      {project.gallery && project.gallery.length > 0 ? (
        <div className={project.stats?.length || hasLists ? "mt-6" : ""}>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-neutral-600">
            {t("onshoreEpc.projectPhotos")}
          </h4>
          <div
            className={`grid gap-3 sm:gap-4 ${
              project.gallery.length === 1
                ? "grid-cols-1"
                : project.gallery.length === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {project.gallery.map((photo) => (
              <figure
                key={photo.src}
                className="group relative overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-900 shadow-sm shadow-black/[0.06] ring-1 ring-black/[0.04]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                  <img
                    src={publicImagePath(`images/${photo.src}`)}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                    sizes={
                      project.gallery!.length === 1
                        ? "(min-width: 1024px) 1120px, 100vw"
                        : "(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                    }
                    className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.025]"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10"
                    aria-hidden
                  />
                </div>
              </figure>
            ))}
          </div>
        </div>
      ) : null}
    </>
  )

  return (
    <motion.article
      {...fadeUp}
      transition={{ duration: 0.5, delay: pIdx * 0.05 }}
      className="relative scroll-mt-28 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-md shadow-black/5"
      id={project.id}
    >
      {cardBgSrc ? (
        <>
          <button
            type="button"
            onClick={() => setDetailsOpen((o) => !o)}
            aria-expanded={detailsOpen}
            aria-controls={panelId}
            className="group relative block w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#001F3F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <img
              src={cardBgSrc}
              alt=""
              className="h-[min(52vw,260px)] w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04] sm:h-[min(48vw,300px)] md:h-[min(42vw,340px)]"
              decoding="async"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10"
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6 md:p-7">
              <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-base font-bold text-[#001F3F] shadow-lg sm:h-12 sm:w-12 sm:text-lg">
                  {project.index}
                </span>
                <div className="min-w-0 pt-0.5">
                  <h3 className="text-pretty text-base font-bold leading-snug text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.5)] sm:text-lg md:text-xl">
                    {project.title}
                  </h3>
                  {project.meta ? (
                    <p className="mt-1.5 line-clamp-2 text-xs font-medium text-white/85 sm:text-sm">
                      {project.meta}
                    </p>
                  ) : null}
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85 sm:text-xs">
                    {detailsOpen ? t("offshoreEpc.hideProjectDetails") : t("offshoreEpc.viewProjectDetails")}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-6 w-6 shrink-0 text-white transition-transform duration-300 ease-out sm:h-7 sm:w-7 ${
                  detailsOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              />
            </div>
          </button>

          <AnimatePresence initial={false}>
            {detailsOpen ? (
              <motion.div
                id={panelId}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden border-t border-neutral-200/90"
              >
                <div className="p-5 sm:p-7 md:p-8">{expandedBody}</div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </>
      ) : (
        <div className="relative z-10 p-5 sm:p-7 md:p-8">
          <div className="flex flex-col gap-4 border-b border-neutral-200/80 pb-5 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#001F3F] text-lg font-bold text-white">
                {project.index}
              </span>
              <div>
                <h3 className="text-lg font-bold leading-snug text-neutral-900 sm:text-xl md:text-2xl">
                  {project.title}
                </h3>
                {project.meta ? (
                  <p className="mt-1.5 text-sm font-medium text-neutral-500">{project.meta}</p>
                ) : null}
              </div>
            </div>
          </div>
          <div className="mt-6">{expandedBody}</div>
        </div>
      )}
    </motion.article>
  )
}
