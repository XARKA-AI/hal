import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type LazyExoticComponent,
} from "react"

type DeferredSectionProps = {
  /** Lazy-loaded section component (from `React.lazy`). */
  component: LazyExoticComponent<ComponentType>
  /** Placeholder height before the chunk loads — keeps scroll position stable. */
  minHeight?: number | string
  /** IntersectionObserver rootMargin — load slightly before scroll-in. */
  rootMargin?: string
}

function placeholderStyle(minHeight: number | string): CSSProperties {
  return { minHeight }
}

/**
 * Defers fetching + rendering a homepage section until it is near the viewport.
 * Combines IntersectionObserver (when to load) with React.lazy (code-split chunk).
 */
export function DeferredSection({
  component: Component,
  minHeight = 700,
  rootMargin = "280px 0px",
}: DeferredSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(
    () => typeof IntersectionObserver === "undefined",
  )
  const reserved = placeholderStyle(minHeight)

  useEffect(() => {
    if (shouldLoad) return
    const node = ref.current
    if (!node || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setShouldLoad(true)
        observer.disconnect()
      },
      { rootMargin },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [shouldLoad, rootMargin])

  return (
    <div ref={ref} style={shouldLoad ? undefined : reserved}>
      {shouldLoad ? (
        <Suspense fallback={<div style={reserved} aria-hidden />}>
          <Component />
        </Suspense>
      ) : null}
    </div>
  )
}
