import { useEffect, lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router"
import { HelmetProvider } from "react-helmet-async"
import { ThemeProvider } from "./components/theme-provider"
import { LanguageProvider } from "./components/language-provider"
import { Navigation } from "./components/navigation"
import { AppLoader } from "./components/app-loader"
import { SiteSeo } from "./components/seo"
import { MaintenancePreviewBanner } from "./components/maintenance-preview-banner"
import { DeferredSection } from "./components/deferred-section"
import { SiteControllerProvider } from "./context/site-controller-provider"
import { useSiteController } from "./hooks/useSiteController"
import { CONTROLLER_ROUTES, isControllerPath } from "./config/site-controller"
import { useApplySitePreferences } from "./hooks/useApplySitePreferences"
import { dismissInitialSplash } from "./lib/splash"
// import { Chatbot } from "./components/chatbot"
import { Hero } from "./sections/hero"

// Below-the-fold homepage sections — fetched only when scrolled near.
const Trust = lazy(() => import("./sections/trust").then((m) => ({ default: m.Trust })))
const Features = lazy(() => import("./sections/features").then((m) => ({ default: m.Features })))
const About = lazy(() => import("./sections/about").then((m) => ({ default: m.About })))
const Milestones = lazy(() =>
  import("./sections/milestones").then((m) => ({ default: m.Milestones })),
)
const Services = lazy(() => import("./sections/services").then((m) => ({ default: m.Services })))
const HomeBusinesses = lazy(() =>
  import("./sections/home-businesses").then((m) => ({ default: m.HomeBusinesses })),
)
const Fleet = lazy(() => import("./sections/fleet").then((m) => ({ default: m.Fleet })))
const CTA = lazy(() => import("./sections/cta").then((m) => ({ default: m.CTA })))
const Footer = lazy(() => import("./sections/footer").then((m) => ({ default: m.Footer })))

// ─── Lazy-loaded pages (fetched only when the user navigates there) ──────────
const UnderDevelopment = lazy(() =>
  import("./pages/UnderDevelopment").then((m) => ({ default: m.UnderDevelopment }))
)
const ContactPage = lazy(() =>
  import("./pages/ContactPage").then((m) => ({ default: m.ContactPage }))
)
const BusinessesPage = lazy(() =>
  import("./pages/BusinessesPage").then((m) => ({ default: m.BusinessesPage }))
)
const AboutPage = lazy(() =>
  import("./pages/AboutPage").then((m) => ({ default: m.AboutPage }))
)
const OffshoreEpcPage = lazy(() =>
  import("./pages/OffshoreEpcPage").then((m) => ({ default: m.OffshoreEpcPage }))
)
const OnshoreEpcPage = lazy(() =>
  import("./pages/OnshoreEpcPage").then((m) => ({ default: m.OnshoreEpcPage }))
)
const BooOmPage = lazy(() =>
  import("./pages/BooOmPage").then((m) => ({ default: m.BooOmPage }))
)
const CareersPage = lazy(() =>
  import("./pages/CareersPage").then((m) => ({ default: m.CareersPage }))
)
const ControllerGuard = lazy(() =>
  import("./pages/controller/ControllerGuard").then((m) => ({ default: m.ControllerGuard }))
)
const ControllerLoginPage = lazy(() =>
  import("./pages/controller/ControllerLoginPage").then((m) => ({ default: m.ControllerLoginPage }))
)
const ControllerDashboardPage = lazy(() =>
  import("./pages/controller/ControllerDashboardPage").then((m) => ({
    default: m.ControllerDashboardPage,
  }))
)
const GreenEnergyPage = lazy(() =>
  import("./pages/BusinessOfferingDetailPages").then((m) => ({ default: m.GreenEnergyPage }))
)
const FlagshipProjectsPage = lazy(() =>
  import("./pages/BusinessOfferingDetailPages").then((m) => ({ default: m.FlagshipProjectsPage }))
)
const NandasanGalleryPage = lazy(() =>
  import("./pages/flagship/NandasanGalleryPage").then((m) => ({ default: m.NandasanGalleryPage }))
)
const Bcpb2GalleryPage = lazy(() =>
  import("./pages/flagship/Bcpb2GalleryPage").then((m) => ({ default: m.Bcpb2GalleryPage }))
)
const MolPumpsGalleryPage = lazy(() =>
  import("./pages/flagship/MolPumpsGalleryPage").then((m) => ({ default: m.MolPumpsGalleryPage }))
)
const SolarTurbineGalleryPage = lazy(() =>
  import("./pages/flagship/SolarTurbineGalleryPage").then((m) => ({
    default: m.SolarTurbineGalleryPage,
  }))
)
const ClusterCGalleryPage = lazy(() =>
  import("./pages/flagship/ClusterCGalleryPage").then((m) => ({
    default: m.ClusterCGalleryPage,
  }))
)
const DcuNumaligarhGalleryPage = lazy(() =>
  import("./pages/flagship/DcuNumaligarhGalleryPage").then((m) => ({
    default: m.DcuNumaligarhGalleryPage,
  }))
)
const UpstreamOilGasPage = lazy(() =>
  import("./pages/BusinessOfferingDetailPages").then((m) => ({ default: m.UpstreamOilGasPage }))
)
// ─────────────────────────────────────────────────────────────────────────────

function prefetchWhenIdle(loaders: Array<() => Promise<unknown>>) {
  const run = () => {
    for (const load of loaders) void load()
  }
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(run, { timeout: 1500 })
    return () => window.cancelIdleCallback(id)
  }
  const timer = window.setTimeout(run, 280)
  return () => window.clearTimeout(timer)
}

