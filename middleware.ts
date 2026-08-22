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

export default function middleware(request: Request): Promise<Response> {
  const isMaintenance = process.env.MAINTENANCE_MODE === "true"
  const url = new URL(request.url)
  const { pathname } = url

  if (!isMaintenance || isSkippablePath(pathname)) {
    return fetch(request)
  }

  const maintenanceUrl = new URL(MAINTENANCE_PAGE, request.url)
  return fetch(new Request(maintenanceUrl, request))
}

export const config = {
  matcher: "/:path*",
}
