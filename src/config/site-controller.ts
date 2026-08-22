export const SITE_CONTROLLER_STORAGE_KEY = "hal_site_controller_prefs_v1"

export const CONTROLLER_API = {
  session: "/api/controller/session",
  login: "/api/controller/login",
  logout: "/api/controller/logout",
} as const

export const CONTROLLER_ROUTES = {
  root: "/haloffshore/controller",
  login: "/haloffshore/controller/login",
} as const

export interface SitePreferences {
  reduceMotion: boolean
  performanceMode: boolean
  maintenanceBannerEnabled: boolean
  maintenanceBannerMessage: string
}

export const DEFAULT_SITE_PREFERENCES: SitePreferences = {
  reduceMotion: false,
  performanceMode: false,
  maintenanceBannerEnabled: false,
  maintenanceBannerMessage:
    "HAL Offshore is preparing updates. The public site may change shortly.",
}

export function isControllerPath(pathname: string): boolean {
  return (
    pathname === CONTROLLER_ROUTES.root ||
    pathname.startsWith(`${CONTROLLER_ROUTES.root}/`)
  )
}

export function parseStoredPreferences(raw: string | null): SitePreferences {
  if (!raw) return { ...DEFAULT_SITE_PREFERENCES }
  try {
    const data = JSON.parse(raw) as Partial<SitePreferences>
    return {
      ...DEFAULT_SITE_PREFERENCES,
      ...data,
      maintenanceBannerMessage:
        typeof data.maintenanceBannerMessage === "string"
          ? data.maintenanceBannerMessage
          : DEFAULT_SITE_PREFERENCES.maintenanceBannerMessage,
    }
  } catch {
    return { ...DEFAULT_SITE_PREFERENCES }
  }
}
