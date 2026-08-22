export const SPLASH_DISMISSED_EVENT = "hal:splash-dismissed"

function unlockSplashScroll() {
  document.documentElement.removeAttribute("data-splash")
}

export function isSplashActive() {
  return typeof document !== "undefined" && document.documentElement.hasAttribute("data-splash")
}

export function subscribeSplashGone(onStoreChange: () => void) {
  window.addEventListener(SPLASH_DISMISSED_EVENT, onStoreChange)
  return () => window.removeEventListener(SPLASH_DISMISSED_EVENT, onStoreChange)
}

export function getSplashGone() {
  return !isSplashActive()
}

export function dismissInitialSplash() {
  if (typeof document === "undefined") return

  const splash = document.getElementById("app-splash")
  if (!splash || splash.dataset.state === "leaving") {
    unlockSplashScroll()
    return
  }

  splash.dataset.state = "leaving"
  // Unlock immediately so the first wheel/trackpad gesture isn't eaten by the overlay.
  unlockSplashScroll()
  window.dispatchEvent(new Event(SPLASH_DISMISSED_EVENT))
  window.setTimeout(() => splash.remove(), 280)
}
