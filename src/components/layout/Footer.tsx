import { Link } from 'react-router-dom'
import { EMAIL } from '@/data/contact'

export function Footer() {
  return (
    <footer className="py-12 px-6 lg:px-12 border-t border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

        {/* Wordmark + email */}
        <div className="space-y-3">
          <p className="text-sm font-medium tracking-tight mb-1 text-ink">Anvis</p>
          <a
            href={`mailto:${EMAIL}`}
            className="font-sans text-sm text-ink-muted transition-colors duration-150 hover:text-amber"
          >
            {EMAIL}
          </a>
          <div>
            <Link
              to="/portal"
              onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
              className="text-[0.68rem] font-medium tracking-[0.1em] uppercase text-ink-subtle transition-colors duration-150 hover:text-amber"
            >
              Client Login
            </Link>
          </div>
        </div>

        <p className="text-[0.65rem] tracking-[0.06em] text-ink-subtle uppercase">
          © {new Date().getFullYear()} Brian Nguyen
        </p>

      </div>
    </footer>
  )
}
