import { useRef, useEffect, useState } from "react"
import { useLanguage } from "../components/language-context"
import { Reveal } from "../components/reveal"

const FEATURES_BG_VIDEO = "https://d2nev2c5v9t8b9.cloudfront.net/video/video.mp4"

export function Features() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
  const [isInView, setIsInView] = useState(false)

  // 1) Trigger the (heavy) video fetch only once the section is actually visible.
  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setShouldLoadVideo(true)
        observer.disconnect()
      },
      { rootMargin: "0px", threshold: 0.05 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // 2) Track visibility so we can pause video playback while off-screen.
  // (A paused decoder uses ~0 CPU/GPU vs. continuously decoding behind the user.)
  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry?.isIntersecting ?? false),
      { threshold: 0.05 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v || !shouldLoadVideo) return
    v.muted = true
    if (isInView) {
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [shouldLoadVideo, isInView])

  return (
    <section ref={sectionRef} id="features" className="relative min-h-viewport overflow-hidden bg-black">
      {shouldLoadVideo ? (
        <video
          ref={videoRef}
          src={FEATURES_BG_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 z-0 h-full w-full min-h-full object-cover brightness-90 contrast-125 saturate-125"
        />
      ) : (
        <img
          src="/images/hero-platform.webp"
          srcSet="/images/hero-platform-768.webp 768w, /images/hero-platform-1200.webp 1200w, /images/hero-platform.webp 1536w"
          sizes="100vw"
          alt=""
          aria-hidden="true"
          width={1536}
          height={1024}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 z-0 h-full w-full object-cover brightness-90 contrast-125 saturate-125"
        />
      )}
      <div className="absolute inset-0 z-[1] bg-black/20" />

      <div className="relative z-10 flex min-h-viewport w-full flex-col justify-center pt-28 pb-20 md:pt-32 md:pb-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal y={16} className="mx-auto max-w-4xl text-center [text-shadow:0_2px_24px_rgba(0,0,0,0.85),0_1px_4px_rgba(0,0,0,0.9)]">
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {t("features.title")}
            </h2>
          </Reveal>

        {/* Features grid — uncomment when `features` has items and <Features /> is enabled in App.tsx
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative bg-background rounded-xl border border-border overflow-hidden hover:border-[#FFCA23]/50 hover:shadow-xl transition-all duration-500"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={feature.image}
                  alt={t(feature.titleKey)}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 scale-105 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                <div className="absolute bottom-4 left-4 w-12 h-12 flex items-center justify-center bg-[#001F3F] rounded-xl group-hover:bg-[#FFCA23] transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-[#FFCA23] group-hover:text-[#001F3F] transition-colors" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        */}
        </div>
      </div>
    </section>
  )
}
