import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { ServicesPage } from '@/pages/ServicesPage'
import { AuditPage } from '@/pages/AuditPage'
import { FaqPage } from '@/pages/FaqPage'
import { PortfolioPage } from '@/pages/PortfolioPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { CheckoutSuccessPage } from '@/pages/CheckoutSuccessPage'
import { ThankYouPage } from '@/pages/ThankYouPage'
import { PortalPage } from '@/pages/PortalPage'
import { AdminPage } from '@/pages/AdminPage'
import { AdminClientDetailPage } from '@/pages/AdminClientDetailPage'
import { NextStepsPage } from '@/pages/NextStepsPage'

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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<PortfolioPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/audit" element={<AuditPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/portal" element={<PortalPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/clients/:id" element={<AdminClientDetailPage />} />
        <Route path="/next-steps/audit" element={<NextStepsPage stage="audit" />} />
        <Route path="/next-steps/scope" element={<NextStepsPage stage="scope" />} />
        <Route path="/next-steps/build" element={<NextStepsPage stage="build" />} />
        <Route path="/next-steps/launch" element={<NextStepsPage stage="launch" />} />
      </Routes>
    </div>
  )
}

export default App
