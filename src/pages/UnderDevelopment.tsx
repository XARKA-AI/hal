import { motion } from "framer-motion"
import { Construction, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router"

interface UnderDevelopmentProps {
  pageName?: string
}

export function UnderDevelopment({ pageName }: UnderDevelopmentProps) {
  const navigate = useNavigate()

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-24"
      style={{
        backgroundImage: "url('/images/hero-vessel-platform.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#001F3F]/82 via-[#001F3F]/55 to-black/70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(0,0,0,0.55)_85%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="rounded-[2rem] border border-white/25 bg-white/95 px-6 py-9 shadow-2xl shadow-black/35 backdrop-blur-sm sm:px-10 sm:py-11 dark:border-white/15 dark:bg-[#0d0d0d]/92"
        >
          <div className="flex justify-center mb-8">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-[#001F3F]/15 bg-[#001F3F] shadow-lg shadow-[#001F3F]/25 dark:border-[#FFCA23]/30 dark:bg-[#FFCA23] dark:shadow-[#FFCA23]/20">
              <Construction className="h-10 w-10 text-white dark:text-black" />
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-full border border-[#001F3F]/20 bg-[#001F3F]/8 px-4 py-1.5 dark:border-[#FFCA23]/35 dark:bg-[#FFCA23]/12">
              <span className="text-sm font-semibold uppercase tracking-widest text-[#001F3F] dark:text-[#FFCA23]">
                Under Development
              </span>
            </div>
          </div>

          <h1 className="mb-10 text-4xl font-bold leading-tight text-neutral-950 md:text-5xl lg:text-6xl dark:text-white">
            {pageName || "Coming Soon"}
          </h1>

          <motion.button
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05, x: -4 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#001F3F] px-6 py-3 font-semibold text-white shadow-lg shadow-[#001F3F]/20 transition-colors hover:bg-[#000F25] dark:bg-[#FFCA23] dark:text-black dark:hover:bg-[#E6B51E]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
