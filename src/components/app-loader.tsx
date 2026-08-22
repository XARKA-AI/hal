export function AppLoader() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-6"
      role="status"
      aria-label="Loading HAL Offshore"
    >
      <div className="grid justify-items-center gap-6">
        <img
          src="/images/hal-offshore-logo.webp"
          alt="HAL Offshore Ltd"
          width={256}
          height={69}
          decoding="async"
          className="h-auto w-[min(72vw,20rem)] drop-shadow-[0_12px_24px_rgba(0,31,63,0.12)]"
        />
        <div className="brand-loader-track" aria-hidden="true" />
      </div>
    </div>
  )
}
