interface WebsiteFrameProps {
  href: string
  image: string
  alt: string
}

export function WebsiteFrame({ href, image, alt }: WebsiteFrameProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/frame block"
      title={`Open ${alt}`}
      aria-label={`${alt} - open live site`}
    >
      <div className="overflow-hidden rounded-sm border border-[var(--color-border)] bg-surface shadow-[0_18px_60px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(245,244,238,0.04)] transition-colors duration-200 group-hover/frame:border-[var(--color-border-strong)] group-hover/frame:shadow-[0_20px_64px_rgba(0,0,0,0.26),inset_0_1px_0_rgba(245,244,238,0.05)]">
        <div className="relative flex h-7 items-center gap-1.5 border-b border-[var(--color-border)] px-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-border-strong)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-border-strong)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber/70" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-amber/70 transition-transform duration-300 ease-out group-hover/frame:scale-x-100"
          />
        </div>
        <div className="aspect-[16/10] overflow-hidden bg-[var(--color-bg)]">
          <img
            src={image}
            alt={alt}
            loading="lazy"
            className="h-full w-full object-cover object-[50%_30%] opacity-90 transition-[filter] duration-300 group-hover/frame:brightness-110 lg:object-[50%_26%]"
          />
        </div>
      </div>
    </a>
  )
}
