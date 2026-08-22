import {
  DCU_IMAGE_HEIGHT,
  DCU_IMAGE_WIDTH,
  dcuImageSrc,
  dcuImageSrcSet,
} from "./dcu-numaligarh-content"

interface DcuNumaligarhPictureProps {
  /** Photograph index (1-based), matching `dcu-numaligarh/<n>-<width>.webp`. */
  index: number
  alt: string
  className?: string
  sizes: string
  /** Above-the-fold — eager load + high fetch priority. */
  priority?: boolean
  /**
   * Drops variants wider than this from `srcSet`. Used by the hero, which sits
   * under a 50% black overlay and a gradient: the extra sharpness of the widest
   * variant is invisible there but costs ~170 KB on the LCP image.
   */
  maxWidth?: number
}

export function DcuNumaligarhPicture({
  index,
  alt,
  className,
  sizes,
  priority = false,
  maxWidth,
}: DcuNumaligarhPictureProps) {
  return (
    <img
      src={dcuImageSrc(index)}
      srcSet={dcuImageSrcSet(index, maxWidth)}
      sizes={sizes}
      alt={alt}
      width={DCU_IMAGE_WIDTH}
      height={DCU_IMAGE_HEIGHT}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      className={className}
    />
  )
}
