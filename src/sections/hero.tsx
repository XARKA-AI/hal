import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
import { useLanguage } from "../components/language-context"
import { dismissInitialSplash, getSplashGone, subscribeSplashGone } from "../lib/splash"

const heroImages = [
  { src: "/images/about-platform.webp", mobile: "/images/about-platform-mobile.webp" },
  { src: "/nandasan/3.webp" },
  { src: "/images/onshore-projects/rvmp-south-santhal-1.webp" },
  { src: "/images/onshore-projects/linch-redevelopment-1.webp" },
] as const

type HeroImage = (typeof heroImages)[number]

function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function heroSrcSet(entry: HeroImage): string | undefined {
  if ("mobile" in entry && entry.mobile) {
    return `${entry.mobile} 828w, ${entry.src} 1469w`
  }
  return undefined
}

function whenImagePainted(img: HTMLImageElement, onPainted: () => void) {
  let cancelled = false
  const done = () => {
    if (!cancelled) onPainted()
  }
  const decodeThen = () => {
    const fire = () => {
      if (!cancelled) onPainted()
    }
    if (typeof img.decode === "function") {
      img.decode().then(fire).catch(fire)
    } else {
      window.setTimeout(fire, 0)
    }
  }

  if (img.complete && img.naturalWidth > 0) {
    decodeThen()
  } else {
    img.addEventListener("load", decodeThen, { once: true })
    img.addEventListener("error", done, { once: true })
  }

  return () => {
    cancelled = true
    img.removeEventListener("load", decodeThen)
    img.removeEventListener("error", done)
  }
}

function preloadHeroEntry(entry: HeroImage) {
  const img = new Image()
  img.decoding = "async"
  const srcSet = heroSrcSet(entry)
  if (srcSet) img.srcset = srcSet
  img.sizes = "100vw"
  img.src = entry.src
}

function HeroPhoto({
  entry,
  className,
  eager,
  alt,
  fetchPriority,
  onPainted,
}: {
  entry: HeroImage
  className: string
  eager?: boolean
  alt: string
  fetchPriority?: "high" | "auto"
  onPainted?: () => void
}) {
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = ref.current
    if (!img || !onPainted) return
    return whenImagePainted(img, onPainted)
  }, [entry.src, onPainted])

  return (
    <img
      ref={ref}
      src={entry.src}
      srcSet={heroSrcSet(entry)}
      sizes="100vw"
      alt={alt}
      width={1469}
      height={1071}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={fetchPriority}
      className={className}
    />
  )
}

export function Hero() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const [currentImage, setCurrentImage] = useState(0)
  const [paintedIndex, setPaintedIndex] = useState(0)
  const [readySrc, setReadySrc] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    getPrefersReducedMotion,
  )
  const splashGone = useSyncExternalStore(subscribeSplashGone, getSplashGone, () => true)

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    const node = sectionRef.current
    if (!node || typeof IntersectionObserver === "undefined") return
    const io = new IntersectionObserver(
      ([entry]) => setIsVisible(entry?.isIntersecting ?? false),
      { threshold: 0.05 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible || prefersReducedMotion) return
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isVisible, prefersReducedMotion])

  useEffect(() => {
    preloadHeroEntry(heroImages[(currentImage + 1) % heroImages.length])
  }, [currentImage])

  const painted = heroImages[paintedIndex]
  const target = heroImages[currentImage]
  const swapping = paintedIndex !== currentImage
  const incomingReady = readySrc === target.src
  const kenBurns = splashGone && isVisible && !prefersReducedMotion

  const handleIncomingPainted = useCallback(() => {
    setReadySrc(target.src)
  }, [target.src])

  useEffect(() => {
    if (readySrc !== target.src) return
    const delay = prefersReducedMotion ? 0 : 420
    const timer = window.setTimeout(() => setPaintedIndex(currentImage), delay)
    return () => window.clearTimeout(timer)
  }, [readySrc, target.src, currentImage, prefersReducedMotion])

  return (
    <section ref={sectionRef} className="relative w-full min-h-viewport overflow-hidden bg-[#030912]">
      <div className="absolute inset-0 z-0 bg-[#030912]">
        <HeroPhoto
          entry={painted}
          eager
          alt="Offshore operations"
          fetchPriority={paintedIndex === 0 ? "high" : "auto"}
          onPainted={paintedIndex === 0 ? dismissInitialSplash : undefined}
          className={`hero-slide ${kenBurns && !swapping ? "hero-ken-burns" : ""}`}
        />

        {swapping ? (
          <HeroPhoto
            key={target.src}
            entry={target}
            eager
            alt=""
            fetchPriority="auto"
            onPainted={handleIncomingPainted}
            className={`hero-slide hero-slide-incoming ${incomingReady ? "is-ready" : ""}`}
          />
        ) : null}
      </div>

      <div className="relative z-10 flex min-h-viewport flex-col justify-end pt-28 pb-24 sm:pb-28 md:pb-32 lg:pb-36">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl">
            <p className="hero-fade-up mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white sm:mb-4 sm:text-sm md:text-base [text-shadow:0_2px_16px_rgba(0,0,0,0.45)]">
              {t("hero.tagline")}
            </p>

            <h1 className="text-[clamp(2.25rem,7vw,5.5rem)] font-bold uppercase leading-[0.95] tracking-tight [text-shadow:0_2px_20px_rgba(0,0,0,0.5)]">
              <span className="block text-white">HAL Offshore</span>
              {" "}
              <span className="block text-[#FFCA23]">Limited</span>
            </h1>
          </div>
        </div>
      </div>

      <div
        className="hero-fade-in absolute left-1/2 z-20 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 flex-wrap justify-center gap-x-2 gap-y-2 px-1 sm:w-auto sm:max-w-none sm:px-0 bottom-[max(1rem,calc(env(safe-area-inset-bottom,0px)+0.75rem))] sm:bottom-8"
        role="tablist"
        aria-label={t("hero.carouselLabel")}
      >
        {heroImages.map((_, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={index === currentImage}
            aria-label={`${t("hero.slide")} ${index + 1}`}
            onClick={() => setCurrentImage(index)}
            className="flex h-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full touch-manipulation"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                index === currentImage
                  ? "h-2.5 w-7 bg-[#FFCA23] sm:h-3 sm:w-8"
                  : "h-2.5 w-2.5 bg-white/40 hover:bg-white/60 sm:h-3 sm:w-3"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  )
}
