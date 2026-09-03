import {
  NSPL_IMAGE_HEIGHT,
  NSPL_IMAGE_WIDTH,
  nsplImageSrc,
  nsplImageSrcSet,
} from "./nspl-content"

interface NsplPictureProps {
  /** Photograph index (1-based), matching `nspl/<n>-<width>.webp`. */
  index: number
  alt: string
  className?: string
  sizes: string
  /** Above-the-fold — eager load + high fetch priority. */
  priority?: boolean
  /**
   * Drops variants wider than this from `srcSet`. Used by the hero, which sits
   * under a 50% black overlay and a gradient.
   */
  maxWidth?: number
}

export function NsplPicture({
  index,
  alt,
  className,
  sizes,
  priority = false,
  maxWidth,
}: NsplPictureProps) {
  return (
    <img
      src={nsplImageSrc(index)}
      srcSet={nsplImageSrcSet(index, maxWidth)}
      sizes={sizes}
      alt={alt}
      width={NSPL_IMAGE_WIDTH}
      height={NSPL_IMAGE_HEIGHT}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      className={className}
    />
  )
}
