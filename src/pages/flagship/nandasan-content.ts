export const NANDASAN_GALLERY_ROUTE = "/businesses/flagship-projects/nandasan"

/** Native dimensions — used for layout stability and `sizes` hints. */
export const NANDASAN_IMAGE_WIDTH = 1536
export const NANDASAN_IMAGE_HEIGHT = 1024

export const NANDASAN_GALLERY_IMAGES = [
  "nandasan/1.webp",
  "nandasan/2.webp",
  "nandasan/3.webp",
  "nandasan/4.webp",
  "nandasan/5.webp",
  "nandasan/6.webp",
  "nandasan/7.webp",
] as const

export function publicImagePath(file: string): string {
  const base = import.meta.env.BASE_URL
  const path = file.replace(/^\//, "")
  if (base === "./" || base === ".") return `/${path}`
  return base.endsWith("/") ? `${base}${path}` : `${base}/${path}`
}

/** Responsive `sizes` for the 2-column site photo grid (max-w-7xl). */
export const NANDASAN_GRID_SIZES = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"

/** `sizes` for portrait feature frame (~lg:col-span-5). */
export const NANDASAN_FEATURE_SIZES = "(max-width: 1024px) 100vw, 427px"

/** Full-bleed hero band. */
export const NANDASAN_HERO_SIZES = "100vw"
