import type { IncomingMessage, ServerResponse } from "node:http"
import { applyAuthNoStoreHeaders } from "../lib/controller-http.ts"
import {
  buildClearSessionCookie,
  buildSessionCookie,
  checkPassword,
  CONTROLLER_COOKIE_NAME,
  CONTROLLER_SESSION_TTL_SEC,
  isControllerAuthConfigured,
  readCookie,
  signSessionToken,
  verifySessionToken,
} from "../lib/controller-session.ts"

const MAX_LOGIN_BODY_BYTES = 16_384
const LOGIN_RATE_WINDOW_MS = 60_000
const LOGIN_RATE_MAX = 40

const loginRate = new Map<string, { count: number; resetAt: number }>()

function readBodyLimited(req: IncomingMessage, maxBytes: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let total = 0
    req.on("data", (chunk) => {
      total += chunk.length
      if (total > maxBytes) {
        req.destroy()
        reject(new Error("payload_too_large"))
        return
      }
      chunks.push(Buffer.from(chunk))
    })
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
    req.on("error", reject)
  })
}

function clientIp(req: IncomingMessage): string {
  const forwarded = req.headers["x-forwarded-for"]
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]?.trim() ?? "unknown"
  }
  return req.socket.remoteAddress ?? "unknown"
}

function allowLoginAttempt(ip: string): boolean {
  const now = Date.now()
  const entry = loginRate.get(ip)
  if (!entry || now > entry.resetAt) {
    loginRate.set(ip, { count: 1, resetAt: now + LOGIN_RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= LOGIN_RATE_MAX) return false
  entry.count += 1
  return true
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  applyAuthNoStoreHeaders(res)
  res.statusCode = status
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify(body))
}

export function controllerApiDevMiddleware() {
  return async (req: IncomingMessage, res: ServerResponse, next: (err?: unknown) => void) => {
    const rawUrl = req.url ?? ""
    const pathOnly = rawUrl.split("?")[0] ?? ""

    if (!pathOnly.startsWith("/api/controller/")) {
      next()
      return
    }

    const secure = false

    try {
      if (!isControllerAuthConfigured()) {
        sendJson(res, 503, { error: "auth_not_configured", ok: false })
        return
      }

      if (pathOnly === "/api/controller/session" && (req.method === "GET" || req.method === "HEAD")) {
        const cookie = readCookie(req.headers.cookie, CONTROLLER_COOKIE_NAME)
        const ok = verifySessionToken(cookie)
        if (req.method === "HEAD") {
          applyAuthNoStoreHeaders(res)
          res.statusCode = ok ? 200 : 401
          res.end()
          return
        }
        sendJson(res, ok ? 200 : 401, ok ? { ok: true } : { ok: false })
        return
      }

      if (pathOnly === "/api/controller/logout" && req.method === "POST") {
        res.setHeader("Set-Cookie", buildClearSessionCookie(secure))
        sendJson(res, 200, { ok: true })
        return
      }

      if (pathOnly === "/api/controller/login" && req.method === "POST") {
        const ip = clientIp(req)
        if (!allowLoginAttempt(ip)) {
          sendJson(res, 429, { error: "too_many_requests" })
          return
        }
        let raw: string
        try {
          raw = await readBodyLimited(req, MAX_LOGIN_BODY_BYTES)
        } catch (e) {
          if (e instanceof Error && e.message === "payload_too_large") {
            sendJson(res, 413, { error: "payload_too_large" })
            return
          }
          throw e
        }
        let password = ""
        try {
          const parsed = JSON.parse(raw) as { password?: unknown }
          password = typeof parsed.password === "string" ? parsed.password : ""
        } catch {
          sendJson(res, 400, { error: "bad_request" })
          return
        }
        if (!checkPassword(password)) {
          sendJson(res, 401, { error: "invalid_password" })
          return
        }
        const token = signSessionToken()
        res.setHeader("Set-Cookie", buildSessionCookie(token, CONTROLLER_SESSION_TTL_SEC, secure))
        sendJson(res, 200, { ok: true })
        return
      }

      res.statusCode = 404
      res.end()
    } catch (e) {
      next(e)
    }
  }
}
