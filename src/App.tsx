import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { ServicesPage } from '@/pages/ServicesPage'
import { AuditPage } from '@/pages/AuditPage'
import { FaqPage } from '@/pages/FaqPage'
import { PortfolioPage } from '@/pages/PortfolioPage'
import { RetiredPage } from '@/pages/RetiredPage'
import { ArchiveNotice } from '@/components/layout/ArchiveNotice'

function App() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      return
    }

    const frame = window.requestAnimationFrame(() => {
      const target = document.querySelector(location.hash)
      if (target) target.scrollIntoView({ block: 'start', behavior: 'auto' })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [location.pathname, location.hash])

  return (
    <div className="dark min-h-screen bg-[var(--color-bg)] text-ink">
      <ArchiveNotice />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<PortfolioPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/audit" element={<AuditPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/checkout/*" element={<RetiredPage />} />
        <Route path="/thank-you/*" element={<RetiredPage />} />
        <Route path="/portal/*" element={<RetiredPage />} />
        <Route path="/admin/*" element={<RetiredPage />} />
        <Route path="/next-steps/*" element={<RetiredPage />} />
        <Route path="*" element={<RetiredPage unknown />} />
      </Routes>
    </div>
  )
}

export default App
