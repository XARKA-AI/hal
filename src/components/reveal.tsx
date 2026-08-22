import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  x?: number
  rootMargin?: string
} & HTMLAttributes<HTMLDivElement>

function isNodeInView(node: HTMLElement, rootMargin: string) {
  const extra = Number.parseInt(rootMargin, 10)
  const margin = Number.isFinite(extra) ? extra : 0
  const rect = node.getBoundingClientRect()
  return rect.top < window.innerHeight + margin && rect.bottom > -margin
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
  x = 0,
  rootMargin = "0px 0px",
  style,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === "undefined",
  )

  useEffect(() => {
    if (visible) return
    const node = ref.current
    if (!node || typeof IntersectionObserver === "undefined") return

    if (isNodeInView(node, rootMargin)) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setVisible(true)
        observer.disconnect()
      },
      { rootMargin, threshold: 0.01 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin, visible])

  return (
    <div
      ref={ref}
      className={cn("reveal", visible && "reveal-visible", className)}
      style={{
        ["--reveal-y" as string]: `${y}px`,
        ["--reveal-x" as string]: `${x}px`,
        transitionDelay: visible ? `${delay}ms` : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}
