export const CLUSTER_C_GALLERY_ROUTE = "/businesses/flagship-projects/cluster-c"

/** Native dimensions of the Cluster C site photo. */
export const CLUSTER_C_IMAGE_WIDTH = 1672
export const CLUSTER_C_IMAGE_HEIGHT = 941

export const CLUSTER_C_GALLERY_IMAGES = ["cluster-c/1.webp"] as const

export function publicImagePath(file: string): string {
  const base = import.meta.env.BASE_URL
  const path = file.replace(/^\//, "")
  if (base === "./" || base === ".") return `/${path}`
  return base.endsWith("/") ? `${base}${path}` : `${base}/${path}`
}

export const CLUSTER_C_GRID_SIZES =
  "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"

export const CLUSTER_C_FEATURE_SIZES = "(max-width: 1024px) 100vw, 427px"

export const CLUSTER_C_HERO_SIZES = "100vw"
