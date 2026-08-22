import { createContext } from "react"
import type { SitePreferences } from "@/config/site-controller"

type ControllerAuthStatus = "unknown" | "guest" | "authed"

export type SiteControllerContextValue = {
  authStatus: ControllerAuthStatus
  preferences: SitePreferences
  setPreference: <K extends keyof SitePreferences>(key: K, value: SitePreferences[K]) => void
  refreshSession: () => Promise<void>
  login: (password: string) => Promise<{ ok: true } | { ok: false; reason: string }>
  logout: () => Promise<void>
}

export const SiteControllerContext = createContext<SiteControllerContextValue | null>(null)
