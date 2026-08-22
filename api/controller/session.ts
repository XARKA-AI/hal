import type { ApiRequest, ApiResponse } from "./http-types.js"
import { applyAuthNoStoreHeaders } from "../../lib/controller-http.js"
import {
  CONTROLLER_COOKIE_NAME,
  isControllerAuthConfigured,
  readCookie,
  verifySessionToken,
} from "../../lib/controller-session.js"

export default function handler(req: ApiRequest, res: ApiResponse) {
  applyAuthNoStoreHeaders(res)
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).json({ error: "method_not_allowed" })
    return
  }

  if (!isControllerAuthConfigured()) {
    res.status(503).json({ ok: false, error: "auth_not_configured" })
    return
  }

  const cookie = readCookie(req.headers.cookie, CONTROLLER_COOKIE_NAME)
  if (!verifySessionToken(cookie)) {
    if (req.method === "HEAD") {
      res.status(401).end()
      return
    }
    res.status(401).json({ ok: false })
    return
  }

  if (req.method === "HEAD") {
    res.status(200).end()
    return
  }
  res.status(200).json({ ok: true })
}
