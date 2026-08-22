import { Helmet } from "react-helmet-async"
import { DEFAULT_OG_IMAGE, SITE_URL, type SeoMeta } from "@/config/site"

/** Per-page SEO override — placed inside a page component for richer meta. */
export function PageSeo({
  title,
  description,
  path,
  noindex,
}: Partial<SeoMeta> & { title: string; description: string }) {
  const canonical = `${SITE_URL}${path ?? ""}`
  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      {path ? <link rel="canonical" href={canonical} /> : null}
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {path ? <meta property="og:url" content={canonical} /> : null}
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
    </Helmet>
  )
}
