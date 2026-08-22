import {
  SOLAR_TURBINE_IMAGE_HEIGHT,
  SOLAR_TURBINE_IMAGE_WIDTH,
  solarTurbineImageSrc,
  solarTurbineImageSrcSet,
} from "./solar-turbine-content"

interface SolarTurbinePictureProps {
  /** Photograph index (1-based), matching `solar-turbine/<n>-<width>.webp`. */
  index: number
  alt: string
  className?: string
  sizes: string
  /** Above-the-fold — eager load + high fetch priority. */
  priority?: boolean
  /**
   * Drops variants wider than this from `srcSet`. Used by the hero, which sits
   * under the graded overlay: the extra sharpness of the widest variant is
   * invisible there but costs bytes on the LCP image.
   */
  maxWidth?: number
}

export function SolarTurbinePicture({
  index,
  alt,
  className,
  sizes,
  priority = false,
  maxWidth,
}: SolarTurbinePictureProps) {
  return (
    <img
      src={solarTurbineImageSrc(index)}
      srcSet={solarTurbineImageSrcSet(index, maxWidth)}
      sizes={sizes}
      alt={alt}
      width={SOLAR_TURBINE_IMAGE_WIDTH}
      height={SOLAR_TURBINE_IMAGE_HEIGHT}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      className={className}
    />
  )
}
