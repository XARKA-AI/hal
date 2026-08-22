import { Fragment, type ReactNode } from "react"
import { Link } from "react-router"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

/** Outer hero band height — match Onshore EPC and keep in sync across pages. */
export const STANDARD_PAGE_HERO_SECTION_CLASS =
  "relative min-h-[min(50vh,560px)] overflow-hidden"

export type StandardHeroCrumb = { to?: string; label: string }

export function StandardPageHeroInset({
  crumbs,
  title,
  afterTitle,
  wrapperClassName = "",
}: {
  crumbs: StandardHeroCrumb[]
  title: ReactNode
  afterTitle?: ReactNode
  /** Appended to the max-w-6xl wrapper (e.g. tighter bottom padding before dense content). */
  wrapperClassName?: string
}) {
  return (
    <div
      className={cn(
        "relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28",
        wrapperClassName
      )}
    >
      <div className="max-w-3xl">
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-wrap items-center gap-1.5 text-sm sm:mb-8"
          aria-label="Breadcrumb"
        >
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1
            return (
              <Fragment key={`${c.label}-${i}`}>
                {i > 0 ? (
                  <ChevronRight
                    className="h-4 w-4 shrink-0 text-white/60 rtl:rotate-180"
                    aria-hidden
                  />
                ) : null}
                {isLast ? (
                  <span
                    className="font-semibold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.85)]"
                    aria-current="page"
                  >
                    {c.label}
                  </span>
                ) : (
                  <Link
                    to={c.to!}
                    className="font-medium text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.85)] transition-colors hover:text-white/80"
                  >
                    {c.label}
                  </Link>
                )}
              </Fragment>
            )
          })}
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h1 className="text-balance text-3xl font-bold tracking-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.75),0_1px_2px_rgba(0,0,0,0.9)] sm:text-4xl md:text-5xl">
            {title}
          </h1>
          {afterTitle}
        </motion.div>
      </div>
    </div>
  )
}
