export const NSPL_GALLERY_ROUTE = "/businesses/flagship-projects/nspl"

/** Native dimensions of the handover photographs — used for layout stability. */
export const NSPL_IMAGE_WIDTH = 1672
export const NSPL_IMAGE_HEIGHT = 941

/**
 * Variant widths produced by `scripts/generate-responsive-images.mjs`. Each
 * photograph exists on disk as `nspl/<n>-<width>.webp`.
 */
export const NSPL_VARIANT_WIDTHS = [480, 768, 1200, 1672] as const

/** Variant used for the plain `src`, for anything that ignores `srcSet`. */
const FALLBACK_WIDTH = 1200

/** Photograph indices, in the order they appear in the project document. */
export const NSPL_GALLERY_IMAGES = [1, 2, 3, 4] as const

export const NSPL_HERO_IMAGE = 1
export const NSPL_FEATURE_IMAGE = 4

export const NSPL_HERO_MAX_WIDTH = 1200

function publicImagePath(file: string): string {
  const base = import.meta.env.BASE_URL
  const path = file.replace(/^\//, "")
  if (base === "./" || base === ".") return `/${path}`
  return base.endsWith("/") ? `${base}${path}` : `${base}/${path}`
}

export function nsplImageSrc(index: number, width: number = FALLBACK_WIDTH): string {
  return publicImagePath(`nspl/${index}-${width}.webp`)
}

export function nsplImageSrcSet(index: number, maxWidth?: number): string {
  return NSPL_VARIANT_WIDTHS.filter((w) => !maxWidth || w <= maxWidth)
    .map((w) => `${nsplImageSrc(index, w)} ${w}w`)
    .join(", ")
}

export const NSPL_HERO_SIZES = "100vw"

export const NSPL_FEATURE_SIZES = "(max-width: 1024px) 100vw, 427px"

export const NSPL_GRID_SIZES = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"

export const NSPL_CARD_SIZES = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
