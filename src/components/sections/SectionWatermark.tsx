interface SectionWatermarkProps {
  children: string
}

export function SectionWatermark({ children }: SectionWatermarkProps) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-4 top-8 z-0 hidden select-none font-bold leading-none text-white opacity-[0.06] lg:block lg:right-8 tabular-nums"
      style={{
        fontSize: 'clamp(2.25rem, 4vw, 4rem)',
        letterSpacing: '-0.04em',
        fontWeight: 800,
        lineHeight: 1,
      }}
    >
      {children}
    </span>
  )
}
