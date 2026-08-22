export const BCPB2_GALLERY_ROUTE = "/businesses/flagship-projects/bcpb-2"

/** Native dimensions of the handover photographs — used for layout stability. */
export const BCPB2_IMAGE_WIDTH = 1448
export const BCPB2_IMAGE_HEIGHT = 1086

/**
 * Variant widths produced by `scripts/generate-responsive-images.mjs`. Each
 * photograph exists on disk as `bcpb-2/<n>-<width>.webp`, so a phone fetches the
 * 480w file (~40 KB) instead of the full-width one.
 */
export const BCPB2_VARIANT_WIDTHS = [480, 768, 1200, 1448] as const

/** Variant used for the plain `src`, for anything that ignores `srcSet`. */
const FALLBACK_WIDTH = 1200

/** Photograph indices, in the order they appear in the project document. */
export const BCPB2_GALLERY_IMAGES = [1, 2, 3, 4, 5] as const

export const BCPB2_HERO_IMAGE = 3
export const BCPB2_FEATURE_IMAGE = 1

/** Widest variant the hero offers — see `Bcpb2Picture.maxWidth`. */
export const BCPB2_HERO_MAX_WIDTH = 1200

function publicImagePath(file: string): string {
  const base = import.meta.env.BASE_URL
  const path = file.replace(/^\//, "")
  if (base === "./" || base === ".") return `/${path}`
  return base.endsWith("/") ? `${base}${path}` : `${base}/${path}`
}

export function bcpb2ImageSrc(index: number, width: number = FALLBACK_WIDTH): string {
  return publicImagePath(`bcpb-2/${index}-${width}.webp`)
}

export function bcpb2ImageSrcSet(index: number, maxWidth?: number): string {
  return BCPB2_VARIANT_WIDTHS.filter((w) => !maxWidth || w <= maxWidth)
    .map((w) => `${bcpb2ImageSrc(index, w)} ${w}w`)
    .join(", ")
}

/** Responsive `sizes` for the 2-column site photo grid (max-w-7xl). */
export const BCPB2_GRID_SIZES = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"

/** `sizes` for portrait feature frame (~lg:col-span-5). */
export const BCPB2_FEATURE_SIZES = "(max-width: 1024px) 100vw, 427px"

/** Full-bleed hero band. */
export const BCPB2_HERO_SIZES = "100vw"

/** Card on the Flagship projects index (two-column grid inside max-w-7xl). */
export const BCPB2_CARD_SIZES = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
