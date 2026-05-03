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
      {/* Mobile header */}
      <div className="flex h-14 items-center justify-between px-5 md:hidden">
        <Link
          to="/"
          onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: 'auto' }) }}
          className="text-sm font-medium tracking-tight text-ink transition-colors duration-200 hover:text-amber"
        >
          Anvis
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center text-ink-muted transition-colors duration-200 hover:text-amber"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Desktop header */}
      <div className="mx-auto hidden h-16 max-w-screen-2xl grid-cols-[minmax(140px,1fr)_auto_minmax(140px,1fr)] items-center gap-4 px-6 md:grid lg:px-12">
        <Link
          to="/"
          onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: 'auto' }) }}
          className="justify-self-start text-sm font-medium tracking-tight text-ink transition-colors duration-200 hover:text-amber"
        >
          Anvis
        </Link>

        <nav className="flex items-center justify-center gap-5 lg:gap-7">
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
                onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
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

        <Link
          to="/portal"
          onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
          className="group inline-flex items-center gap-2 justify-self-end border border-[var(--color-border-strong)] px-4 py-2 text-[0.68rem] font-medium tracking-[0.1em] uppercase text-ink transition-all duration-200 hover:border-amber hover:text-amber"
        >
          <span>[ Client Login ]</span>
          <span className="text-amber transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </Link>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-6 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: 'auto' }) }}
              className="flex items-center py-3 text-sm font-medium tracking-[0.06em] text-ink-muted transition-colors duration-150 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 border-t border-[var(--color-border)] pt-4">
            <Link
              to="/portal"
              onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: 'auto' }) }}
              className="flex w-full items-center justify-between gap-2 border border-[var(--color-border-strong)] px-4 py-3.5 text-[0.7rem] font-medium tracking-[0.1em] uppercase text-ink transition-all duration-150 hover:border-amber hover:text-amber"
            >
              <span>Client Login</span>
              <span className="text-amber">→</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
