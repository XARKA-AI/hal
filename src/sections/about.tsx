import { Award, Shield, Clock } from "lucide-react"
import { Link } from "react-router"
import { useLanguage } from "../components/language-context"
import { Reveal } from "../components/reveal"

const highlights = [
  { icon: Award, titleKey: "homeAbout.highlight1.title" },
  { icon: Shield, titleKey: "homeAbout.highlight2.title" },
  { icon: Clock, titleKey: "homeAbout.highlight3.title" },
] as const

export function About() {
  const { t } = useLanguage()

  return (
    <section id="about" className="relative overflow-hidden py-12 md:py-16">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/about-bg.webp"
          srcSet="/images/about-bg-768.webp 768w, /images/about-bg-1200.webp 1200w"
          sizes="100vw"
          alt=""
          width={1200}
          height={686}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 max-w-4xl mx-auto text-center">
          <Reveal y={30}>
            <h2 className="text-[#001F3F] font-semibold uppercase tracking-wider mb-6">
              {t("homeAbout.kicker")}
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed mb-8 text-left">
              {(["homeAbout.p1", "homeAbout.p2", "homeAbout.p3", "homeAbout.p4", "homeAbout.p5", "homeAbout.p6"] as const).map(
                (key) => (
                  <p key={key}>{t(key)}</p>
                ),
              )}
              <p>
                <Link
                  to="/about#mission"
                  className="font-semibold text-[#001F3F] underline-offset-4 transition-colors hover:underline"
                >
                  {t("homeAbout.missionLink")}
                </Link>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {highlights.map((item, index) => (
                <Reveal
                  key={item.titleKey}
                  x={-20}
                  y={0}
                  delay={500 + index * 100}
                  className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
                >
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-[#001F3F] rounded-lg">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-bold text-foreground">{t(item.titleKey)}</p>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal y={40} className="border-t border-border pt-16">
          <p className="text-[#001F3F] font-semibold uppercase tracking-wider mb-8 text-center">
            {t("homeAbout.leadership.kicker")}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <Reveal
              y={30}
              delay={200}
              className="overflow-hidden p-8 bg-background rounded-xl border border-border hover:border-[#001F3F]/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="mx-auto shrink-0 sm:mx-0">
                  <div className="h-36 w-36 overflow-hidden rounded-xl bg-[#FFCA23]/20 shadow-md ring-2 ring-[#001F3F]/10 sm:h-40 sm:w-40">
                    <img
                      src="/images/founder-mm-agrawal.webp"
                      alt={t("homeAbout.founder.photoAlt")}
                      width={300}
                      height={360}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-[center_15%]"
                    />
                  </div>
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-foreground mb-2">{t("homeAbout.founder.role")}</h3>
                  <p className="text-foreground font-bold text-xl mb-4">{t("homeAbout.founder.name")}</p>
                  <p className="text-muted-foreground leading-relaxed">{t("homeAbout.founder.bio")}</p>
                </div>
              </div>
            </Reveal>

            <Reveal
              y={30}
              delay={300}
              className="overflow-hidden p-8 bg-background rounded-xl border border-border hover:border-[#001F3F]/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="mx-auto shrink-0 sm:mx-0">
                  <div className="h-36 w-36 overflow-hidden rounded-xl bg-neutral-100 shadow-md ring-2 ring-[#001F3F]/10 sm:h-40 sm:w-40">
                    <img
                      src="/images/chairman-sanjeev-agarwal.webp"
                      alt={t("homeAbout.chairman.photoAlt")}
                      width={896}
                      height={1120}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-[center_20%]"
                    />
                  </div>
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-foreground mb-2">{t("homeAbout.chairman.role")}</h3>
                  <p className="text-foreground font-bold text-xl mb-4">{t("homeAbout.chairman.name")}</p>
                  <p className="text-muted-foreground leading-relaxed">{t("homeAbout.chairman.bio")}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
