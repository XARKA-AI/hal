import { Phone, Mail } from "lucide-react"
import { useLanguage } from "../components/language-context"
import { LazySectionBackground } from "../components/lazy-section-background"
import { Reveal } from "../components/reveal"

export function CTA() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden bg-[#001F3F] py-14 sm:py-10 md:py-16">
      <LazySectionBackground src="/images/hero-2.webp" />
      <div className="absolute inset-0 bg-[#001F3F]/90" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center md:max-w-none">
          <Reveal y={30}>
            <h2 className="mb-8 text-balance text-2xl font-bold leading-tight text-white sm:mb-9 sm:text-3xl md:mb-10 md:text-4xl lg:text-5xl">
              {t("cta.title")}
            </h2>
          </Reveal>

          <Reveal y={30} delay={200} className="mx-auto w-full max-w-md md:max-w-none">
            <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45 md:mb-3">
              {t("cta.direct")}
            </p>
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.07] md:flex md:items-center md:justify-center md:gap-6 md:overflow-visible md:rounded-none md:border-0 md:bg-transparent">
              <a
                href="mailto:info@haloffshore.com"
                className="flex min-h-[3.25rem] items-center gap-3 px-4 py-3.5 text-start text-sm text-white/85 transition-colors hover:bg-white/10 hover:text-[#FFCA23] active:bg-white/[0.12] md:min-h-0 md:rounded-lg md:px-3 md:py-2 md:hover:bg-white/5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FFCA23]/20 text-[#FFCA23] md:h-9 md:w-9">
                  <Mail className="h-4 w-4 md:h-[1.125rem] md:w-[1.125rem]" aria-hidden />
                </span>
                <span className="min-w-0 break-all font-medium leading-snug">{t("footer.email")}</span>
              </a>
              <div className="h-px bg-white/10 md:hidden" aria-hidden />
              <div className="hidden md:block h-10 w-px shrink-0 bg-white/20" aria-hidden />
              <a
                href="tel:+912242369200"
                className="flex min-h-[3.25rem] items-center gap-3 px-4 py-3.5 text-start text-sm text-white/85 transition-colors hover:bg-white/10 hover:text-[#FFCA23] active:bg-white/[0.12] md:min-h-0 md:rounded-lg md:px-3 md:py-2 md:hover:bg-white/5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FFCA23]/20 text-[#FFCA23] md:h-9 md:w-9">
                  <Phone className="h-4 w-4 md:h-[1.125rem] md:w-[1.125rem]" aria-hidden />
                </span>
                <span className="font-medium tabular-nums leading-snug">{t("footer.phone")}</span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
