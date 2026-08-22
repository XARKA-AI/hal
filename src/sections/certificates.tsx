import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { useRef, useState } from "react"
import { useLanguage } from "../components/language-context"

const CERT_IDS = [1, 2, 3, 4, 5, 6] as const

const CERT_COLORS: Record<number, string> = {
  1: "#003366",
  2: "#0054A6",
  3: "#C8102E",
  4: "#00A651",
  5: "#00A651",
  6: "#FF6B00",
}

export function Certificates() {
  const { t } = useLanguage()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const selectedCert = selectedId
    ? {
        id: selectedId,
        name: t(`certificates.item${selectedId}.name`),
        fullName: t(`certificates.item${selectedId}.fullName`),
        description: t(`certificates.item${selectedId}.desc`),
        color: CERT_COLORS[selectedId] ?? "#003366",
      }
    : null

  return (
    <section id="certificates" className="py-12 md:py-16 relative overflow-hidden bg-[#001F3F]">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fc801f' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-[#001F3F] font-semibold uppercase tracking-wider mb-3">
            {t("certificates.kicker")}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t("certificates.title")}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">{t("certificates.subtitle")}</p>
        </motion.div>

        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#001F3F] transition-colors flex items-center justify-center"
            aria-label={t("presence.control.zoomOut")}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#001F3F] transition-colors flex items-center justify-center"
            aria-label={t("presence.control.zoomIn")}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CERT_IDS.map((id, index) => {
            const color = CERT_COLORS[id] ?? "#003366"
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => setSelectedId(id)}
                className="flex-shrink-0 w-[280px] md:w-[320px] snap-start cursor-pointer group"
              >
                <div
                  className="relative h-[380px] md:h-[420px] rounded-xl overflow-hidden shadow-2xl transition-all duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                    border: `2px solid ${color}50`,
                  }}
                >
                  <div className="absolute inset-4 border-2 border-dashed border-white/30 rounded-lg" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div
                      className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center mb-6 shadow-lg"
                      style={{ background: color }}
                    >
                      <span className="text-2xl md:text-3xl font-bold text-white">
                        {t(`certificates.item${id}.name`)}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                      {t(`certificates.item${id}.fullName`)}
                    </h3>

                    <p className="text-white/70 text-sm md:text-base leading-relaxed">
                      {t(`certificates.item${id}.desc`)}
                    </p>

                    <div className="mt-6 w-16 h-16 rounded-full border-4 border-[#001F3F] flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-[#001F3F] flex items-center justify-center">
                        <span className="text-xs font-bold text-[#001F3F]">{t("certificates.seal")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-[#001F3F]/0 group-hover:bg-[#001F3F]/10 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <ZoomIn className="w-6 h-6 text-[#001F3F]" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#001F3F]" />
                  <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#001F3F]" />
                  <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#001F3F]" />
                  <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#001F3F]" />
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <p className="text-white/60 text-sm">{t("certificates.footer")}</p>
        </motion.div>
      </div>

      {selectedCert ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedId(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#001F3F] rounded-xl p-8 max-w-md w-full border-2"
            style={{ borderColor: selectedCert.color }}
          >
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: selectedCert.color }}
            >
              <span className="text-3xl font-bold text-white">{selectedCert.name}</span>
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-4">{selectedCert.fullName}</h3>
            <p className="text-white/70 text-center mb-6">{selectedCert.description}</p>
            <button
              onClick={() => setSelectedId(null)}
              className="w-full py-3 bg-[#001F3F] text-white font-bold rounded-lg hover:bg-[#000F25] transition-colors border border-white/20"
            >
              {t("certificates.close")}
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </section>
  )
}
