import { useEffect, useRef } from "react"

export function useScrollFeedback() {
  const lastScrollY = useRef(0)
  const lastFiredAt = useRef(0)
  const audioCtx = useRef<AudioContext | null>(null)
  const unlocked = useRef(false)

  // Unlock AudioContext on first user gesture (required by browsers)
  const unlock = () => {
    if (unlocked.current) return
    try {
      const CtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      audioCtx.current = new CtxClass()
      // Play a silent buffer to fully unlock
      const buffer = audioCtx.current.createBuffer(1, 1, 22050)
      const source = audioCtx.current.createBufferSource()
      source.buffer = buffer
      source.connect(audioCtx.current.destination)
      source.start(0)
      unlocked.current = true
    } catch {
      // ignore
    }
  }

  const playTick = async () => {
    if (!audioCtx.current) return
    try {
      const ctx = audioCtx.current
      // Resume if browser auto-suspended it
      if (ctx.state === "suspended") await ctx.resume()

      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(800, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.06)

      gainNode.gain.setValueAtTime(0.12, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.08)
    } catch {
      // ignore
    }
  }

  const triggerHaptic = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(10)
    }
  }

  useEffect(() => {
    const THROTTLE_MS = 150

    // Unlock on any user interaction
    const interactionEvents = ["click", "touchstart", "keydown", "pointerdown"]
    interactionEvents.forEach((e) => window.addEventListener(e, unlock, { once: true, passive: true }))

    const handleScroll = () => {
      const now = Date.now()
      const currentY = window.scrollY
      const delta = Math.abs(currentY - lastScrollY.current)

      if (delta < 40) return
      if (now - lastFiredAt.current < THROTTLE_MS) return

      lastScrollY.current = currentY
      lastFiredAt.current = now

      playTick()
      triggerHaptic()
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      interactionEvents.forEach((e) => window.removeEventListener(e, unlock))
    }
  }, [])
}
