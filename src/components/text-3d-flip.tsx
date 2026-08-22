"use client"

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ElementType,
} from "react"
import { useAnimate } from "framer-motion"

import { cn } from "@/lib/utils"

const HAS_SEGMENTER = typeof Intl !== "undefined" && "Segmenter" in Intl

const splitIntoCharacters = (text: string): string[] => {
  if (HAS_SEGMENTER) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" })
    return Array.from(segmenter.segment(text), ({ segment }) => segment)
  }
  return Array.from(text)
}

const extractTextFromChildren = (children: React.ReactNode): string => {
  if (children == null) return ""
  if (typeof children === "string") return children
  if (typeof children === "number") return String(children)

  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join("")
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(children)) {
    if (children.props.children != null) {
      return extractTextFromChildren(children.props.children)
    }
  }

  return ""
}

const ROTATION_MAP = {
  top: "rotateX(90deg)",
  right: "rotateY(90deg)",
  bottom: "rotateX(-90deg)",
  left: "rotateY(-90deg)",
} as const

const SECOND_FACE_TRANSFORMS = {
  top: "rotateX(-90deg) translateZ(0.5lh)",
  right:
    "rotateY(90deg) translateX(50%) rotateY(-90deg) translateX(-50%) rotateY(-90deg) translateX(50%)",
  bottom: "rotateX(90deg) translateZ(0.5lh)",
  left:
    "rotateY(90deg) translateX(50%) rotateY(-90deg) translateX(50%) rotateY(-90deg) translateX(50%)",
} as const

const FRONT_FACE_TRANSFORMS = {
  top: "translateZ(0.5lh)",
  bottom: "translateZ(0.5lh)",
  left: "rotateY(90deg) translateX(50%) rotateY(-90deg)",
  right: "rotateY(-90deg) translateX(50%) rotateY(90deg)",
} as const

const CONTAINER_TRANSFORMS = {
  top: "translateZ(-0.5lh)",
  bottom: "translateZ(-0.5lh)",
  left: "rotateY(90deg) translateX(50%) rotateY(-90deg)",
  right: "rotateY(90deg) translateX(50%) rotateY(-90deg)",
} as const

interface Text3DFlipProps {
  children: React.ReactNode
  as?: ElementType
  className?: string
  textClassName?: string
  flipTextClassName?: string
  staggerDuration?: number
  staggerFrom?: "first" | "last" | "center" | number | "random"
  rotateDirection?: "top" | "right" | "bottom" | "left"
  onMouseEnter?: React.MouseEventHandler<HTMLElement>
  [key: string]: unknown
}

export const Text3DFlip = ({
  children,
  as: ElementTag = "p",
  className,
  textClassName,
  flipTextClassName,
  staggerDuration = 0.05,
  staggerFrom = "first",
  rotateDirection = "right",
  ...props
}: Text3DFlipProps) => {
  const Tag = ElementTag as React.ElementType
  const isAnimatingRef = useRef(false)
  const isMountedRef = useRef(false)
  const [scope, animate] = useAnimate()

  const rotationTransform = ROTATION_MAP[rotateDirection]

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
      isAnimatingRef.current = false
    }
  }, [])

  const text = useMemo(() => {
    try {
      return extractTextFromChildren(children)
    } catch {
      return ""
    }
  }, [children])

  const characters = useMemo(() => {
    const words = text.split(" ")
    return words.map((word, i) => ({
      characters: splitIntoCharacters(word),
      needsSpace: i !== words.length - 1,
    }))
  }, [text])

  const charOffsets = useMemo(() => {
    const offsets = [0]
    for (const word of characters) {
      offsets.push(offsets.at(-1)! + word.characters.length)
    }
    return offsets
  }, [characters])

  const getStaggerDelay = useCallback(
    (index: number, totalChars: number) => {
      if (staggerFrom === "first") return index * staggerDuration
      if (staggerFrom === "last") return (totalChars - 1 - index) * staggerDuration
      if (staggerFrom === "center") {
        const center = Math.floor(totalChars / 2)
        return Math.abs(center - index) * staggerDuration
      }
      if (staggerFrom === "random") {
        const randomIndex = Math.floor(Math.random() * totalChars)
        return Math.abs(randomIndex - index) * staggerDuration
      }
      return Math.abs(staggerFrom - index) * staggerDuration
    },
    [staggerDuration, staggerFrom],
  )

  const handleHoverStart = useCallback(async () => {
    if (isAnimatingRef.current) return

    const totalChars = characters.reduce((sum, word) => sum + word.characters.length, 0)
    if (totalChars === 0) return

    isAnimatingRef.current = true

    try {
      const delays = Array.from({ length: totalChars }, (_, i) => getStaggerDelay(i, totalChars))

      await animate(
        ".text-3d-flip-char",
        { transform: rotationTransform },
        {
          type: "spring",
          damping: 30,
          stiffness: 300,
          delay: (i) => delays[i] ?? 0,
        },
      )

      if (!isMountedRef.current) return

      await animate(".text-3d-flip-char", { transform: "rotateX(0deg) rotateY(0deg)" }, { duration: 0 })
    } finally {
      if (isMountedRef.current) {
        isAnimatingRef.current = false
      }
    }
  }, [animate, characters, getStaggerDelay, rotationTransform])

  const renderedChildren = (
    <>
      <span className="sr-only">{text}</span>

      {characters.map((wordObj, wordIndex) => (
        <span key={wordIndex} className="inline-flex">
          {wordObj.characters.map((char, charIndex) => (
            <CharBox
              key={charOffsets[wordIndex] + charIndex}
              char={char}
              textClassName={textClassName}
              flipTextClassName={flipTextClassName}
              rotateDirection={rotateDirection}
            />
          ))}
          {wordObj.needsSpace && <span className="whitespace-pre"> </span>}
        </span>
      ))}
    </>
  )

  return React.createElement(
    Tag,
    {
      className: cn("relative flex flex-wrap", className),
      onMouseEnter: handleHoverStart,
      ref: scope,
      ...(props as Record<string, unknown>),
    },
    renderedChildren,
  )
}

interface CharBoxProps {
  char: string
  textClassName?: string
  flipTextClassName?: string
  rotateDirection: "top" | "right" | "bottom" | "left"
}

const CharBox = memo(({ char, textClassName, flipTextClassName, rotateDirection }: CharBoxProps) => (
  <span
    className="text-3d-flip-char inline-block"
    style={{ transform: CONTAINER_TRANSFORMS[rotateDirection], transformStyle: "preserve-3d" }}
  >
    <span
      className={cn("relative inline-block h-[1lh]", textClassName)}
      style={{
        transform: FRONT_FACE_TRANSFORMS[rotateDirection],
        backfaceVisibility: "hidden",
      }}
    >
      {char}
    </span>
    <span
      className={cn("absolute top-0 left-0 inline-block h-[1lh]", flipTextClassName)}
      style={{
        transform: SECOND_FACE_TRANSFORMS[rotateDirection],
        backfaceVisibility: "hidden",
      }}
      aria-hidden="true"
    >
      {char}
    </span>
  </span>
))

CharBox.displayName = "CharBox"
Text3DFlip.displayName = "Text3DFlip"
