import {
  Wrench,
  ShoppingCart,
  HardHat,
  ClipboardList,
  Anchor,
  Settings2,
} from "lucide-react"
import { useLanguage } from "../components/language-context"
import { LazySectionBackground } from "../components/lazy-section-background"
import { Reveal } from "../components/reveal"

const services = [
  {
    icon: Wrench,
    titleKey: "services.item1.title",
    image: "/images/services/engineering.webp",
    width: 700,
    height: 490,
  },
  {
    icon: ShoppingCart,
    titleKey: "services.item2.title",
    image: "/images/services/procurement.webp",
    width: 700,
    height: 700,
  },
  {
    icon: HardHat,
    titleKey: "services.item3.title",
    image: "/images/services/construction.webp",
    width: 960,
    height: 700,
  },
  {
    icon: ClipboardList,
    titleKey: "services.item4.title",
    image: "/images/services/project-management.webp",
    width: 960,
    height: 640,
  },
  {
    icon: Anchor,
    titleKey: "services.item5.title",
    image: "/images/services/installation.webp",
    width: 736,
    height: 1025,
  },
  {
    icon: Settings2,
    titleKey: "services.item6.title",
    image: "/images/services/om.webp",
    width: 1140,
    height: 640,
  },
] as const

export function Services() {
  const { t } = useLanguage()

  return (
    <section id="services" className="py-12 md:py-16 relative overflow-hidden bg-[#001F3F]">
      <LazySectionBackground src="/images/hero-4.webp" />
      <div className="absolute inset-0 bg-[#001F3F]/85" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal y={30} className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t("services.title")}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">{t("services.subtitle")}</p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Reveal
              key={service.titleKey}
              y={40}
              delay={index * 80}
              className="group overflow-hidden rounded-2xl border border-white/50 bg-white shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/15"
            >
              <div className="relative h-56 overflow-hidden sm:h-64">
                <img
                  src={service.image}
                  alt={t(service.titleKey)}
                  width={service.width}
                  height={service.height}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent" />
                <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#001F3F] text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                  <service.icon className="h-5 w-5" aria-hidden />
                </div>
              </div>

              <div className="px-5 py-4">
                <h3 className="text-lg font-bold text-neutral-900">{t(service.titleKey)}</h3>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
