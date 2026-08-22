import { useEffect } from "react"

/** Discourage indexing of the team controller surfaces (SPA has a single index.html). */
export function useControllerSeoNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta")
    meta.setAttribute("name", "robots")
    meta.setAttribute("content", "noindex, nofollow")
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])
}
