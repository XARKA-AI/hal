import { useLanguage } from "../components/language-context"

type ClientLogo = {
  name: string
  logo: string
  width: number
  height: number
  /** compact circular / short marks use a square slot */
  compact?: boolean
}

const clients: ClientLogo[] = [
  { name: "GAIL", logo: "/images/hal_client/gail.webp?v=6", width: 212, height: 160 },
  { name: "Oil India Limited", logo: "/images/hal_client/oil-india.webp?v=6", width: 320, height: 98 },
  { name: "ONGC", logo: "/images/hal_client/ongc.webp?v=6", width: 160, height: 160, compact: true },
  { name: "Engineers India Limited", logo: "/images/hal_client/eil.webp?v=4", width: 160, height: 160, compact: true },
  { name: "IGGL", logo: "/images/hal_client/iggl.webp?v=4", width: 106, height: 160, compact: true },
  { name: "IndianOil", logo: "/images/hal_client/indian-oil.webp?v=5", width: 162, height: 200, compact: true },
  { name: "Tata", logo: "/images/hal_client/tata.webp?v=1", width: 182, height: 160, compact: true },
  { name: "Reliance Industries Limited", logo: "/images/hal_client/reliance.webp?v=1", width: 231, height: 160 },
  { name: "Vedanta", logo: "/images/hal_client/vedanta.webp?v=4", width: 744, height: 160 },
  { name: "NRL", logo: "/images/hal_client/nrl.webp?v=4", width: 160, height: 160, compact: true },
  { name: "NALCO", logo: "/images/hal_client/nalco.webp?v=4", width: 160, height: 160, compact: true },
  { name: "NTPC Vidyut Vyapar", logo: "/images/hal_client/ntpc.webp?v=4", width: 302, height: 160 },
  { name: "CPCL", logo: "/images/hal_client/cpcl.webp?v=4", width: 174, height: 160, compact: true },
  { name: "Haldia Petrochemicals", logo: "/images/hal_client/haldia.webp?v=4", width: 322, height: 160 },
]

const marqueeRow = [...clients, ...clients, ...clients]

export function Trust() {
  const { t } = useLanguage()

  return (
    <section className="border-y border-border bg-background py-10">
      <div className="mx-auto mb-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center font-semibold uppercase tracking-wider text-[#001F3F]">
          {t("trust.title")}
        </p>
      </div>

      {/*
        Horizontal-only clip. Extra vertical padding lives INSIDE the clip box
        so logos stay large without top/bottom cropping.
      */}
      <div className="relative w-full overflow-hidden" aria-label={t("trust.title")}>
        <div className="flex h-[7.5rem] w-max animate-[marquee_25s_linear_infinite] items-center gap-12 whitespace-nowrap px-4 md:h-36 md:gap-16">
          {marqueeRow.map((client, index) => (
            <div
              key={`${client.name}-${index}`}
              className={
                client.compact
                  ? "inline-flex h-20 w-20 shrink-0 items-center justify-center md:h-24 md:w-24"
                  : "inline-flex h-20 w-[10.5rem] shrink-0 items-center justify-center md:h-24 md:w-48"
              }
            >
              <img
                src={client.logo}
                alt={client.name}
                width={client.width}
                height={client.height}
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-full object-contain object-center"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
