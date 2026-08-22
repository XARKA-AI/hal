import type { ApiRequest, ApiResponse } from "./http-types.js"
import { applyAuthNoStoreHeaders } from "../../lib/controller-http.js"
import {
  buildSessionCookie,
  checkPassword,
  isControllerAuthConfigured,
  signSessionToken,
  CONTROLLER_SESSION_TTL_SEC,
} from "../../lib/controller-session.js"

function isSecure(req: ApiRequest): boolean {
  return process.env.VERCEL === "1" || req.headers["x-forwarded-proto"] === "https"
}

function readPassword(req: ApiRequest): string {
  const body = req.body
  if (body && typeof body === "object" && "password" in body) {
    const p = (body as { password?: unknown }).password
    return typeof p === "string" ? p : ""
  }
  if (typeof body === "string") {
    try {
      const o = JSON.parse(body) as { password?: unknown }
      return typeof o.password === "string" ? o.password : ""
    } catch {
      return ""
    }
  }
  return ""
}

export default function handler(req: ApiRequest, res: ApiResponse) {
  applyAuthNoStoreHeaders(res)
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" })
    return
  }

  if (!isControllerAuthConfigured()) {
    res.status(503).json({ error: "auth_not_configured" })
    return
  }

  try {
    const password = readPassword(req)
    if (!checkPassword(password)) {
      res.status(401).json({ error: "invalid_password" })
      return
    }
    const token = signSessionToken()
    res.setHeader("Set-Cookie", buildSessionCookie(token, CONTROLLER_SESSION_TTL_SEC, isSecure(req)))
    res.status(200).json({ ok: true })
  } catch {
    res.status(400).json({ error: "bad_request" })
  }
}
