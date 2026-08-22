import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Globe } from "lucide-react"
import { useLanguage, type Language } from "./language-context"

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "हिंदी", flag: "🇮🇳" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
]

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (event: MouseEvent) => {
      const root = rootRef.current
      if (root && !root.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDocClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const active = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0]

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Change language. Current language: ${active.label}`}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
      >
        <Globe className="w-4 h-4" aria-hidden />
        <span className="uppercase font-medium">{active.code}</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            role="listbox"
            aria-label="Languages"
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute top-full right-0 mt-2 w-44 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50"
          >
            {LANGUAGES.map((lang) => {
              const isActive = language === lang.code
              return (
                <li key={lang.code} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code)
                      setOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-muted transition-colors focus-visible:outline-none focus-visible:bg-muted ${
                      isActive ? "bg-muted/80 font-medium" : ""
                    }`}
                  >
                    <span className="text-base leading-none" aria-hidden>
                      {lang.flag}
                    </span>
                    <span className="flex-1">{lang.label}</span>
                    {isActive ? (
                      <Check className="w-3.5 h-3.5 text-foreground/70" aria-hidden />
                    ) : null}
                  </button>
                </li>
              )
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
