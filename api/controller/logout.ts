import type { ApiRequest, ApiResponse } from "./http-types.js"
import { applyAuthNoStoreHeaders } from "../../lib/controller-http.js"
import { buildClearSessionCookie } from "../../lib/controller-session.js"

function isSecure(req: ApiRequest): boolean {
  return process.env.VERCEL === "1" || req.headers["x-forwarded-proto"] === "https"
}

export default function handler(req: ApiRequest, res: ApiResponse) {
  applyAuthNoStoreHeaders(res)
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" })
    return
  }
  res.setHeader("Set-Cookie", buildClearSessionCookie(isSecure(req)))
  res.status(200).json({ ok: true })
}