function HomePage() {
  useEffect(() => {
    const previous = history.scrollRestoration
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual"
    }

    if (!window.location.hash) {
      window.scrollTo(0, 0)
      return () => {
        if ("scrollRestoration" in history) history.scrollRestoration = previous
      }
    }

    const timer = window.setTimeout(() => {
      document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "smooth" })
    }, 100)
    return () => {
      window.clearTimeout(timer)
      if ("scrollRestoration" in history) history.scrollRestoration = previous
    }
  }, [])

  useEffect(() => {
    return prefetchWhenIdle([
      () => import("./sections/trust"),
      () => import("./sections/features"),
      () => import("./sections/about"),
      () => import("./sections/services"),
    ])
  }, [])

  return (
    <>
      <main>
        {/* Above-the-fold: render eagerly for fast LCP. */}
        <Hero />
        <DeferredSection component={Trust} minHeight={220} rootMargin="160px 0px" />
        <DeferredSection component={Features} minHeight="100vh" rootMargin="200px 0px" />
        <DeferredSection component={About} minHeight={720} />
        <DeferredSection component={Milestones} minHeight={900} />
        <DeferredSection component={Services} minHeight={720} />
        <DeferredSection component={HomeBusinesses} minHeight={640} />
        <DeferredSection component={Fleet} minHeight={560} />
        <DeferredSection component={CTA} minHeight={280} />
      </main>
      <DeferredSection component={Footer} minHeight={320} />
    </>
  )
}

function AppContent() {
  const location = useLocation()
  const { preferences } = useSiteController()
  const hidePublicChrome = isControllerPath(location.pathname)
  useApplySitePreferences(preferences)

  useEffect(() => {
    const splash = document.getElementById("app-splash")
    if (!splash) return

    if (location.pathname === "/") {
      // Splash already paints the LCP hero from HTML. Keep it until React's
      // hero image is ready (Hero calls dismissInitialSplash) so the swap
      // doesn't flash an empty main.
      const fallback = window.setTimeout(dismissInitialSplash, 1200)
      return () => window.clearTimeout(fallback)
    }

    const frame = window.requestAnimationFrame(dismissInitialSplash)
    return () => window.cancelAnimationFrame(frame)
  }, [location.pathname])

  return (
    <div className="min-h-screen w-full max-w-full min-w-0 bg-background overflow-x-clip">
      <SiteSeo />
      {!hidePublicChrome ? <Navigation /> : null}
      {!hidePublicChrome ? <MaintenancePreviewBanner /> : null}
      <Suspense fallback={<AppLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path={CONTROLLER_ROUTES.login} element={<ControllerLoginPage />} />
          <Route
            path={CONTROLLER_ROUTES.root}
            element={
              <ControllerGuard>
                <ControllerDashboardPage />
              </ControllerGuard>
            }
          />

          {/* About Us */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about/overview" element={<Navigate to="/about#overview" replace />} />
          <Route path="/about/company" element={<Navigate to="/about#company" replace />} />
          <Route path="/about/subsidiaries" element={<Navigate to="/about#subsidiaries" replace />} />
          <Route path="/about/chairman" element={<Navigate to="/about#chairman" replace />} />
          <Route path="/about/ceo" element={<Navigate to="/about#ceo" replace />} />
          <Route path="/about/journey" element={<Navigate to="/about#journey" replace />} />
          <Route path="/about/milestones" element={<Navigate to="/about#milestones" replace />} />
          <Route path="/about/hse" element={<Navigate to="/about#hse" replace />} />
          <Route path="/about/management" element={<Navigate to="/about#management" replace />} />

          {/* Businesses */}
          <Route path="/businesses" element={<BusinessesPage />} />
          <Route path="/businesses/upstream-oil-gas" element={<UpstreamOilGasPage />} />
          <Route path="/businesses/offshore-epc" element={<OffshoreEpcPage />} />
          <Route path="/businesses/onshore-epc" element={<OnshoreEpcPage />} />
          <Route path="/businesses/boo-om" element={<BooOmPage />} />
          <Route path="/businesses/om" element={<Navigate to="/businesses/boo-om" replace />} />
          <Route path="/businesses/bot" element={<Navigate to="/businesses/boo-om" replace />} />
          <Route path="/businesses/green-energy" element={<GreenEnergyPage />} />
          <Route path="/businesses/flagship-projects" element={<FlagshipProjectsPage />} />
          <Route
            path="/businesses/flagship-projects/nandasan"
            element={<NandasanGalleryPage />}
          />
          <Route
            path="/businesses/flagship-projects/bcpb-2"
            element={<Bcpb2GalleryPage />}
          />
          <Route
            path="/businesses/flagship-projects/mol-pumps"
            element={<MolPumpsGalleryPage />}
          />
          <Route
            path="/businesses/flagship-projects/solar-turbine"
            element={<SolarTurbineGalleryPage />}
          />
          <Route
            path="/businesses/flagship-projects/cluster-c"
            element={<ClusterCGalleryPage />}
          />
          <Route
            path="/businesses/flagship-projects/dcu-numaligarh"
            element={<DcuNumaligarhGalleryPage />}
          />

          {/* Careers */}
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/careers/openings" element={<Navigate to="/careers#upload" replace />} />
          <Route path="/careers/upload" element={<Navigate to="/careers#upload" replace />} />

          {/* Contact */}
          <Route path="/contact" element={<ContactPage />} />

          {/* Fallback */}
          <Route path="*" element={<UnderDevelopment pageName="Page Not Found" />} />
        </Routes>
      </Suspense>
      {/* <Chatbot /> */}
    </div>
  )
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <SiteControllerProvider>
          <ThemeProvider defaultTheme="light" storageKey="hal-theme">
            <LanguageProvider>
              <AppContent />
            </LanguageProvider>
          </ThemeProvider>
        </SiteControllerProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
