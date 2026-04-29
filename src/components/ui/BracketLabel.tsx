interface BracketLabelProps {
  children: string
  className?: string
}

export function BracketLabel({ children, className = '' }: BracketLabelProps) {
  return (
    <span
      className={`text-[0.7rem] tracking-[0.12em] uppercase text-ink-subtle font-medium font-sans ${className}`}
    >
      {`[ ${children} ]`}
    </span>
  )
}
