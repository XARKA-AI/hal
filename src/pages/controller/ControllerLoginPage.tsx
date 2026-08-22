import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router"
import {
  IosBackdrop,
  IosCaption,
  IosContainer,
  IosLargeTitle,
  IosPrimaryButton,
  IosScreen,
  IosTextField,
} from "@/components/controller/ios-ui"
import { CONTROLLER_ROUTES } from "@/config/site-controller"
import { useSiteController } from "@/hooks/useSiteController"
import { useControllerSeoNoIndex } from "./useControllerSeoNoIndex"

export function ControllerLoginPage() {
  useControllerSeoNoIndex()
  const navigate = useNavigate()
  const { authStatus, refreshSession, login } = useSiteController()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const handle = window.setTimeout(() => {
      void refreshSession()
    }, 0)
    return () => window.clearTimeout(handle)
  }, [refreshSession])

  if (authStatus === "authed") {
    return <Navigate to={CONTROLLER_ROUTES.root} replace />
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    const result = await login(password)
    setBusy(false)
    if (result.ok) {
      navigate(CONTROLLER_ROUTES.root, { replace: true })
      return
    }
    if (result.reason === "not_configured") {
      setError("Controller auth is not configured. Set CONTROLLER_PASSWORD in Vercel (or .env locally).")
      return
    }
    if (result.reason === "network") {
      setError("Could not reach the server. For local dev, run vite with CONTROLLER_PASSWORD in .env")
      return
    }
    setError("Incorrect password.")
  }

  return (
    <IosScreen>
      <IosBackdrop>
        <div className="w-full max-w-md flex flex-col items-center">
          <Link
            to="/"
            className="mb-8 flex flex-col items-center gap-1 text-white/90 hover:text-white transition"
          >
            <span className="text-2xl font-bold tracking-tight">HAL</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#001F3F]">
              Offshore
            </span>
            <span className="text-[13px] text-white/50">Controller</span>
          </Link>

          <IosContainer>
            <IosLargeTitle>Sign in</IosLargeTitle>
            <IosCaption>Password-protected team console for usability, performance, and security toggles.</IosCaption>

            <form onSubmit={onSubmit} className="mt-2">
              <IosTextField
                id="controller-password"
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
              />
              {error ? (
                <p className="mt-3 text-[14px] text-red-300/95 text-center leading-snug" role="alert">
                  {error}
                </p>
              ) : null}
              <div className="mt-6">
                <IosPrimaryButton type="submit" disabled={busy || !password}>
                  {busy ? "Signing in…" : "Sign In"}
                </IosPrimaryButton>
              </div>
            </form>
          </IosContainer>

          <p className="mt-8 text-center text-[12px] text-white/40 max-w-sm leading-relaxed">
            Session is stored in an HttpOnly cookie. Use a strong password and rotate
            CONTROLLER_SESSION_SECRET on Vercel for production teams.
          </p>
        </div>
      </IosBackdrop>
    </IosScreen>
  )
}
