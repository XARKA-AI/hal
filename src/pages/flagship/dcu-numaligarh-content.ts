export const DCU_NUMALIGARH_GALLERY_ROUTE =
  "/businesses/flagship-projects/dcu-numaligarh"

/** Native dimensions of the handover photographs — used for layout stability. */
export const DCU_IMAGE_WIDTH = 1672
export const DCU_IMAGE_HEIGHT = 941

/**
 * Variant widths produced by `scripts/generate-responsive-images.mjs`. Each
 * photograph exists on disk as `dcu-numaligarh/<n>-<width>.webp`, so a phone
 * fetches the 480w file (~15-45 KB) instead of the full-width one.
 */
export const DCU_VARIANT_WIDTHS = [480, 768, 1200, 1672] as const

/** Variant used for the plain `src`, for anything that ignores `srcSet`. */
const FALLBACK_WIDTH = 1200

/** Photograph indices, in the order they appear in the project document. */
export const DCU_GALLERY_IMAGES = [1, 2, 3] as const

/** Rendered first, so it is the one worth preloading. */
export const DCU_HERO_IMAGE = 1
export const DCU_FEATURE_IMAGE = 3

function publicImagePath(file: string): string {
  const base = import.meta.env.BASE_URL
  const path = file.replace(/^\//, "")
  if (base === "./" || base === ".") return `/${path}`
  return base.endsWith("/") ? `${base}${path}` : `${base}/${path}`
}

export function dcuImageSrc(index: number, width: number = FALLBACK_WIDTH): string {
  return publicImagePath(`dcu-numaligarh/${index}-${width}.webp`)
}

export function dcuImageSrcSet(index: number, maxWidth?: number): string {
  return DCU_VARIANT_WIDTHS.filter((w) => !maxWidth || w <= maxWidth)
    .map((w) => `${dcuImageSrc(index, w)} ${w}w`)
    .join(", ")
}

/** Widest variant the hero offers — see `DcuNumaligarhPicture.maxWidth`. */
export const DCU_HERO_MAX_WIDTH = 1200

/** Full-bleed hero band. */
export const DCU_HERO_SIZES = "100vw"

/** Portrait feature frame (~lg:col-span-5 of max-w-6xl). */
export const DCU_FEATURE_SIZES = "(max-width: 1024px) 100vw, 427px"

/** Two-column photo grid inside max-w-7xl. */
export const DCU_GRID_SIZES = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"

/** Card on the Flagship projects index (two-column grid inside max-w-7xl). */
export const DCU_CARD_SIZES = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
