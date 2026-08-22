import { createHmac, timingSafeEqual } from "node:crypto"
export const CONTROLLER_COOKIE_NAME = "hal_controller_session"
export const CONTROLLER_SESSION_TTL_SEC = 60 * 60 * 12

function isProductionRuntime(): boolean {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production"
}

export function resolveControllerPassword(): string {
  return process.env.CONTROLLER_PASSWORD?.trim() ?? ""
}

function resolveExplicitSessionSecret(): string {
  return process.env.CONTROLLER_SESSION_SECRET?.trim() ?? ""
}

export function isControllerAuthConfigured(): boolean {
  const password = resolveControllerPassword()
  if (!password) return false
  const explicitSecret = resolveExplicitSessionSecret()
  if (isProductionRuntime()) return explicitSecret.length >= 16
  return explicitSecret.length === 0 || explicitSecret.length >= 16
}

export function getSessionSecret(): string {
  const password = resolveControllerPassword()
  if (!password) {
    throw new Error("Controller password is not configured")
  }
  const explicit = resolveExplicitSessionSecret()
  if (explicit.length >= 16) return explicit
  if (explicit.length > 0) {
    throw new Error("Controller session secret must be at least 16 characters")
  }
  if (isProductionRuntime()) {
    throw new Error("Controller session secret is not configured")
  }
  return createHmac("sha256", "hal-controller-session-v1").update(password).digest("hex")
}

export function checkPassword(input: string): boolean {
  const expected = resolveControllerPassword()
  if (!expected) return false
  const secret = getSessionSecret()
  const ha = createHmac("sha256", secret).update(input, "utf8").digest()
  const hb = createHmac("sha256", secret).update(expected, "utf8").digest()
  return timingSafeEqual(ha, hb)
}

export function signSessionToken(): string {
  const exp = Math.floor(Date.now() / 1000) + CONTROLLER_SESSION_TTL_SEC
  const secret = getSessionSecret()
  const sig = createHmac("sha256", secret).update(String(exp)).digest("hex")
  return `${exp}.${sig}`
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false
  const dot = token.indexOf(".")
  if (dot === -1) return false
  const expStr = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  if (!expStr || !sig) return false
  const exp = Number.parseInt(expStr, 10)
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false
  const secret = getSessionSecret()
  const expected = createHmac("sha256", secret).update(String(exp)).digest("hex")
  try {
    return timingSafeEqual(Buffer.from(sig, "utf8"), Buffer.from(expected, "utf8"))
  } catch {
    return false
  }
}

export function buildSessionCookie(token: string, maxAgeSec: number, secure: boolean): string {
  const parts = [
    `${CONTROLLER_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSec}`,
  ]
  if (secure) parts.push("Secure")
  return parts.join("; ")
}

export function readCookie(cookieHeader: string | undefined, name: string): string | undefined {
  if (!cookieHeader) return undefined
  for (const segment of cookieHeader.split(";")) {
    const trimmed = segment.trim()
    if (!trimmed) continue
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    const key = trimmed.slice(0, eq)
    if (key !== name) continue
    return decodeURIComponent(trimmed.slice(eq + 1))
  }
  return undefined
}

export function buildClearSessionCookie(secure: boolean): string {
  const parts = [
    `${CONTROLLER_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ]
  if (secure) parts.push("Secure")
  return parts.join("; ")
}
