import { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router"
import { motion } from "framer-motion"
import { ArrowRight, Upload } from "lucide-react"
import { useLanguage } from "../components/language-context"
import {
  STANDARD_PAGE_HERO_SECTION_CLASS,
  StandardPageHeroInset,
} from "../components/standard-page-hero-inset"
import { Footer } from "../sections/footer"

const CAREERS_INBOX = "info@haloffshore.com"
const MAX_CV_BYTES = 10 * 1024 * 1024
const ALLOWED_CV_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
])

function isAllowedCv(file: File) {
  if (ALLOWED_CV_TYPES.has(file.type)) return true
  return /\.(pdf|docx?)$/i.test(file.name)
}

async function sendCareerApplication(payload: {
  name: string
  email: string
  phone: string
  role: string
  message: string
  cv: File
}) {
  const data = new FormData()
  data.append("name", payload.name.trim())
  data.append("email", payload.email.trim())
  data.append("phone", payload.phone.trim())
  data.append("role", payload.role.trim())
  data.append("message", payload.message.trim())
  data.append("attachment", payload.cv, payload.cv.name)
  data.append(
    "_subject",
    `Career application: ${payload.name.trim()}${payload.role.trim() ? ` — ${payload.role.trim()}` : ""}`,
  )
  data.append("_template", "table")
  data.append("_captcha", "false")
  data.append("_honey", "")

  const res = await fetch(`https://formsubmit.co/ajax/${CAREERS_INBOX}`, {
    method: "POST",
    body: data,
    headers: { Accept: "application/json" },
  })
  const json = (await res.json().catch(() => null)) as
    | { success?: boolean | string; message?: string }
    | null
  if (!res.ok || json?.success === false || json?.success === "false") {
    throw new Error(json?.message || "send_failed")
  }
}

