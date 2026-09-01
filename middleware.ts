const MAINTENANCE_PAGE = "/maintenance.html"

function isSkippablePath(pathname: string): boolean {
  if (pathname === MAINTENANCE_PAGE) return true
  if (pathname.startsWith("/api/")) return true
  if (pathname.startsWith("/haloffshore")) return true
  if (pathname.startsWith("/assets/")) return true
  if (pathname.startsWith("/images/")) return true
  if (/\.[a-z0-9]+$/i.test(pathname)) return true
  return false
}

export default function middleware(request: Request): Promise<Response> | void {
  const isMaintenance = process.env.MAINTENANCE_MODE === "true"
  const url = new URL(request.url)
  const { pathname } = url

  // Do not fetch the original URL. On Vercel that looks up a real file
  // (there is no /about.html) and returns 404 before SPA rewrites run.
  if (!isMaintenance || isSkippablePath(pathname)) {
    return
  }

  const maintenanceUrl = new URL(MAINTENANCE_PAGE, request.url)
  return fetch(new Request(maintenanceUrl, request))
}

export const config = {
  matcher: "/:path*",
}
