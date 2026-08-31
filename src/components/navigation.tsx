import { useState, useEffect } from "react"
import { Menu, X, Globe, ChevronDown } from "lucide-react"
import { Link, useLocation } from "react-router"
import type { To } from "react-router"
import { useLanguage } from "./language-context"

function getNavItemActive(item: NavItemDef, pathname: string, hash: string): boolean {
  if (item.isActive) return item.isActive(pathname, hash)

  const childActive =
    item.children?.some((child) => isNavChildActive(child.to, pathname, hash)) ?? false
  const base = item.href.replace(/\/$/, "")
  return pathname === base || pathname.startsWith(`${base}/`) || childActive
}

interface NavItemDef {
  labelKey: string
  href: string
  children?: { labelKey: string; to: To; noteKey?: string }[]
  isActive?: (pathname: string, hash: string) => boolean
}

const navItems: NavItemDef[] = [
  {
    labelKey: "nav.aboutUs",
    href: "/about",
    children: [
      { labelKey: "nav.about.overview", to: { pathname: "/about", hash: "#overview" } },
      { labelKey: "nav.about.company", to: { pathname: "/about", hash: "#company" } },
      { labelKey: "nav.about.subsidiaries", to: { pathname: "/about", hash: "#subsidiaries" } },
      { labelKey: "nav.about.chairman", to: { pathname: "/about", hash: "#chairman" } },
      { labelKey: "nav.about.viceChairman", to: { pathname: "/about", hash: "#vice-chairman" } },
      { labelKey: "nav.about.ceo", to: { pathname: "/about", hash: "#ceo" } },
      { labelKey: "nav.about.journey", to: { pathname: "/about", hash: "#journey" } },
      { labelKey: "nav.about.milestones", to: { pathname: "/about", hash: "#milestones" } },
      {
        labelKey: "nav.about.hse",
        to: { pathname: "/about", hash: "#hse" },
        noteKey: "nav.about.hseNote",
      },
      { labelKey: "nav.about.management", to: { pathname: "/about", hash: "#management" } },
    ],
  },
  {
    labelKey: "nav.businesses",
    href: "/businesses",
    isActive: (pathname) =>
      pathname === "/businesses" ||
      pathname === "/businesses/offshore-epc" ||
      pathname === "/businesses/onshore-epc" ||
      pathname === "/businesses/upstream-oil-gas" ||
      pathname.startsWith("/businesses/offshore-epc/") ||
      pathname.startsWith("/businesses/onshore-epc/") ||
      pathname.startsWith("/businesses/upstream-oil-gas/"),
    children: [
      { labelKey: "nav.businesses.offshore", to: "/businesses/offshore-epc" },
      { labelKey: "nav.businesses.onshore", to: "/businesses/onshore-epc" },
    ],
  },
  {
    labelKey: "nav.projectsLabel",
    href: "/businesses",
    isActive: (pathname) =>
      pathname === "/businesses/flagship-projects" ||
      pathname === "/businesses/boo-om" ||
      pathname === "/businesses/bot" ||
      pathname === "/businesses/om" ||
      pathname === "/businesses/green-energy" ||
      pathname.startsWith("/businesses/flagship-projects/") ||
      pathname.startsWith("/businesses/boo-om/") ||
      pathname.startsWith("/businesses/green-energy/"),
    children: [
      {
        labelKey: "nav.projects.flagship",
        to: "/businesses/flagship-projects",
        noteKey: "nav.projects.flagshipNote",
      },
      { labelKey: "nav.projects.offshoreEpc", to: "/businesses/offshore-epc" },
      { labelKey: "nav.projects.onshoreEpc", to: "/businesses/onshore-epc" },
      {
        labelKey: "nav.projects.booOm",
        to: "/businesses/boo-om",
        noteKey: "nav.projects.booOmNote",
      },
      { labelKey: "nav.projects.greenEnergy", to: "/businesses/green-energy" },
    ],
  },
  { labelKey: "nav.careers", href: "/careers" },
  { labelKey: "nav.contact", href: "/contact" },
]

