import { useState } from "react"
import { Link } from "react-router"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { onshoreOfferingCards } from "./content"
import { useLanguage } from "../../components/language-context"
import { resolveOnshoreOffering } from "../../lib/resolve-translated-content"

function publicImagePath(file: string): string {
  const base = import.meta.env.BASE_URL
  const path = file.replace(/^\//, "")
  if (base === "./" || base === ".") return `/${path}`
  return base.endsWith("/") ? `${base}${path}` : `${base}/${path}`
}

const SECTION_BG = publicImagePath("images/hal-5.webp")

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
}

interface OnshoreOfferingsSectionProps {
  t: (key: string) => string
}

export function OnshoreOfferingsSection({ t }: OnshoreOfferingsSectionProps) {
  const { strings } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const active =
    openIndex !== null
      ? resolveOnshoreOffering(openIndex, onshoreOfferingCards[openIndex].image, t, strings)
      : null

  return (
    <section className="relative overflow-hidden border-t border-neutral-200 py-14 sm:py-12 md:py-14">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <img
          src={SECTION_BG}
          alt=""
          className="absolute inset-0 h-full w-full scale-[1.08] object-cover object-center blur-md sm:blur-lg"
          decoding="async"
        />
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-b from-white/[0.97] via-white/92 to-neutral-50/[0.96]"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[#001F3F]/5" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6">
        <motion.div {...fadeUp} transition={{ duration: 0.45 }} className="mb-12 md:mb-14">
          <div className="mx-auto max-w-4xl rounded-2xl border border-neutral-200/90 bg-white px-6 py-8 text-center shadow-md shadow-black/[0.07] ring-1 ring-black/[0.05] backdrop-blur-sm sm:px-8 md:px-10 md:py-10">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl md:text-[2.25rem]">
              {t("onshoreEpc.offeringsSectionTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-neutral-800 md:text-lg md:leading-relaxed">
              {t("onshoreEpc.offeringsGridLead")}
            </p>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {onshoreOfferingCards.map((card, i) => {
            const offering = resolveOnshoreOffering(i, card.image, t, strings)
            return (
            <motion.div
              key={card.image}
              {...fadeUp}
              transition={{ duration: 0.38, delay: i * 0.04 }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                className="group relative aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-none border border-neutral-200/90 bg-neutral-200 text-left shadow-sm ring-1 ring-black/[0.04] transition-shadow duration-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#001F3F] focus-visible:ring-offset-2"
              >
                <img
                  src={publicImagePath(`images/${card.image}`)}
                  alt={offering.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  loading={i < 3 ? "eager" : "lazy"}
                  decoding="async"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent"
                  aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                    {t("onshoreEpc.offeringCardKicker")}
                  </p>
                  <p className="mt-2 text-lg font-semibold leading-snug text-white sm:text-xl">
                    {offering.title}
                  </p>
                </div>
              </button>
            </motion.div>
            )
          })}
        </div>

        <Dialog open={openIndex !== null} onOpenChange={(o) => !o && setOpenIndex(null)}>
          <DialogContent className="max-w-lg sm:max-w-lg" showCloseButton>
            {active ? (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl text-neutral-900">{active.title}</DialogTitle>
                  <DialogDescription className="text-base leading-relaxed text-neutral-700">
                    {active.detail}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end border-t border-neutral-200 pt-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center bg-[#001F3F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#001F3F]/90"
                  >
                    {t("offshoreEpc.offeringDialogCta")}
                  </Link>
                </div>
              </>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
