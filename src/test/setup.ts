/**
 * Global test setup — runs once before every test file in the suite.
 *
 * - Registers `@testing-library/jest-dom` matchers (`toBeInTheDocument`,
 *   `toHaveClass`, etc.) onto Vitest's `expect`.
 * - Cleans up the DOM between tests so leaked nodes don't poison the next
 *   render.
 * - Stubs the matchMedia API that headless React / Radix code paths call
 *   during mount (jsdom doesn't ship it).
 */
import "@testing-library/jest-dom/vitest"
import { afterEach } from "vitest"
import { cleanup } from "@testing-library/react"

afterEach(() => {
  cleanup()
})

if (typeof window !== "undefined" && !window.matchMedia) {
  // Minimal MediaQueryList stub — components only ever read `.matches` and
  // attach listeners. Tests can override per-suite when they need a real
  // match.
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}
