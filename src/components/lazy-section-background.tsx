import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type LazySectionBackgroundProps = {
  src: string
  alt?: string
  className?: string
  imageClassName?: string
  eager?: boolean
  width?: number
  height?: number
}

export function LazySectionBackground({
  src,
  alt = "",
  className,
  imageClassName,
  eager = false,
  width = 1920,
  height = 1080,
}: LazySectionBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(eager)

  useEffect(() => {
    if (shouldLoad) return

    const node = containerRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setShouldLoad(true)
        observer.disconnect()
      },
      { rootMargin: "350px 0px" },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [shouldLoad])

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0", className)}
      aria-hidden={alt ? undefined : true}
    >
      {shouldLoad ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : "auto"}
          sizes="100vw"
          className={cn("h-full w-full object-cover", imageClassName)}
        />
      ) : null}
    </div>
  )
}

