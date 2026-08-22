import { Link } from "react-router"
import { Anchor, ArrowRight, Building2 } from "lucide-react"
import { useLanguage } from "../components/language-context"
import { Reveal } from "../components/reveal"

const offerings = [
  {
    id: "offshore",
    to: "/businesses/offshore-epc",
    image: "/images/sister-company/seamec.webp?v=3",
    imagePosition: "object-[62%_45%]",
    width: 2928,
    height: 1218,
    icon: Anchor,
    titleKey: "homeBusinesses.offshoreTitle",
    descriptionKey: "homeBusinesses.offshoreDesc",
  },
  {
    id: "onshore",
    to: "/businesses/onshore-epc",
    image: "/images/onshore-projects/linch-redevelopment-1.webp",
    imagePosition: "object-center",
    width: 1672,
    height: 941,
    icon: Building2,
    titleKey: "homeBusinesses.onshoreTitle",
    descriptionKey: "homeBusinesses.onshoreDesc",
  },
] as const

export function HomeBusinesses() {
  const { t } = useLanguage()

  return (
    <section id="businesses" className="relative overflow-hidden bg-[#001F3F] py-12 md:py-16">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal y={24} className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
          <p className="text-[#FFCA23] font-semibold uppercase tracking-wider mb-2">
            {t("homeBusinesses.kicker")}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            {t("homeBusinesses.title")}
          </h2>
          <p className="text-white/70 mt-4 text-lg leading-relaxed">{t("homeBusinesses.subtitle")}</p>
          <Link
            to="/businesses"
            className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-white hover:text-white/80 transition-colors"
          >
            {t("homeBusinesses.viewAll")}
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {offerings.map((item, index) => {
            const Icon = item.icon
            return (
            <Reveal
              key={item.id}
              y={32}
              delay={index * 80}
              className="h-full"
            >
              <article className="h-full">
                <Link
                  to={item.to}
                  className="group flex flex-col h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-xl shadow-black/20 transition-all duration-300 hover:border-[#FFCA23]/40 hover:bg-white/[0.09]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={item.image}
                      alt=""
                      width={item.width}
                      height={item.height}
                      loading="lazy"
                      decoding="async"
                      className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${item.imagePosition}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001F3F]/90 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFCA23] text-[#001F3F]">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#FFCA23] transition-colors">
                      {t(item.titleKey)}
                    </h3>
                    <p className="mt-3 text-white/65 leading-relaxed flex-1">{t(item.descriptionKey)}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#FFCA23]">
                      {t("homeBusinesses.explore")}
                      <ArrowRight
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                        aria-hidden
                      />
                    </span>
                  </div>
                </Link>
              </article>
            </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
