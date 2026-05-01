import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'FAQ', href: '/faq' },
]

export function Nav() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeHash, setActiveHash] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash)
    syncHash()
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">

        {/* Wordmark */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="text-sm font-medium tracking-tight text-ink transition-colors duration-200 hover:text-amber"
        >
          Anvis
        </Link>

        {/* Desktop nav: bracket style */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7">
          {links.map((link) => {
            const hashIndex = link.href.indexOf('#')
            const hash = hashIndex >= 0 ? link.href.slice(hashIndex) : ''
            const path = hashIndex >= 0 ? link.href.slice(0, hashIndex) : link.href
            const isWorkLink = path === '/work'
            const active = hash
              ? location.pathname === (path || '/') && activeHash === hash
              : isWorkLink
                ? location.pathname === '/work' || location.pathname === '/portfolio'
                : location.pathname === path && (!hash || !activeHash)

            return (
              <Link
                key={link.href}
                to={link.href}
                className={`group relative text-[0.68rem] font-medium tracking-[0.12em] uppercase transition-colors duration-200 hover:text-ink ${
                  active ? 'text-amber' : 'text-ink-muted'
                }`}
              >
                {`[ ${link.label} ]`}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-px w-0 bg-amber transition-all duration-200 group-hover:w-full"
                />
              </Link>
            )
          })}
        </nav>

        {/* Contact CTA: outlined */}
        <Link
          to="/audit"
          className="hidden md:inline-flex items-center gap-2 border border-[var(--color-border-strong)] px-4 py-2 text-[0.68rem] font-medium tracking-[0.1em] uppercase text-ink transition-all duration-200 hover:border-amber hover:text-amber group"
        >
          <span>[ Get Free Audit ]</span>
          <span className="text-amber transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 p-2 text-ink-muted transition-colors duration-200 hover:text-amber md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-8 flex flex-col gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              className="text-[0.7rem] font-medium tracking-[0.14em] uppercase text-ink-muted transition-colors duration-150 hover:text-ink"
            >
              {`[ ${link.label} ]`}
            </Link>
          ))}
          <Link
            to="/audit"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center gap-2 border border-[var(--color-border-strong)] px-4 py-3 text-[0.7rem] font-medium tracking-[0.1em] uppercase text-ink transition-all duration-150 hover:border-amber hover:text-amber w-fit"
          >
            [ Get Free Audit ] <span className="text-amber">→</span>
          </Link>
        </div>
      )}
    </header>
  )
}
