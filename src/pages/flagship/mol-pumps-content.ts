export const MOL_PUMPS_GALLERY_ROUTE = "/businesses/flagship-projects/mol-pumps"

/** Native dimensions of the handover photographs — used for layout stability. */
export const MOL_PUMPS_IMAGE_WIDTH = 1448
export const MOL_PUMPS_IMAGE_HEIGHT = 1086

/**
 * Variant widths produced by `scripts/generate-responsive-images.mjs`. Each
 * photograph exists on disk as `mol-pumps/<n>-<width>.webp`, so a phone fetches
 * the 480w file (~50 KB) instead of the full-width one.
 */
export const MOL_PUMPS_VARIANT_WIDTHS = [480, 768, 1200, 1448] as const

/** Variant used for the plain `src`, for anything that ignores `srcSet`. */
const FALLBACK_WIDTH = 1200

/** Photograph indices, in the order they appear in the project document. */
export const MOL_PUMPS_GALLERY_IMAGES = [1, 2] as const

export const MOL_PUMPS_HERO_IMAGE = 1
export const MOL_PUMPS_FEATURE_IMAGE = 1

/** Widest variant the hero offers — see `MolPumpsPicture.maxWidth`. */
export const MOL_PUMPS_HERO_MAX_WIDTH = 1200

function publicImagePath(file: string): string {
  const base = import.meta.env.BASE_URL
  const path = file.replace(/^\//, "")
  if (base === "./" || base === ".") return `/${path}`
  return base.endsWith("/") ? `${base}${path}` : `${base}/${path}`
}

export function molPumpsImageSrc(index: number, width: number = FALLBACK_WIDTH): string {
  return publicImagePath(`mol-pumps/${index}-${width}.webp`)
}

export function molPumpsImageSrcSet(index: number, maxWidth?: number): string {
  return MOL_PUMPS_VARIANT_WIDTHS.filter((w) => !maxWidth || w <= maxWidth)
    .map((w) => `${molPumpsImageSrc(index, w)} ${w}w`)
    .join(", ")
}

/** Responsive `sizes` for the 2-column site photo grid (max-w-7xl). */
export const MOL_PUMPS_GRID_SIZES =
  "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"

/** `sizes` for portrait feature frame (~lg:col-span-5). */
export const MOL_PUMPS_FEATURE_SIZES = "(max-width: 1024px) 100vw, 427px"

/** Full-bleed hero band. */
export const MOL_PUMPS_HERO_SIZES = "100vw"

/** Card on the Flagship projects index (two-column grid inside max-w-7xl). */
export const MOL_PUMPS_CARD_SIZES =
  "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
