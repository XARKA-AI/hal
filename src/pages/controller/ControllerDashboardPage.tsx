import { useNavigate } from "react-router"
import {
  IosBackdrop,
  IosCaption,
  IosContainer,
  IosGroup,
  IosLargeTitle,
  IosPrimaryButton,
  IosRow,
  IosScreen,
  IosSecondaryButton,
  IosTextField,
  IosToggle,
} from "@/components/controller/ios-ui"
import { CONTROLLER_ROUTES } from "@/config/site-controller"
import { useSiteController } from "@/hooks/useSiteController"
import { useControllerSeoNoIndex } from "./useControllerSeoNoIndex"

export function ControllerDashboardPage() {
  useControllerSeoNoIndex()
  const navigate = useNavigate()
  const { preferences, setPreference, logout } = useSiteController()

  const handleLogout = async () => {
    await logout()
    navigate(CONTROLLER_ROUTES.login, { replace: true })
  }

  return (
    <IosScreen>
      <IosBackdrop>
        <div className="w-full max-w-md">
          <IosContainer className="max-w-none">
            <IosLargeTitle>HAL Controller</IosLargeTitle>
            <IosCaption>
              Tune this browser&apos;s experience. Maintenance preview and motion settings apply locally
              on this device.
            </IosCaption>

            <IosGroup>
              <IosRow
                label="Reduce motion"
                description="Shortens animations site-wide for accessibility and calmer UI."
                control={
                  <IosToggle
                    ariaLabel="Reduce motion"
                    pressed={preferences.reduceMotion}
                    onPressedChange={(v) => setPreference("reduceMotion", v)}
                  />
                }
              />
              <IosRow
                label="Performance mode"
                description="Aggressive animation throttling for low-power devices."
                control={
                  <IosToggle
                    ariaLabel="Performance mode"
                    pressed={preferences.performanceMode}
                    onPressedChange={(v) => setPreference("performanceMode", v)}
                  />
                }
              />
              <IosRow
                label="Maintenance preview"
                description="Show a bottom banner on the public site (this browser only)."
                control={
                  <IosToggle
                    ariaLabel="Maintenance preview banner"
                    pressed={preferences.maintenanceBannerEnabled}
                    onPressedChange={(v) => setPreference("maintenanceBannerEnabled", v)}
                  />
                }
              />
            </IosGroup>

            <label htmlFor="banner-msg" className="sr-only">
              Maintenance banner message
            </label>
            <IosTextField
              id="banner-msg"
              label="Banner message"
              value={preferences.maintenanceBannerMessage}
              onChange={(v) => setPreference("maintenanceBannerMessage", v)}
            />

            <div className="mt-8 space-y-3">
              <IosSecondaryButton onClick={() => navigate("/")}>Back to site</IosSecondaryButton>
              <IosPrimaryButton type="button" onClick={() => void handleLogout()}>
                Sign out
              </IosPrimaryButton>
            </div>
          </IosContainer>

          <div className="mt-8 rounded-[1.1rem] border border-white/12 bg-white/[0.05] px-4 py-4 text-[13px] text-white/65 leading-relaxed backdrop-blur-md">
            <p className="font-semibold text-white/85 text-[14px] mb-2">Security checklist</p>
            <ul className="list-disc pl-4 space-y-1.5">
              <li>Set CONTROLLER_PASSWORD only in Vercel environment variables (never in client code).</li>
              <li>Add CONTROLLER_SESSION_SECRET (16+ chars) for dedicated signing material.</li>
              <li>Site-wide maintenance still uses MAINTENANCE_MODE on the Edge middleware.</li>
              <li>Controller routes stay available under /haloffshore/controller when maintenance is on.</li>
            </ul>
          </div>
        </div>
      </IosBackdrop>
    </IosScreen>
  )
}
