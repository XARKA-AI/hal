import {
  MOL_PUMPS_IMAGE_HEIGHT,
  MOL_PUMPS_IMAGE_WIDTH,
  molPumpsImageSrc,
  molPumpsImageSrcSet,
} from "./mol-pumps-content"

interface MolPumpsPictureProps {
  /** Photograph index (1-based), matching `mol-pumps/<n>-<width>.webp`. */
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

export function MolPumpsPicture({
  index,
  alt,
  className,
  sizes,
  priority = false,
  maxWidth,
}: MolPumpsPictureProps) {
  return (
    <img
      src={molPumpsImageSrc(index)}
      srcSet={molPumpsImageSrcSet(index, maxWidth)}
      sizes={sizes}
      alt={alt}
      width={MOL_PUMPS_IMAGE_WIDTH}
      height={MOL_PUMPS_IMAGE_HEIGHT}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      className={className}
    />
  )
}
