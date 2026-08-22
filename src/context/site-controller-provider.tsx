import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { useLocation } from "react-router"
import {
  CONTROLLER_API,
  DEFAULT_SITE_PREFERENCES,
  SITE_CONTROLLER_STORAGE_KEY,
  type SitePreferences,
  isControllerPath,
  parseStoredPreferences,
} from "@/config/site-controller"
import { SiteControllerContext } from "./site-controller-context-core"

type ControllerAuthStatus = "unknown" | "guest" | "authed"

function loadPrefs(): SitePreferences {
  if (typeof window === "undefined") return { ...DEFAULT_SITE_PREFERENCES }
  return parseStoredPreferences(localStorage.getItem(SITE_CONTROLLER_STORAGE_KEY))
}

function savePrefs(prefs: SitePreferences) {
  localStorage.setItem(SITE_CONTROLLER_STORAGE_KEY, JSON.stringify(prefs))
}

export function SiteControllerProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [authStatus, setAuthStatus] = useState<ControllerAuthStatus>("unknown")
  const [preferences, setPreferences] = useState<SitePreferences>(() => loadPrefs())

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch(CONTROLLER_API.session, { credentials: "include" })
      if (res.status === 503) {
        setAuthStatus("guest")
        return
      }
      setAuthStatus(res.ok ? "authed" : "guest")
    } catch {
      setAuthStatus("guest")
    }
  }, [])

  useEffect(() => {
    if (!isControllerPath(location.pathname)) return
    const handle = window.setTimeout(() => {
      void refreshSession()
    }, 0)
    return () => window.clearTimeout(handle)
  }, [location.pathname, refreshSession])

  const setPreference = useCallback(<K extends keyof SitePreferences>(key: K, value: SitePreferences[K]) => {
    setPreferences((prev) => {
      const next = { ...prev, [key]: value }
      savePrefs(next)
      return next
    })
  }, [])

  const login = useCallback(async (password: string) => {
    try {
      const res = await fetch(CONTROLLER_API.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      })
      if (res.status === 503) {
        return { ok: false as const, reason: "not_configured" }
      }
      if (!res.ok) {
        return { ok: false as const, reason: "invalid_password" }
      }
      setAuthStatus("authed")
      return { ok: true as const }
    } catch {
      return { ok: false as const, reason: "network" }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch(CONTROLLER_API.logout, { method: "POST", credentials: "include" })
    } catch {
      /* ignore */
    }
    setAuthStatus("guest")
  }, [])

  const value = useMemo(
    () => ({
      authStatus,
      preferences,
      setPreference,
      refreshSession,
      login,
      logout,
    }),
    [authStatus, preferences, setPreference, refreshSession, login, logout],
  )

  return <SiteControllerContext.Provider value={value}>{children}</SiteControllerContext.Provider>
}
