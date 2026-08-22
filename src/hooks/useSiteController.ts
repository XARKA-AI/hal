import { useContext } from "react"
import { SiteControllerContext } from "@/context/site-controller-context-core"

export function useSiteController() {
  const ctx = useContext(SiteControllerContext)
  if (!ctx) {
    throw new Error("useSiteController must be used within SiteControllerProvider")
  }
  return ctx
}
