import { useEffect, useMemo, useState } from "react"
import { Building2, Clock3, Mail, MapPin, Pencil, Phone, Send, ShieldCheck, User } from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "react-router"
import { useLanguage } from "../components/language-context"
import { PageSeo } from "../components/seo"
import { ROUTE_SEO } from "../config/site"
import { Footer } from "../sections/footer"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import "./ContactPage.css"
import landGeoJsonRaw from "../data/ne_110m_land.geojson?raw"

const MAP_W = 1000
const MAP_H = 480
const DOT_STEP = 7
type GeoRing = [number, number][]
type LandData = { features: Array<{ geometry: { type: "Polygon" | "MultiPolygon"; coordinates: GeoRing[] | GeoRing[][] } }> }

function project(lng: number, lat: number): [number, number] {
  return [((lng + 180) / 360) * MAP_W, ((90 - lat) / 180) * MAP_H]
}

function pointInRing(x: number, y: number, ring: [number, number][]) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersects) inside = !inside
  }
  return inside
}

function createMapDots() {
  const data = JSON.parse(landGeoJsonRaw) as LandData
  const dots: Array<{ x: number; y: number; opacity: number }> = []
  const seen = new Set<string>()
  for (const feature of data.features) {
    const polygons = feature.geometry.type === "Polygon" ? [feature.geometry.coordinates as GeoRing[]] : feature.geometry.coordinates as GeoRing[][]
    for (const polygon of polygons) {
      const ring = polygon[0]
      if (!ring?.length) continue
      const projected = ring.map(([lng, lat]) => project(lng, lat))
      const xs = projected.map(([x]) => x)
      const ys = projected.map(([, y]) => y)
      const minX = Math.max(0, Math.floor(Math.min(...xs) / DOT_STEP) * DOT_STEP)
      const maxX = Math.min(MAP_W, Math.ceil(Math.max(...xs) / DOT_STEP) * DOT_STEP)
      const minY = Math.max(0, Math.floor(Math.min(...ys) / DOT_STEP) * DOT_STEP)
      const maxY = Math.min(MAP_H, Math.ceil(Math.max(...ys) / DOT_STEP) * DOT_STEP)
      for (let y = minY; y <= maxY; y += DOT_STEP) {
        for (let x = minX; x <= maxX; x += DOT_STEP) {
          if (!pointInRing(x, y, projected)) continue
          const key = `${x}-${y}`
          if (seen.has(key)) continue
          seen.add(key)
          dots.push({ x, y, opacity: 0.28 + ((x * 13 + y * 7) % 32) / 100 })
        }
      }
    }
  }
  return dots
}

