import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useIsMobile } from "@/hooks/use-mobile"

const originalMatchMedia = window.matchMedia

afterEach(() => {
  window.matchMedia = originalMatchMedia
})

describe("useIsMobile", () => {
  it("tracks mobile breakpoint changes", () => {
    let matches = false
    const listeners = new Set<(event: MediaQueryListEvent) => void>()

    window.matchMedia = vi.fn((query: string): MediaQueryList => ({
      get matches() {
        return matches
      },
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: (_type: string, listener: EventListenerOrEventListenerObject) => {
        listeners.add(listener as (event: MediaQueryListEvent) => void)
      },
      removeEventListener: (_type: string, listener: EventListenerOrEventListenerObject) => {
        listeners.delete(listener as (event: MediaQueryListEvent) => void)
      },
      dispatchEvent: () => false,
    }))

    const { result, unmount } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    act(() => {
      matches = true
      const event = { matches, media: "(max-width: 767px)" } as MediaQueryListEvent
      listeners.forEach((listener) => listener(event))
    })

    expect(result.current).toBe(true)
    unmount()
    expect(listeners.size).toBe(0)
  })
})
