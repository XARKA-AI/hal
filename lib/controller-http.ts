/** Prevent shared caches from storing auth responses or Set-Cookie metadata. */
export function applyAuthNoStoreHeaders(res: { setHeader(name: string, value: string): void }) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private")
  res.setHeader("Pragma", "no-cache")
}
