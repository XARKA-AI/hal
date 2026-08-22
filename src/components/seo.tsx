import { Helmet } from "react-helmet-async"
import { useLocation } from "react-router"
import {
  DEFAULT_OG_IMAGE,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
  resolveSeoMeta,
} from "@/config/site"
import { isControllerPath } from "@/config/site-controller"

export { PageSeo } from "./seo-page"

export function SiteSeo() {
  const { pathname } = useLocation()
  const meta = resolveSeoMeta(pathname)
  const canonical = `${SITE_URL}${meta.path === "/" ? "" : meta.path}`
  const noindex = meta.noindex ?? isControllerPath(pathname)

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/mm-agrawal-group-logo.png`,
    description: meta.description,
    email: "info@haloffshore.com",
    sameAs: ["https://www.mmgindia.in/"],
  }

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: ["en", "hi", "ar"],
    publisher: { "@type": "Organization", name: SITE_NAME },
  }

  return (
    <Helmet prioritizeSeoTags>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={canonical} />
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta property="og:locale" content={SITE_LOCALE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />

      <script type="application/ld+json">{JSON.stringify(orgJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteJsonLd)}</script>
    </Helmet>
  )
}
