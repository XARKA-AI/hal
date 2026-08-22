import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react"
import { LanguageContext, type Language } from "./language-context"

type TranslationMap = Record<string, string>

const SUPPORTED_LANGUAGES: readonly Language[] = ["en", "hi", "ar"] as const
const STORAGE_KEY = "hal.language"

const translationImporters: Record<Language, () => Promise<{ default: TranslationMap }>> = {
  en: () => import("../data/i18n-en.json"),
  hi: () => import("../data/i18n-hi.json"),
  ar: () => import("../data/i18n-ar.json"),
}

const cache = new Map<Language, TranslationMap>()
const inflight = new Map<Language, Promise<TranslationMap>>()
let translationsListener: (() => void) | null = null

function loadLanguage(lang: Language): Promise<TranslationMap> {
  const cached = cache.get(lang)
  if (cached) return Promise.resolve(cached)
  const existing = inflight.get(lang)
  if (existing) return existing
  const p = translationImporters[lang]().then((mod) => {
    const data = mod.default
    cache.set(lang, data)
    inflight.delete(lang)
    return data
  })
  inflight.set(lang, p)
  return p
}

if (import.meta.hot) {
  const apply = (lang: Language, mod: unknown) => {
    const data =
      mod && typeof mod === "object" && "default" in mod
        ? (mod as { default: TranslationMap }).default
        : undefined
    if (!data) return
    cache.set(lang, data)
    translationsListener?.()
  }
  import.meta.hot.accept("../data/i18n-en.json", (mod) => apply("en", mod))
  import.meta.hot.accept("../data/i18n-hi.json", (mod) => apply("hi", mod))
  import.meta.hot.accept("../data/i18n-ar.json", (mod) => apply("ar", mod))
}

function detectInitialLanguage(): Language {
  if (typeof window === "undefined") return "en"
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored && SUPPORTED_LANGUAGES.includes(stored as Language)) {
      return stored as Language
    }
  } catch {
    /* localStorage unavailable (Safari private mode, etc.) — fall through. */
  }
  const nav = window.navigator
  const candidates = [
    ...(Array.isArray(nav.languages) ? nav.languages : []),
    nav.language,
  ].filter(Boolean) as string[]
  for (const raw of candidates) {
    const base = raw.toLowerCase().split("-")[0] as Language
    if (SUPPORTED_LANGUAGES.includes(base)) return base
  }
  return "en"
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageRaw] = useState<Language>(detectInitialLanguage)
  // Bumped when async JSON import finishes so consumers re-read the module cache.
  const [version, setVersion] = useState(0)
  const mounted = useRef(false)

  useEffect(() => {
    translationsListener = () => setVersion((v) => v + 1)
    return () => {
      translationsListener = null
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  // Load translations for the active language (cache-aware). If the cache
  // already has the language, the synchronous render below will pick it up
  // straight away — no version bump (and no setState-in-effect) needed.
  useEffect(() => {
    if (cache.has(language)) return
    let cancelled = false
    loadLanguage(language).then(() => {
      if (cancelled || !mounted.current) return
      setVersion((v) => v + 1)
    })
    return () => {
      cancelled = true
    }
  }, [language])

  // Load Devanagari Poppins only when Hindi is active (saves ~120 KB on en/ar visits).
  useEffect(() => {
    if (language !== "hi") return
    void Promise.all([
      import("@fontsource/poppins/devanagari-400.css"),
      import("@fontsource/poppins/devanagari-600.css"),
      import("@fontsource/poppins/devanagari-700.css"),
    ])
  }, [language])
  // pick up the right direction without wrapping children in an extra <div>.
  useEffect(() => {
    if (typeof document === "undefined") return
    const html = document.documentElement
    html.setAttribute("lang", language)
    html.setAttribute("dir", language === "ar" ? "rtl" : "ltr")
  }, [language])

  const setLanguage = useCallback((lang: Language) => {
    if (!SUPPORTED_LANGUAGES.includes(lang)) return
    setLanguageRaw(lang)
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignore quota / private-mode errors. */
    }
  }, [])

  const strings = useMemo(() => {
    // Tie to `version` so this re-runs when async import hydrates `cache`.
    void version
    return cache.get(language) ?? {}
  }, [language, version])

  const t = useCallback(
    (key: string): string => {
      if (key in strings) return strings[key]
      // Fallback chain: English → key itself. Prevents UI flashing the raw key
      // before the active-language file has finished streaming in.
      const enMap = cache.get("en")
      if (enMap && key in enMap) return enMap[key]
      return key
    },
    [strings],
  )

  const value = useMemo(
    () => ({ language, setLanguage, t, strings }),
    [language, setLanguage, t, strings],
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}
