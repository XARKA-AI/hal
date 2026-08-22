import { useEffect, type ReactNode } from "react"
import { Navigate } from "react-router"
import { CONTROLLER_ROUTES } from "@/config/site-controller"
import { useSiteController } from "@/hooks/useSiteController"
import { IosCaption, IosLargeTitle, IosScreen } from "@/components/controller/ios-ui"

export function ControllerGuard({ children }: { children: ReactNode }) {
  const { authStatus, refreshSession } = useSiteController()

  useEffect(() => {
    const handle = window.setTimeout(() => {
      void refreshSession()
    }, 0)
    return () => window.clearTimeout(handle)
  }, [refreshSession])

  if (authStatus === "unknown") {
    return (
      <IosScreen className="bg-[#051020]">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="text-center">
            <IosLargeTitle>HAL Controller</IosLargeTitle>
            <IosCaption>Checking session…</IosCaption>
          </div>
        </div>
      </IosScreen>
    )
  }

  if (authStatus === "guest") {
    return <Navigate to={CONTROLLER_ROUTES.login} replace />
  }

  return children
}
