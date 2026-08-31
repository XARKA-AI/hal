import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react"
import { useLanguage } from "../components/language-context"
import { PageSeo } from "../components/seo"
import { ROUTE_SEO } from "../config/site"
import { StandardPageHeroInset } from "../components/standard-page-hero-inset"
import { Footer } from "../sections/footer"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

const CONTACT_EMAIL = "info@haloffshore.com"

const SUBJECT_OPTIONS = [
  { value: "offshore-epc", label: "Offshore EPC Projects" },
  { value: "onshore-epc", label: "Onshore EPC Projects" },
  { value: "marine", label: "Marine Services" },
  { value: "om", label: "O&M Services" },
  { value: "careers", label: "Careers" },
  { value: "other", label: "Other" },
] as const

function buildMailto(form: {
  name: string
  company: string
  email: string
  phone: string
  subject: string
  message: string
}) {
  const subjectLabel =
    SUBJECT_OPTIONS.find((option) => option.value === form.subject)?.label ?? form.subject
  const subject = `HAL enquiry: ${subjectLabel}`
  const body = [
    `Name: ${form.name.trim()}`,
    form.company.trim() ? `Company: ${form.company.trim()}` : null,
    `Email: ${form.email.trim()}`,
    form.phone.trim() ? `Phone: ${form.phone.trim()}` : null,
    `Subject: ${subjectLabel}`,
    "",
    form.message.trim(),
  ]
    .filter((line) => line !== null)
    .join("\n")

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function SubsidiaryCard({
  name,
  regs,
  addressLabel,
  address,
  contactLabel,
  person,
  phone,
  phoneHref,
  email,
}: {
  name: string
  regs: string[]
  addressLabel: string
  address: string
  contactLabel: string
  person: string
  phone: string
  phoneHref: string
  email: string
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
      <h3 className="text-xl font-bold text-white sm:text-2xl">{name}</h3>
      <ul className="mt-4 space-y-1.5 text-sm text-white/75 sm:text-base">
        {regs.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/50">{addressLabel}</p>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-white/85 sm:text-base">{address}</p>
      </div>
      <div className="mt-6 border-t border-white/10 pt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/50">{contactLabel}</p>
        <p className="mt-2 text-sm font-medium text-white sm:text-base">{person}</p>
        <a
          href={phoneHref}
          className="mt-2 inline-flex items-center gap-2 text-sm text-white/80 hover:text-[#FFCA23]"
        >
          <Phone className="h-4 w-4 shrink-0" />
          {phone}
        </a>
        <a
          href={`mailto:${email}`}
          className="mt-1 flex items-center gap-2 text-sm text-white/80 hover:text-[#FFCA23]"
        >
          <Mail className="h-4 w-4 shrink-0" />
          {email}
        </a>
      </div>
    </article>
  )
}

export function ContactPage() {
  const seo = ROUTE_SEO["/contact"]
  const { t, language } = useLanguage()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [subjectError, setSubjectError] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.subject) {
      setSubjectError(true)
      return
    }
    window.location.href = buildMailto(form)
    setSubmitted(true)
  }

  const dir = language === "ar" ? "rtl" : "ltr"

  useEffect(() => {
    if (!window.location.hash) return
    const timer = window.setTimeout(() => {
      document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "smooth" })
    }, 80)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen overflow-x-clip" dir={dir}>
      <PageSeo title={seo.title} description={seo.description} path={seo.path} />
      <div className="relative">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <img
          src="/images/hal-1.webp"
          alt=""
          className="absolute inset-0 h-full w-full min-h-full min-w-full scale-110 object-cover blur-md sm:blur-lg md:blur-xl"
          loading="eager"
          decoding="async"
        />
      </div>
      <div className="absolute inset-0 bg-[#001F3F]/85 backdrop-blur-[2px]" />

      <div className="relative z-10 px-4 pb-14 pt-0 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <StandardPageHeroInset
            crumbs={[
              { to: "/", label: t("businesses.breadcrumb.home") },
              { label: t("nav.contact") },
            ]}
            title={t("nav.contact")}
            wrapperClassName="px-0 pb-10 pt-28 sm:pb-12 sm:pt-32"
          />

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {[
                {
                  icon: MapPin,
                  label: "Registered Office",
                  value: "HAL Offshore Limited, Mumbai, India",
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: "+91-22-4236 9200",
                  href: "tel:+912242369200",
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: "info@haloffshore.com",
                  href: "mailto:info@haloffshore.com",
                },
              ].map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="flex gap-4 p-5 bg-white/5 border border-white/10 rounded-xl hover:border-[#001F3F]/40 transition-colors"
                >
                  <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-[#001F3F]/20 rounded-lg">
                    <Icon className="w-5 h-5 text-[#001F3F]" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-1">{label}</p>
                    {href ? (
                      <a href={href} className="text-white font-medium hover:text-[#001F3F] transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="text-white font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2"
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 bg-white/5 border border-white/10 rounded-2xl"
                >
                  <CheckCircle className="w-16 h-16 text-[#001F3F] mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-3">Message Sent!</h3>
                  <p className="text-white/60 mb-8 max-w-sm">
                    Thank you for reaching out. Our team will get back to you within 24–48 business hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 bg-[#001F3F] text-white font-semibold rounded-md hover:bg-[#000F25] transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
                >
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/60 text-sm mb-2 uppercase tracking-wider">Full Name *</label>
                      <input
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Smith"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm mb-2 uppercase tracking-wider">Company</label>
                      <input
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Your Company"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/60 text-sm mb-2 uppercase tracking-wider">Email *</label>
                      <input
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@company.com"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm mb-2 uppercase tracking-wider">Phone</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm mb-2 uppercase tracking-wider">Subject *</label>
                    <Select
                      value={form.subject || undefined}
                      onValueChange={(value) => {
                        setForm({ ...form, subject: value })
                        setSubjectError(false)
                      }}
                    >
                      <SelectTrigger
                        aria-required="true"
                        aria-invalid={subjectError}
                        className={`h-auto min-h-[3.25rem] w-full rounded-lg bg-white/10 px-4 py-3 text-base text-white shadow-none hover:bg-white/15 focus-visible:ring-0 data-[placeholder]:text-white/30 [&_svg]:text-white/60 ${
                          subjectError
                            ? "border-red-400 focus-visible:border-red-300"
                            : "border-white/20 focus-visible:border-white"
                        }`}
                      >
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        align="start"
                        sideOffset={6}
                        className="z-[80] border-white/15 bg-[#001F3F] text-white shadow-xl"
                      >
                        {SUBJECT_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="cursor-pointer py-2.5 text-base text-white focus:bg-white/15 focus:text-white"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {subjectError && (
                      <p className="mt-2 text-sm text-red-300">Please select a subject.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm mb-2 uppercase tracking-wider">Message *</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project or inquiry..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full inline-flex items-center justify-center gap-3 py-4 bg-[#001F3F] text-white font-bold rounded-lg hover:bg-[#000F25] transition-colors text-base shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>

          <section id="subsidiaries" className="scroll-mt-28 mt-16 pb-6 sm:mt-20 md:mt-24">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FFCA23]">
              {t("contactPage.subsidiaries.kicker")}
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              {t("contactPage.subsidiaries.title")}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/70 sm:text-lg">
              {t("contactPage.subsidiaries.lead")}
            </p>
            <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
              <SubsidiaryCard
                name={t("contactPage.ksa.name")}
                regs={[
                  t("contactPage.ksa.cr"),
                  t("contactPage.ksa.nationalization"),
                  t("contactPage.ksa.anid"),
                  t("contactPage.ksa.vendor"),
                ]}
                addressLabel={t("contactPage.ksa.addressLabel")}
                address={t("contactPage.ksa.address")}
                contactLabel={t("contactPage.ksa.contactLabel")}
                person={t("contactPage.ksa.person")}
                phone={t("contactPage.ksa.phone")}
                phoneHref="tel:+966556524049"
                email={t("contactPage.ksa.email")}
              />
              <SubsidiaryCard
                name={t("contactPage.uae.name")}
                regs={[
                  t("contactPage.uae.licence"),
                  t("contactPage.uae.adcci"),
                  t("contactPage.uae.icp"),
                ]}
                addressLabel={t("contactPage.uae.addressLabel")}
                address={t("contactPage.uae.address")}
                contactLabel={t("contactPage.uae.contactLabel")}
                person={t("contactPage.uae.person")}
                phone={t("contactPage.uae.phone")}
                phoneHref="tel:+971566619162"
                email={t("contactPage.uae.email")}
              />
            </div>
          </section>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  )
}
