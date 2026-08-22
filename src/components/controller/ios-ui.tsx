import type { ReactNode } from "react"

const iosFont =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", system-ui, sans-serif'

export function IosScreen({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`min-h-screen text-white ${className}`}
      style={{ fontFamily: iosFont }}
    >
      {children}
    </div>
  )
}

export function IosBackdrop({
  imageSrc = "/images/hal-1.webp",
  children,
}: {
  imageSrc?: string
  children: ReactNode
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 scale-105"
        style={{
          backgroundImage: `url('${imageSrc}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(2px)",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#051020]/92 via-[#001F3F]/88 to-[#051020]/95" />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  )
}

export function IosContainer({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`w-full max-w-md rounded-[1.35rem] border border-white/15 bg-white/[0.08] p-1 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl ${className}`}
    >
      <div className="rounded-[1.2rem] bg-black/25 px-4 py-5 sm:px-6 sm:py-7">{children}</div>
    </div>
  )
}

export function IosLargeTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-[1.65rem] font-semibold tracking-tight text-white text-center leading-tight">
      {children}
    </h1>
  )
}

export function IosCaption({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 text-center text-[15px] text-white/65 leading-snug">{children}</p>
  )
}

export function IosGroup({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 rounded-[1rem] overflow-hidden border border-white/12 bg-white/[0.06] divide-y divide-white/10">
      {children}
    </div>
  )
}

export function IosRow({
  label,
  description,
  control,
}: {
  label: string
  description?: string
  control: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5 min-h-[3.25rem]">
      <div className="min-w-0">
        <p className="text-[15px] font-medium text-white/95">{label}</p>
        {description ? (
          <p className="text-[13px] text-white/55 mt-0.5 leading-snug">{description}</p>
        ) : null}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  )
}

export function IosPrimaryButton({
  children,
  type = "button",
  disabled,
  onClick,
}: {
  children: ReactNode
  type?: "button" | "submit"
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="w-full rounded-[0.95rem] bg-[#001F3F] px-4 py-3.5 text-[17px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
    >
      {children}
    </button>
  )
}

export function IosSecondaryButton({
  children,
  onClick,
}: {
  children: ReactNode
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[0.95rem] border border-white/20 bg-white/5 px-4 py-3 text-[16px] font-medium text-white/90 backdrop-blur-sm transition active:scale-[0.98]"
    >
      {children}
    </button>
  )
}

export function IosTextField({
  id,
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  autoComplete?: string
}) {
  return (
    <label htmlFor={id} className="block mt-5 text-left">
      <span className="ml-1 text-[13px] font-medium uppercase tracking-wide text-white/50">
        {label}
      </span>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-[0.9rem] border border-white/15 bg-black/35 px-4 py-3.5 text-[17px] text-white placeholder:text-white/35 outline-none ring-0 focus:border-white/70 focus:ring-2 focus:ring-white/25"
      />
    </label>
  )
}

export function IosToggle({
  pressed,
  onPressedChange,
  ariaLabel,
}: {
  pressed: boolean
  onPressedChange: (v: boolean) => void
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={pressed}
      aria-label={ariaLabel}
      onClick={() => onPressedChange(!pressed)}
      className={`relative h-[31px] w-[51px] rounded-full transition-colors ${
        pressed ? "bg-[#34C759]" : "bg-white/20"
      }`}
    >
      <span
        className={`absolute top-[2px] left-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-md transition-transform ${
          pressed ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  )
}
