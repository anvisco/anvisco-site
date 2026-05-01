import { Link } from 'react-router-dom'
import { EMAIL } from '@/data/contact'

const links = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/portfolio' },
  { label: 'Services', href: '/services' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Get Free Audit', href: '/audit' },
]

export function Footer() {
  return (
    <footer className="py-12 px-6 lg:px-12 border-t border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

        {/* Wordmark + email */}
        <div>
          <p className="text-sm font-medium tracking-tight mb-1 text-ink">Anvis</p>
          <a
            href={`mailto:${EMAIL}`}
            className="font-sans text-sm text-ink-muted transition-colors duration-150 hover:text-amber"
          >
            {EMAIL}
          </a>
        </div>

        {/* Navigation links: bracket style */}
        <nav className="flex flex-wrap gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-ink-muted transition-colors duration-150 hover:text-amber"
            >
              <span className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.12em]">
                [ {link.label} ]
              </span>
            </Link>
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
