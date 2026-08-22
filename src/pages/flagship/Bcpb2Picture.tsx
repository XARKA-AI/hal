import {
  BCPB2_IMAGE_HEIGHT,
  BCPB2_IMAGE_WIDTH,
  bcpb2ImageSrc,
  bcpb2ImageSrcSet,
} from "./bcpb2-content"

interface Bcpb2PictureProps {
  /** Photograph index (1-based), matching `bcpb-2/<n>-<width>.webp`. */
  index: number
  alt: string
  className?: string
  sizes: string
  /** Above-the-fold — eager load + high fetch priority. */
  priority?: boolean
  /**
   * Drops variants wider than this from `srcSet`. Used by the hero, which sits
   * under a 50% black overlay and a gradient: the extra sharpness of the widest
   * variant is invisible there but costs bytes on the LCP image.
   */
  maxWidth?: number
}

export function Bcpb2Picture({
  index,
  alt,
  className,
  sizes,
  priority = false,
  maxWidth,
}: Bcpb2PictureProps) {
  return (
    <img
      src={bcpb2ImageSrc(index)}
      srcSet={bcpb2ImageSrcSet(index, maxWidth)}
      sizes={sizes}
      alt={alt}
      width={BCPB2_IMAGE_WIDTH}
      height={BCPB2_IMAGE_HEIGHT}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      className={className}
    />
  )
}
