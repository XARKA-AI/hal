import { ArrowUpRight, Ship } from "lucide-react"
import { useLanguage } from "../components/language-context"
import { Reveal } from "../components/reveal"

const SEAMEC_URL = "https://seamec.in/"

export function Fleet() {
  const { t } = useLanguage()

  return (
    <section id="fleet" className="relative overflow-hidden py-14 md:py-20">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/fleet-bg.webp"
          alt=""
          width={1672}
          height={941}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal y={30} className="mb-12 text-center md:mb-16">
          <p className="mb-3 font-semibold uppercase tracking-wider text-[#001F3F]">
            {t("fleet.kicker")}
          </p>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            {t("fleet.title")}
          </h2>
        </Reveal>

        <Reveal y={40}>
          <a
            href={SEAMEC_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid overflow-hidden rounded-2xl border border-border bg-background shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#001F3F]/30 hover:shadow-2xl lg:grid-cols-2"
          >
            <div className="relative h-72 overflow-hidden bg-[#0a4a6e] sm:h-96 lg:h-auto lg:min-h-[26rem]">
              <img
                src="/images/sister-company/seamec.webp?v=3"
                alt={t("fleet.sister.imageAlt")}
                width={2928}
                height={1218}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-[62%_45%] transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 flex items-center gap-4 text-white lg:bottom-8 lg:left-8">
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#FFCA23] text-[#001F3F] shadow-lg sm:h-16 sm:w-16">
                  <Ship className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />
                </span>
                <div className="drop-shadow-md">
                  <p className="text-base font-semibold uppercase tracking-wider text-white/95 sm:text-lg">
                    {t("fleet.sister.badge")}
                  </p>
                  <p className="text-2xl font-bold sm:text-3xl md:text-4xl">{t("fleet.sister.name")}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <h3 className="text-2xl font-bold text-foreground md:text-3xl">
                {t("fleet.sister.headline")}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                {t("fleet.sister.body")}
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-foreground/80 md:text-base">
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#001F3F]" aria-hidden />
                  {t("fleet.sister.point1")}
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#001F3F]" aria-hidden />
                  {t("fleet.sister.point2")}
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#001F3F]" aria-hidden />
                  {t("fleet.sister.point3")}
                </li>
              </ul>
              <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-[#001F3F] px-5 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-[#FFCA23] group-hover:text-[#001F3F]">
                {t("fleet.sister.cta")}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </span>
            </div>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
