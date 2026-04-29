import { BracketLabel } from '@/components/ui/BracketLabel'

const EMAIL = 'brian@anvisco.com'

const links = [
  { label: 'work', href: '#work' },
  { label: 'services', href: '#services' },
  { label: 'process', href: '#process' },
  { label: 'about', href: '#about' },
]

export function Footer() {
  return (
    <footer className="py-12 px-6 lg:px-12 border-t border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

        {/* Wordmark + email */}
        <div>
          <p className="text-sm font-medium tracking-tight mb-1 text-ink">anvisco</p>
          <a
            href={`mailto:${EMAIL}`}
            className="text-[0.7rem] text-ink-subtle transition-colors duration-150 hover:text-amber"
            style={{
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontStyle: 'italic',
            }}
          >
            {EMAIL}
          </a>
        </div>

        {/* Navigation links — bracket style */}
        <nav className="flex flex-wrap gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors duration-150 hover:text-amber"
            >
              <BracketLabel>{link.label}</BracketLabel>
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-[0.65rem] tracking-[0.06em] text-ink-subtle uppercase">
          © {new Date().getFullYear()} Brian Nguyen
        </p>

      </div>
    </footer>
  )
}
