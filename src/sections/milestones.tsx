import { motion } from "framer-motion"
import { useLanguage } from "../components/language-context"
import { JOURNEY_MILESTONES } from "../data/journey-milestones"

export function Milestones() {
  const { t } = useLanguage()

  return (
    <section id="milestones" className="relative overflow-hidden py-12 md:py-16">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/milestones-ocean.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#001F3F]/70 via-[#001F3F]/80 to-[#001F3F]/90" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[#FFCA23] font-semibold uppercase tracking-wider mb-3">
            {t("aboutPage.milestones.kicker")}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t("aboutPage.milestones.title")}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            {t("aboutPage.milestones.lead")}
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FFCA23]/80 via-[#FFCA23]/40 to-transparent md:-translate-x-px" />

          <div className="space-y-6 md:space-y-8">
            {JOURNEY_MILESTONES.map((item, index) => {
              const year = t(`aboutPage.milestones.${item.id}.year`)
              const title = t(`aboutPage.milestones.${item.id}.title`)
              const body = t(`aboutPage.milestones.${item.id}.body`)
              const hideTitle = "hideTitle" in item && item.hideTitle

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.3) }}
                  className={`relative flex flex-col md:flex-row gap-4 md:gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div
                    className={`flex-1 flex ${
                      index % 2 === 0 ? "md:justify-end md:text-right" : "md:justify-start md:text-left"
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="pl-12 md:pl-0 md:w-[calc(50%-2rem)] p-5 md:p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/15 hover:border-[#FFCA23]/50 transition-all duration-300"
                    >
                      <span className="inline-block px-3 py-1 bg-[#001F3F] text-white text-sm font-bold rounded-md mb-2">
                        {year}
                      </span>
                      {hideTitle ? null : (
                        <h3 className="text-lg md:text-xl font-bold text-white mb-2">{title}</h3>
                      )}
                      <p className="text-sm md:text-base text-white/70 leading-relaxed">{body}</p>
                      {"listKeys" in item && item.listKeys ? (
                        <ul
                          className={`mt-3 list-disc space-y-1 text-sm md:text-base text-white/70 leading-relaxed ${
                            index % 2 === 0 ? "md:ms-0 md:list-inside" : "ps-5 md:ps-5"
                          }`}
                        >
                          {item.listKeys.map((listKey) => (
                            <li key={listKey}>
                              {t(`aboutPage.milestones.${item.id}.${listKey}`)}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {"extraBody" in item && item.extraBody ? (
                        <p className="mt-3 text-sm md:text-base text-white/70 leading-relaxed">
                          {t(`aboutPage.milestones.${item.id}.body2`)}
                        </p>
                      ) : null}
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + Math.min(index * 0.06, 0.3), type: "spring" }}
                    className="absolute left-4 md:left-1/2 w-3 h-3 md:w-4 md:h-4 bg-[#FFCA23] rounded-full border-2 md:border-4 border-[#001F3F] mt-5 md:mt-6 md:-translate-x-1/2 z-10 shadow-lg shadow-[#FFCA23]/30"
                  />

                  <div className="hidden md:block flex-1" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