export function CareersPage() {
  const { t, language } = useLanguage()
  const location = useLocation()
  const dir = language === "ar" ? "rtl" : "ltr"
  const cvInputRef = useRef<HTMLInputElement>(null)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [fileName, setFileName] = useState("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    message: "",
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    if (!location.hash) return undefined
    const id = decodeURIComponent(location.hash.replace(/^#/, ""))
    const targetId = id === "openings" ? "upload" : id
    const run = () => {
      const el = document.getElementById(targetId)
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    const t0 = window.requestAnimationFrame(() => {
      window.setTimeout(run, 40)
    })
    return () => cancelAnimationFrame(t0)
  }, [location.hash, location.pathname])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cv = cvInputRef.current?.files?.[0]
    if (!cv) return

    if (cv.size > MAX_CV_BYTES || !isAllowedCv(cv)) {
      setSubmitError(t("careersPage.form.fileTooLarge"))
      return
    }

    setSubmitting(true)
    setSubmitError(null)
    try {
      await sendCareerApplication({ ...form, cv })
      setFormSubmitted(true)
    } catch {
      setSubmitError(t("careersPage.form.error"))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="overflow-x-hidden bg-background text-foreground" dir={dir}>
      <main>
        <section className={STANDARD_PAGE_HERO_SECTION_CLASS}>
          <img
            src="/images/main.webp"
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-[#030912]/50" aria-hidden />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#001F3F]/78 via-[#001F3F]/65 to-[#051020]/88"
            aria-hidden
          />
          <StandardPageHeroInset
            crumbs={[
              { to: "/", label: t("businesses.breadcrumb.home") },
              { label: t("careersPage.title") },
            ]}
            title={t("careersPage.title")}
            afterTitle={
              <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10">
                <Link
                  to={{ pathname: "/careers", hash: "#upload" }}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white hover:text-[#001F3F] md:px-6 md:py-3.5 md:text-base"
                >
                  <Upload className="h-4 w-4" aria-hidden />
                  {t("careersPage.upload.nav")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                </Link>
              </div>
            }
          />
        </section>

        <div className="w-full">
          <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-12 md:px-8 md:pb-32 md:pt-14 lg:pt-16 lg:pb-36 xl:px-10">
            <section id="upload" className="scroll-mt-40">
              <div className="mx-auto max-w-4xl text-center">
                <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 sm:mb-6 sm:text-xs">
                  {t("careersPage.upload.kicker")}
                </p>
                <h2 className="text-balance text-3xl font-bold tracking-[-0.02em] text-[#001F3F] sm:text-4xl md:text-5xl">
                  {t("careersPage.upload.title")}
                </h2>
                <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-[1.65] text-neutral-600 sm:mt-8 sm:text-lg">
                  {t("careersPage.upload.lead")}
                </p>
              </div>

              <div className="mx-auto mt-14 max-w-2xl md:mt-20">
                {formSubmitted ? (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-sm border border-neutral-200 bg-neutral-50 px-6 py-10 text-center text-lg text-neutral-700"
                  >
                    {t("careersPage.form.success")}
                  </motion.p>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-sm border border-neutral-200/90 bg-white p-6 shadow-sm md:p-8"
                  >
                    <div>
                      <label htmlFor="careers-name" className="mb-2 block text-sm font-medium text-[#001F3F]">
                        {t("careersPage.form.name")}
                      </label>
                      <input
                        id="careers-name"
                        name="name"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-md border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none ring-[#001F3F]/20 transition-shadow focus:ring-2"
                      />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="careers-email" className="mb-2 block text-sm font-medium text-[#001F3F]">
                          {t("careersPage.form.email")}
                        </label>
                        <input
                          id="careers-email"
                          name="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full rounded-md border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none ring-[#001F3F]/20 transition-shadow focus:ring-2"
                        />
                      </div>
                      <div>
                        <label htmlFor="careers-phone" className="mb-2 block text-sm font-medium text-[#001F3F]">
                          {t("careersPage.form.phone")}
                        </label>
                        <input
                          id="careers-phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full rounded-md border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none ring-[#001F3F]/20 transition-shadow focus:ring-2"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="careers-role" className="mb-2 block text-sm font-medium text-[#001F3F]">
                        {t("careersPage.form.role")}
                      </label>
                      <input
                        id="careers-role"
                        name="role"
                        placeholder={t("careersPage.form.rolePlaceholder")}
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="w-full rounded-md border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none ring-[#001F3F]/20 transition-shadow placeholder:text-neutral-400 focus:ring-2"
                      />
                    </div>
                    <div>
                      <label htmlFor="careers-cv" className="mb-2 block text-sm font-medium text-[#001F3F]">
                        {t("careersPage.form.cv")}
                      </label>
                      <input
                        ref={cvInputRef}
                        id="careers-cv"
                        name="cv"
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        required
                        onChange={(e) => {
                          setFileName(e.target.files?.[0]?.name ?? "")
                          setSubmitError(null)
                        }}
                        className="w-full text-sm text-neutral-600 file:me-4 file:rounded-md file:border-0 file:bg-[#001F3F] file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-[#000F25]"
                      />
                      <p className="mt-2 text-xs text-neutral-500">{t("careersPage.form.cvHint")}</p>
                      {fileName ? (
                        <p className="mt-1 text-sm text-neutral-700">
                          {fileName}
                        </p>
                      ) : null}
                    </div>
                    <div>
                      <label htmlFor="careers-message" className="mb-2 block text-sm font-medium text-[#001F3F]">
                        {t("careersPage.form.message")}
                      </label>
                      <textarea
                        id="careers-message"
                        name="message"
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full resize-y rounded-md border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none ring-[#001F3F]/20 transition-shadow focus:ring-2"
                      />
                    </div>
                    {submitError ? (
                      <p className="text-sm text-red-700" role="alert">
                        {submitError}
                      </p>
                    ) : null}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-md bg-[#001F3F] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#000F25] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10"
                    >
                      {submitting ? t("careersPage.form.submitting") : t("careersPage.form.submit")}
                    </button>
                  </form>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
