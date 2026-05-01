interface WebsiteFrameProps {
  href?: string | null
  image?: string
  alt: string
  label?: string
}

export function WebsiteFrame({ href, image, alt, label }: WebsiteFrameProps) {
  const frame = (
    <div className="relative overflow-hidden rounded-sm border border-[var(--color-border)] bg-surface shadow-[0_18px_60px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(245,244,238,0.04)] transition-colors duration-200 group-hover/frame:border-[var(--color-border-strong)] group-hover/frame:shadow-[0_20px_64px_rgba(0,0,0,0.26),inset_0_1px_0_rgba(245,244,238,0.05)]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[2px] origin-left scale-x-0 bg-amber/70 transition-transform duration-[500ms] ease group-hover/frame:scale-x-100"
      />
      <div className="flex h-7 items-center gap-1.5 border-b border-[var(--color-border)] px-3">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-border-strong)]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-border-strong)]" />
        <span className="h-1.5 w-1.5 rounded-full bg-amber/70" />
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-bg)]">
        {image ? (
          <img
            src={image}
            alt={alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-90 transition-[filter] duration-300 group-hover/frame:brightness-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(90deg,rgba(208,175,104,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(208,175,104,0.08)_1px,transparent_1px)] bg-[size:44px_44px]">
            <span className="border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-5 py-3 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-amber">
              {label}
            </span>
          </div>
        )}
      </div>
    </div>
  )

  if (!href) {
    return <div className="group/frame block" aria-label={alt}>{frame}</div>
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/frame block"
      title={`Open ${alt}`}
      aria-label={`${alt} - open live site`}
    >
      {frame}
    </a>
  )
}
