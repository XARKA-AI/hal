import { X } from "lucide-react"
import { useState } from "react"
import { useSiteController } from "@/hooks/useSiteController"

export function MaintenancePreviewBanner() {
  const { preferences } = useSiteController()
  const [dismissed, setDismissed] = useState(false)

  if (!preferences.maintenanceBannerEnabled || dismissed) return null

  return (
    <div
      role="status"
      className="fixed bottom-0 inset-x-0 z-[60] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pointer-events-none"
    >
      <div className="pointer-events-auto mx-auto max-w-3xl rounded-2xl border border-[#FFCA23]/40 bg-[#001F3F]/95 px-4 py-3 text-sm text-white shadow-lg backdrop-blur-md flex gap-3 items-start">
        <p className="flex-1 leading-relaxed">{preferences.maintenanceBannerMessage}</p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-full p-1 text-white/70 hover:text-white hover:bg-white/10 transition"
          aria-label="Dismiss preview banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
