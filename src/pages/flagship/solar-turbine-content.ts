export const SOLAR_TURBINE_GALLERY_ROUTE =
  "/businesses/flagship-projects/solar-turbine"

/** Native dimensions of the handover photograph — used for layout stability. */
export const SOLAR_TURBINE_IMAGE_WIDTH = 1447
export const SOLAR_TURBINE_IMAGE_HEIGHT = 1087

/**
 * Variant widths produced by `scripts/generate-responsive-images.mjs`. Each
 * photograph exists on disk as `solar-turbine/<n>-<width>.webp`, so a phone
 * fetches the 480w file (~25 KB) instead of the full-width one.
 */
export const SOLAR_TURBINE_VARIANT_WIDTHS = [480, 768, 1200, 1447] as const

/** Variant used for the plain `src`, for anything that ignores `srcSet`. */
const FALLBACK_WIDTH = 1200

/** Photograph indices, in the order they appear in the project document. */
export const SOLAR_TURBINE_GALLERY_IMAGES = [1] as const

export const SOLAR_TURBINE_HERO_IMAGE = 1

export const SOLAR_TURBINE_SCOPE_KEYS = [
  "flagshipPage.case.solar.scope.1",
  "flagshipPage.case.solar.scope.2",
  "flagshipPage.case.solar.scope.3",
  "flagshipPage.case.solar.scope.4",
] as const

/** Widest variant the hero offers — see `SolarTurbinePicture.maxWidth`. */
export const SOLAR_TURBINE_HERO_MAX_WIDTH = 1200

function publicImagePath(file: string): string {
  const base = import.meta.env.BASE_URL
  const path = file.replace(/^\//, "")
  if (base === "./" || base === ".") return `/${path}`
  return base.endsWith("/") ? `${base}${path}` : `${base}/${path}`
}

export function solarTurbineImageSrc(
  index: number,
  width: number = FALLBACK_WIDTH
): string {
  return publicImagePath(`solar-turbine/${index}-${width}.webp`)
}

export function solarTurbineImageSrcSet(index: number, maxWidth?: number): string {
  return SOLAR_TURBINE_VARIANT_WIDTHS.filter((w) => !maxWidth || w <= maxWidth)
    .map((w) => `${solarTurbineImageSrc(index, w)} ${w}w`)
    .join(", ")
}

/** Responsive `sizes` for the 2-column site photo grid (max-w-7xl). */
export const SOLAR_TURBINE_GRID_SIZES =
  "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"

/** Full-bleed hero band. */
export const SOLAR_TURBINE_HERO_SIZES = "100vw"

/** Card on the Flagship projects index (two-column grid inside max-w-7xl). */
export const SOLAR_TURBINE_CARD_SIZES =
  "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
