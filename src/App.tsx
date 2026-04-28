import { Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { ThankYouPage } from '@/pages/ThankYouPage'
import { PortalPage } from '@/pages/PortalPage'

function App() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/portal" element={<PortalPage />} />
      </Routes>
    </div>
  )
}

export default App
