import { Linkedin, Twitter, Facebook, Phone, Mail, MapPin } from "lucide-react"
import { Link } from "react-router"
import { useLanguage } from "../components/language-context"
import { Reveal } from "../components/reveal"

const companyLinkKeys = [
  { labelKey: "nav.home", to: "/" },
  { labelKey: "nav.about", to: "/about" },
  { labelKey: "footer.link.mission", to: "/about#mission" },
  { labelKey: "footer.link.policies", to: "/about#hse" },
  { labelKey: "footer.link.certificates", to: "/#certificates" },
  { labelKey: "nav.milestones", to: "/about#milestones" },
  { labelKey: "nav.fleet", to: "/#fleet" },
  { labelKey: "nav.contact", to: "/contact" },
] as const

const serviceLinkKeys = [
  { labelKey: "services.item1.title", to: "/#services" },
  { labelKey: "services.item2.title", to: "/#services" },
  { labelKey: "services.item3.title", to: "/#services" },
  { labelKey: "services.item4.title", to: "/#services" },
  { labelKey: "services.item5.title", to: "/#services" },
  { labelKey: "services.item6.title", to: "/#services" },
] as const

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer id="contact" className="relative overflow-hidden bg-[#001F3F] py-10 md:py-12">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <Reveal y={20} className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <span className="text-2xl font-bold text-white">HAL</span>
              <span className="text-xs font-medium tracking-[0.15em] uppercase text-[#FFCA23]">
                Offshore
              </span>
            </Link>
            <p className="text-white/60 max-w-md leading-relaxed mb-6">{t("footer.tagline")}</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#FFCA23] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-white/60">
                  {t("footer.addressLine1")}
                  <br />
                  {t("footer.addressLine2")}
                  <br />
                  {t("footer.addressLine3")}
                </p>
              </div>
              <a
                href="tel:+912242369200"
                className="flex items-center gap-3 text-sm text-white/60 hover:text-[#FFCA23] transition-colors"
              >
                <Phone className="w-5 h-5 text-[#FFCA23] flex-shrink-0" />
                {t("footer.phone")}
              </a>
              <a
                href="mailto:info@haloffshore.com"
                className="flex items-center gap-3 text-sm text-white/60 hover:text-[#FFCA23] transition-colors"
              >
                <Mail className="w-5 h-5 text-[#FFCA23] flex-shrink-0" />
                {t("footer.email")}
              </a>
            </div>

            <div className="flex items-center gap-3">
              {[
                { Icon: Facebook, label: "Facebook" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Linkedin, label: "LinkedIn" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white hover:bg-[#FFCA23] hover:text-[#001F3F] hover:scale-110 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal y={20} delay={100}>
            <p className="text-[#FFCA23] font-semibold uppercase tracking-wider mb-4">
              {t("footer.usefulLinks")}
            </p>
            <ul className="space-y-3">
              {companyLinkKeys.map((link) => (
                <li key={link.labelKey}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 hover:text-[#FFCA23] transition-colors"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal y={20} delay={200}>
            <p className="text-[#FFCA23] font-semibold uppercase tracking-wider mb-4">
              {t("footer.servicesHeading")}
            </p>
            <ul className="space-y-3">
              {serviceLinkKeys.map((link) => (
                <li key={link.labelKey}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 hover:text-[#FFCA23] transition-colors"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={300} className="pt-8 pb-[max(0.5rem,env(safe-area-inset-bottom))] border-t border-white/10">
          <div className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-5 backdrop-blur-sm md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
            <div className="flex flex-col items-center text-center gap-4 md:flex-row md:items-start md:justify-between md:text-left md:gap-6">
              <p className="text-sm leading-relaxed text-white/65 max-w-prose">
                © {new Date().getFullYear()} HAL Offshore. {t("footer.copyright")}
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-white/50 max-w-md md:max-w-sm">
                <span className="text-white/40">{t("footer.designedBy")}</span>
                <br className="md:hidden" />
                <span>
                  {" "}
                  <a
                    href="https://www.xarka.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#FFCA23] underline decoration-[#FFCA23]/40 underline-offset-2 hover:text-[#FFCA23] hover:decoration-[#FFCA23]/60 transition-colors break-words"
                  >
                    XARKA AI TECHNOLOGIES PRIVATE LIMITED
                  </a>
                </span>
              </p>
            </div>

            <nav
              aria-label="Legal"
              className="mt-5 flex flex-col gap-1 border-t border-white/10 pt-5 md:mt-6 md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-0 md:border-t md:pt-6"
            >
              <a
                href="#"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-[#FFCA23] active:bg-white/[0.12] md:min-h-0 md:w-auto md:rounded-none md:px-4 md:py-2 md:hover:bg-transparent"
              >
                {t("footer.privacy")}
              </a>
              <span className="hidden h-4 w-px shrink-0 bg-white/20 md:inline-block md:mx-1" aria-hidden />
              <a
                href="#"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-[#FFCA23] active:bg-white/[0.12] md:min-h-0 md:w-auto md:rounded-none md:px-4 md:py-2 md:hover:bg-transparent"
              >
                {t("footer.terms")}
              </a>
            </nav>
          </div>
        </Reveal>
      </div>
    </footer>
  )
}
