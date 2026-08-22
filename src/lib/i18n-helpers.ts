/** Collect numbered translation keys `{prefix}.1` … until missing in the active locale map. */
export function translatedLines(
  t: (key: string) => string,
  strings: Record<string, string>,
  prefix: string,
  max = 24,
): string[] {
  const lines: string[] = []
  for (let i = 1; i <= max; i++) {
    const key = `${prefix}.${i}`
    if (!(key in strings)) break
    lines.push(t(key))
  }
  return lines
}

export function translatedField(
  t: (key: string) => string,
  strings: Record<string, string>,
  key: string,
  fallback = "",
): string {
  if (key in strings) return t(key)
  return fallback
}