function DottedWorldMap() {
  const dots = useMemo(createMapDots, [])
  return (
    <svg className="contact-dotted-map" viewBox={`0 0 ${MAP_W} ${MAP_H}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {dots.map((dot) => <circle key={`${dot.x}-${dot.y}`} cx={dot.x} cy={dot.y} r="1.45" fill="#8dbbfa" opacity={dot.opacity} />)}
    </svg>
  )
}

const CONTACT_EMAIL = "info@haloffshore.com"
const SUBJECT_OPTIONS = [
  { value: "offshore-epc", label: "Offshore EPC Projects" },
  { value: "onshore-epc", label: "Onshore EPC Projects" },
  { value: "marine", label: "Marine Services" },
  { value: "om", label: "O&M Services" },
  { value: "careers", label: "Careers" },
  { value: "other", label: "Other" },
] as const

function buildMailto(form: { name: string; company: string; email: string; phone: string; subject: string; message: string }) {
  const subjectLabel = SUBJECT_OPTIONS.find((option) => option.value === form.subject)?.label ?? form.subject
  const body = [
    `Name: ${form.name.trim()}`,
    form.company.trim() ? `Company: ${form.company.trim()}` : null,
    `Email: ${form.email.trim()}`,
    form.phone.trim() ? `Phone: ${form.phone.trim()}` : null,
    `Subject: ${subjectLabel}`,
    "",
    form.message.trim(),
  ].filter((line) => line !== null).join("\n")
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`HAL enquiry: ${subjectLabel}`)}&body=${encodeURIComponent(body)}`
}

function ContactItem({ icon: Icon, label, children, accent = "blue" }: { icon: typeof MapPin; label: string; children: React.ReactNode; accent?: "blue" | "orange" }) {
  return (
    <div className="contact-detail">
      <span className={`contact-detail-icon contact-icon-${accent}`}><Icon aria-hidden="true" /></span>
      <div><p className="contact-detail-label">{label}</p><div className="contact-detail-value">{children}</div></div>
    </div>
  )
}

function ContactCard({ icon: Icon, label, value, description, accent = "blue", href }: { icon: typeof MapPin; label: string; value: string; description: string; accent?: "blue" | "orange"; href?: string }) {
  return (
    <article className="contact-card">
      <span className={`contact-card-icon contact-icon-${accent}`}><Icon aria-hidden="true" /></span>
      <div className="contact-card-copy">
        <p className={`contact-card-label contact-label-${accent}`}>{label}</p>
        {href ? <a className="contact-card-value" href={href}>{value}</a> : <p className="contact-card-value">{value}</p>}
        <p className="contact-card-description">{description}</p>
      </div>
    </article>
  )
}

export function ContactPage() {
  const seo = ROUTE_SEO["/contact"]
  const { language } = useLanguage()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", subject: "", message: "" })
  const [subjectError, setSubjectError] = useState(false)
  const dir = language === "ar" ? "rtl" : "ltr"

  useEffect(() => {
    if (!window.location.hash) return
    const timer = window.setTimeout(() => document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "smooth" }), 80)
    return () => window.clearTimeout(timer)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: name === "phone" ? value.replace(/[^\d+\s()-]/g, "") : value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.subject) { setSubjectError(true); return }
    window.location.href = buildMailto(form)
    setSubmitted(true)
  }

  return (
    <div className="contact-page" dir={dir}>
      <PageSeo title={seo.title} description={seo.description} path={seo.path} />
      <div className="contact-hero-map" aria-hidden="true">
        <DottedWorldMap />
        <span className="contact-map-marker contact-map-ksa"><i /><b>KSA</b></span>
        <span className="contact-map-marker contact-map-uae"><i /><b>UAE</b></span>
        <span className="contact-map-marker contact-map-india"><i /><b>INDIA</b></span>
      </div>
      <div className="contact-page-wave" aria-hidden="true" />
      <main>
        <section className="contact-shell contact-hero">
          <nav className="contact-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><span>Contact Us</span></nav>
          <div className="contact-hero-copy">
            <p className="contact-eyebrow">HAL GROUP <span /></p>
            <h1>Contact Us</h1>
            <p>We’d love to hear from you. Reach out to us<br className="contact-desktop-only" /> for any inquiries or collaborations.</p>
          </div>
        </section>

        <section className="contact-shell contact-cards" aria-label="Contact information">
          <ContactCard icon={MapPin} label="REGISTERED OFFICE" value="HAL Offshore Limited, Mumbai, India" description="Mumbai remains the registered headquarters of HAL Offshore Limited." />
          <ContactCard icon={Phone} label="PHONE" value="+91-22-4236 9200" description="Mon – Fri, 9:00 AM – 6:00 PM IST" accent="orange" href="tel:+912242369200" />
          <ContactCard icon={Mail} label="EMAIL" value={CONTACT_EMAIL} description="We aim to reply within 24 hours" href={`mailto:${CONTACT_EMAIL}`} />
        </section>

        <section className="contact-shell" id="form">
          <div className="contact-panel">
            <aside className="contact-panel-info">
              <h2>Get in touch</h2>
              <p className="contact-panel-lead">Fill out the form and our team<br className="contact-desktop-only" /> will get back to you shortly.</p>
              <div className="contact-details">
                <ContactItem icon={MapPin} label="REGISTERED OFFICE">HAL Offshore Limited,<br />Mumbai, India</ContactItem>
                <ContactItem icon={Phone} label="PHONE" accent="orange"><a href="tel:+912242369200">+91-22-4236 9200</a></ContactItem>
                <ContactItem icon={Mail} label="EMAIL"><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></ContactItem>
                <ContactItem icon={Clock3} label="BUSINESS HOURS">Mon – Fri, 9:00 AM – 6:00 PM IST</ContactItem>
              </div>
            </aside>

            <div className="contact-form-wrap">
              {submitted ? (
                <div className="contact-success"><ShieldCheck aria-hidden="true" /><h3>Message Sent!</h3><p>Thank you for reaching out. Our team will get back to you shortly.</p><button type="button" onClick={() => setSubmitted(false)}>Send Another Message</button></div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="contact-form-grid">
                    <div className="contact-field"><label htmlFor="contact-name">FULL NAME *</label><div className="contact-input-with-icon"><User aria-hidden="true" /><input id="contact-name" name="name" required value={form.name} onChange={handleChange} placeholder="John Smith" /></div></div>
                    <div className="contact-field"><label htmlFor="contact-company">COMPANY</label><div className="contact-input-with-icon"><Building2 aria-hidden="true" /><input id="contact-company" name="company" value={form.company} onChange={handleChange} placeholder="Your Company" /></div></div>
                    <div className="contact-field"><label htmlFor="contact-email">EMAIL *</label><div className="contact-input-with-icon"><Mail aria-hidden="true" /><input id="contact-email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@company.com" /></div></div>
                    <div className="contact-field"><label htmlFor="contact-phone">PHONE</label><div className="contact-input-with-icon"><Phone aria-hidden="true" /><input id="contact-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" /></div></div>
                  </div>
                  <div className="contact-field"><label>SUBJECT *</label><Select value={form.subject || undefined} onValueChange={(value) => { setForm({ ...form, subject: value }); setSubjectError(false) }}><SelectTrigger aria-required="true" aria-invalid={subjectError} className={`contact-select ${subjectError ? "contact-select-error" : ""}`}><SelectValue placeholder="Select a subject" /></SelectTrigger><SelectContent position="popper" align="start" sideOffset={6} className="contact-select-content">{SUBJECT_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select>{subjectError && <p className="contact-error">Please select a subject.</p>}</div>
                  <div className="contact-field"><label htmlFor="contact-message">MESSAGE *</label><div className="contact-textarea-with-icon"><Pencil aria-hidden="true" /><textarea id="contact-message" name="message" required rows={5} value={form.message} onChange={handleChange} placeholder="Tell us about your project or inquiry..." /></div></div>
                  <motion.button className="contact-submit" type="submit" whileHover={{ translateY: -1 }} whileTap={{ scale: .99 }}><Send aria-hidden="true" /> Send Message</motion.button>
                  <p className="contact-privacy"><ShieldCheck aria-hidden="true" /> Your information is safe with us. We respect your privacy.</p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}