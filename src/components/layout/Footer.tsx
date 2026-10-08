import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-12 border-t border-[#CED8CB] bg-[#EEF2EC]">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-16 md:grid-cols-[1fr_1fr_auto] md:px-10 lg:px-14">
        <div>
          <Link to="/" className="text-2xl font-semibold tracking-[-0.075em]">anvisco<span className="text-[#B08336]">.</span></Link>
          <p className="mt-4 max-w-xs text-sm leading-7 text-[#657468]">Small, practical software for an evolving web.</p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div className="flex flex-col items-start gap-3">
            <span className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#829082]">Explore</span>
            <Link to="/tools" className="hover:underline">Tools</Link>
            <Link to="/notes" className="hover:underline">Notes</Link>
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/services" className="hover:underline">Selective work</Link>
          </div>
          <div className="flex flex-col items-start gap-3">
            <span className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#829082]">Information</span>
            <Link to="/contact" className="hover:underline">Contact</Link>
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <Link to="/terms" className="hover:underline">Terms</Link>
            <a href="https://archive.anvisco.com" className="hover:underline">Previous website <ArrowUpRight size={12} className="inline"/></a>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-10 md:items-end">
          <a href="mailto:brian@anvisco.com" className="text-sm font-medium hover:underline">brian@anvisco.com</a>
          <span className="text-xs text-[#899486]">© {new Date().getFullYear()} Anvisco</span>
        </div>
      </div>
    </footer>
  )
}
