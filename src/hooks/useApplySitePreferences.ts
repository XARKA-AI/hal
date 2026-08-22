import { useEffect } from "react"
import type { SitePreferences } from "@/config/site-controller"

export function useApplySitePreferences(prefs: SitePreferences) {
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("hal-pref-reduce-motion", prefs.reduceMotion)
    root.classList.toggle("hal-pref-performance", prefs.performanceMode)
    return () => {
      root.classList.remove("hal-pref-reduce-motion", "hal-pref-performance")
    }
  }, [prefs.reduceMotion, prefs.performanceMode])
}
