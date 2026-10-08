import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const links = [
  { to: '/tools', text: 'Tools' },
  { to: '/notes', text: 'Notes' },
  { to: '/about', text: 'About' },
]

export function Nav() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:p-3">Skip to content</a>
      <header className="sticky top-0 z-40 border-b border-[#D6DFD5] bg-[#F7F8F5]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-6 md:px-10 lg:px-14">
          <Link to="/" className="text-[1.65rem] font-semibold tracking-[-0.078em]" aria-label="Anvisco home">anvisco<span className="text-[#B08336]">.</span></Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-10 md:flex">
            {links.map((item) => (
              <NavLink key={item.to} to={item.to} className={({isActive}) => 'text-sm font-medium transition-colors hover:text-[#B08336] ' + (isActive ? 'text-[#A57830]' : 'text-[#506154]')}>
                {item.text}
              </NavLink>
            ))}
          </nav>
          <Link to="/contact" className="hidden items-center gap-2 border border-[#C2D0C0] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.11em] hover:border-[#20352C] md:inline-flex">Get in touch <ArrowUpRight size={14} /></Link>
          <button className="flex h-10 w-10 items-center justify-center md:hidden" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
        {open && <nav id="mobile-nav" aria-label="Mobile navigation" className="border-t border-[#D6DFD5] bg-[#F7F8F5] px-6 pb-6 md:hidden">
          {links.map((item) => <Link key={item.to} to={item.to} className="block border-b border-[#D6DFD5] py-4 text-lg">{item.text}</Link>)}
          <Link to="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">Get in touch <ArrowUpRight size={16}/></Link>
        </nav>}
      </header>
    </>
  )
}