function isNavChildActive(to: To, pathname: string, hash: string): boolean {
  if (typeof to === "string") {
    const i = to.indexOf("#")
    if (i >= 0) {
      const path = to.slice(0, i)
      const frag = to.slice(i)
      return pathname === path && hash === frag
    }
    return pathname === to || pathname.startsWith(`${to}/`)
  }
  const path = to.pathname ?? ""
  const frag = to.hash
  if (frag) {
    return pathname === path && hash === frag
  }
  return pathname === path || pathname.startsWith(`${path}/`)
}

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "हिंदी", flag: "🇮🇳" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > 50,
  )
  const [isOpen, setIsOpen] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null)
  const { language, setLanguage, t } = useLanguage()
  const location = useLocation()

  useEffect(() => {
    let frame = 0
    let lastScrolled = window.scrollY > 50
    const handleScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const next = window.scrollY > 50
        if (next !== lastScrolled) {
          lastScrolled = next
          setIsScrolled(next)
        }
      })
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsOpen(false)
      setOpenMobileMenu(null)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [location.pathname, location.hash])

  const onHomeHero = location.pathname === "/" && !isScrolled

  return (
    <header
      className={`nav-header-enter fixed inset-x-0 top-0 z-50 w-full ${
        onHomeHero
          ? "border-transparent bg-transparent shadow-none"
          : "border-b border-neutral-200/70 bg-white/95 shadow-md backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 lg:h-18">
          <div className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <Link to="/" className="inline-flex shrink-0 items-center">
              <img
                src="/images/hal-offshore-logo.webp"
                alt="HAL Offshore Ltd"
                className="h-11 w-auto max-w-[min(13rem,48vw)] object-contain object-left lg:h-12"
                width={256}
                height={69}
                loading="eager"
                decoding="async"
              />
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.labelKey}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.labelKey)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.href}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-bold transition-colors duration-200 ${
                    onHomeHero
                      ? getNavItemActive(item, location.pathname, location.hash)
                        ? "text-[#FFCA23]"
                        : "text-white/90 hover:text-white"
                      : getNavItemActive(item, location.pathname, location.hash)
                        ? "text-[#001F3F]"
                        : "text-neutral-800 hover:text-black"
                  }`}
                >
                  {t(item.labelKey)}
                  {item.children && <ChevronDown className="w-3.5 h-3.5 rtl:scale-x-[-1]" />}
                </Link>

                {item.children && activeDropdown === item.labelKey ? (
                  <div className="absolute top-full left-0 z-50 pt-1">
                    <div className="nav-dropdown-enter w-72 max-w-[calc(100vw-2rem)] bg-white border border-neutral-200 rounded-xl shadow-xl overflow-hidden">
                      {item.children.map((child, i) => (
                        <Link
                          key={i}
                          to={child.to}
                          className="flex flex-col px-4 py-3 hover:bg-neutral-50 hover:text-[#001F3F] text-neutral-800 transition-colors border-b border-neutral-100 last:border-0"
                        >
                          <span className="text-sm font-bold">{t(child.labelKey)}</span>
                          {child.noteKey && (
                            <span className="text-xs text-neutral-500 mt-0.5">{t(child.noteKey)}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                  onHomeHero
                    ? "text-white/90 hover:text-white"
                    : "text-neutral-800 hover:text-black"
                }`}
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase font-medium">{language}</span>
              </button>
              {showLangMenu ? (
                <div className="absolute top-full right-0 z-50 pt-2">
                  <div className="nav-dropdown-enter w-40 bg-white border border-neutral-200 rounded-xl shadow-xl overflow-hidden">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as "en" | "hi" | "ar")
                        setShowLangMenu(false)
                      }}
                      className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 hover:bg-neutral-50 transition-colors ${
                        language === lang.code ? "text-[#001F3F] font-semibold" : "text-neutral-700 hover:text-black"
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/contact"
                className="text-sm font-semibold px-5 py-2.5 bg-[#FFCA23] text-[#001F3F] rounded-md hover:bg-[#E6B51E] transition-all hover:scale-105 active:scale-95 duration-200"
              >
                {t("nav.getInTouch")}
              </Link>
              <a
                href="https://www.mmgindia.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 transition-transform hover:scale-105 active:scale-95"
                aria-label="MM Agrawal Group"
              >
                <img
                  src="/images/mm-agrawal-group-logo.webp"
                  srcSet="/images/mm-agrawal-group-logo.webp 265w, /images/mm-agrawal-group-logo@2x.webp 442w"
                  sizes="(min-width: 1024px) 12rem, 28vw"
                  alt="MM Agrawal Group"
                  className="h-10 w-auto max-w-[min(12rem,28vw)] rounded-md object-contain object-right"
                  width={265}
                  height={96}
                  decoding="async"
                />
              </a>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 bg-transparent shadow-none ring-0 outline-none ${onHomeHero ? "text-white" : "text-neutral-900"}`}
            aria-label={t("nav.toggleMenu")}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {isOpen ? (
          <div className="nav-mobile-panel lg:hidden overflow-hidden border-t border-neutral-200 bg-white/95 backdrop-blur-xl">
            <div className="px-2 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div
                role="dialog"
                aria-label={t("nav.toggleMenu")}
                className="nav-mobile-dialog rounded-2xl border border-white/50 bg-white/[0.94] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl overflow-hidden"
              >
                <div className="divide-y divide-neutral-200/90">
                  {navItems.map((item) => {
                    const itemActive = getNavItemActive(
                      item,
                      location.pathname,
                      location.hash,
                    )
                    return (
                      <div key={item.labelKey}>
                        {item.children ? (
                          <div>
                            <button
                              type="button"
                              aria-expanded={openMobileMenu === item.labelKey}
                              onClick={() =>
                                setOpenMobileMenu(
                                  openMobileMenu === item.labelKey ? null : item.labelKey,
                                )
                              }
                              className={`w-full min-h-[3rem] flex items-center justify-between gap-3 px-4 py-3.5 text-left text-base font-medium text-neutral-900 transition-colors active:bg-neutral-100/80 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001F3F]/50 focus-visible:ring-inset ${
                                itemActive ? "bg-[#001F3F]/10" : ""
                              }`}
                            >
                              <span className="flex items-center gap-2 min-w-0">
                                {itemActive ? (
                                  <span
                                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#001F3F]"
                                    aria-hidden
                                  />
                                ) : null}
                                <span className="truncate">{t(item.labelKey)}</span>
                              </span>
                              <ChevronDown
                                className={`w-[1.125rem] h-[1.125rem] shrink-0 text-neutral-500 transition-transform duration-200 ${
                                  openMobileMenu === item.labelKey ? "rotate-180" : ""
                                }`}
                                aria-hidden
                              />
                            </button>
                            <div
                              className="nav-mobile-accordion"
                              data-open={openMobileMenu === item.labelKey ? "true" : "false"}
                            >
                              <div>
                                <div className="overflow-hidden border-t border-neutral-200/80 bg-neutral-50/80">
                                  <div className="mx-3 my-2 rounded-xl border-l-[3px] border-[#001F3F] bg-white/90 py-1 shadow-sm">
                                    {item.children.map((child, i) => {
                                      const childActive = isNavChildActive(
                                        child.to,
                                        location.pathname,
                                        location.hash,
                                      )
                                      return (
                                        <Link
                                          key={i}
                                          to={child.to}
                                          className={`flex flex-col gap-0.5 px-4 py-3 pl-4 border-b border-neutral-100 last:border-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#001F3F]/40 ${
                                            childActive
                                              ? "bg-[#001F3F]/10 text-[#001F3F]"
                                              : "text-neutral-800 hover:bg-neutral-50 active:bg-neutral-100"
                                          }`}
                                        >
                                          <span
                                            className={`text-sm font-medium leading-snug ${
                                              childActive ? "text-[#001F3F]" : ""
                                            }`}
                                          >
                                            {t(child.labelKey)}
                                          </span>
                                          {child.noteKey ? (
                                            <span className="text-xs text-neutral-500 leading-snug">
                                              {t(child.noteKey)}
                                            </span>
                                          ) : null}
                                        </Link>
                                      )
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Link
                            to={item.href}
                            className={`flex min-h-[3rem] items-center gap-2 px-4 py-3.5 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001F3F]/50 focus-visible:ring-inset active:bg-neutral-100/80 hover:bg-neutral-50 ${
                              itemActive
                                ? "bg-[#001F3F]/10 text-[#001F3F]"
                                : "text-neutral-900"
                            }`}
                          >
                            {itemActive ? (
                              <span
                                className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#001F3F]"
                                aria-hidden
                              />
                            ) : null}
                            <span>{t(item.labelKey)}</span>
                          </Link>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-neutral-200/90 bg-neutral-50/50 px-4 py-4 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-neutral-500" aria-hidden />
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                        {t("nav.language")}
                      </span>
                    </div>
                    <div
                      className="flex rounded-xl bg-neutral-200/60 p-1 gap-1"
                      role="group"
                      aria-label={t("nav.language")}
                    >
                      {languages.map((lang) => {
                        const active = language === lang.code
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => setLanguage(lang.code as "en" | "hi" | "ar")}
                            className={`flex-1 min-h-[2.75rem] rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001F3F]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                              active
                                ? "bg-white text-[#001F3F] shadow-sm ring-1 ring-black/[0.06]"
                                : "text-neutral-600 hover:text-neutral-900 hover:bg-white/50 active:scale-[0.98]"
                            }`}
                          >
                            <span className="block leading-tight">
                              <span className="text-base leading-none" aria-hidden>
                                {lang.flag}
                              </span>
                              <span className="mt-1 block text-[10px] font-bold uppercase tracking-wide opacity-90">
                                {lang.code}
                              </span>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <Link
                    to="/contact"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center rounded-xl bg-[#001F3F] px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-black/25 transition-colors hover:bg-[#001F3F]/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001F3F]/30 focus-visible:ring-offset-2"
                  >
                    {t("nav.getInTouch")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}
