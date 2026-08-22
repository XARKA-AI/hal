import { motion } from "framer-motion"
import { useLanguage } from "../components/language-context"

const MILESTONE_KEYS = [1, 2, 3, 4, 5, 6, 7] as const

export function Milestones() {
  const { t } = useLanguage()

  return (
    <section id="milestones" className="relative overflow-hidden py-12 md:py-16">
      {/* Ocean Background */}
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[#001F3F] font-semibold uppercase tracking-wider mb-3">
            {t("milestones.kicker")}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t("milestones.title")}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            {t("milestones.subtitle")}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#001F3F] via-[#001F3F]/50 to-transparent md:-translate-x-px" />

          <div className="space-y-6 md:space-y-8">
            {MILESTONE_KEYS.map((n, index) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row gap-4 md:gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content Card */}
                <div className={`flex-1 flex ${index % 2 === 0 ? 'md:justify-end md:text-right' : 'md:justify-start md:text-left'}`}>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="pl-12 md:pl-0 md:w-[calc(50%-2rem)] p-5 md:p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/15 hover:border-[#001F3F]/50 transition-all duration-300"
                  >
                    <span className="inline-block px-3 py-1 bg-[#001F3F] text-white text-sm font-bold rounded-md mb-2">
                      {t(`milestones.item${n}.year`)}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                      {t(`milestones.item${n}.title`)}
                    </h3>
                    <p className="text-sm md:text-base text-white/70 leading-relaxed">
                      {t(`milestones.item${n}.desc`)}
                    </p>
                  </motion.div>
                </div>

                {/* Timeline Dot */}
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                  className="absolute left-4 md:left-1/2 w-3 h-3 md:w-4 md:h-4 bg-[#001F3F] rounded-full border-2 md:border-4 border-[#001F3F] mt-5 md:mt-6 md:-translate-x-1/2 z-10 shadow-lg shadow-[#001F3F]/30"
                />

                {/* Empty space for alternating layout */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
