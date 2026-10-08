import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { HomePage } from '@/pages/HomePage'
import { ToolsPage, FeedDoctorPage } from '@/pages/ToolsPage'
import { AboutPage, NotesPage, ContactPage, SelectiveWorkPage, PrivacyPage, TermsPage, NotFoundPage } from '@/pages/InfoPages'

const descriptions: Record<string, [string, string]> = {
  '/': ['Anvisco — Small tools for the AI-native web', 'Focused, self-service software for emerging AI platforms and everyday technical friction.'],
  '/tools': ['Tools | Anvisco', 'Early-stage software experiments from Anvisco.'],
  '/tools/feed-doctor': ['Feed Doctor — Research Concept | Anvisco', 'Exploring simpler ways to check product-feed readiness for AI commerce.'],
  '/about': ['About | Anvisco', 'Why Anvisco is moving from bespoke digital work toward useful, self-service software.'],
  '/notes': ['Notes | Anvisco', 'Notes on building small software products for a changing web.'],
  '/contact': ['Contact | Anvisco', 'Contact Anvisco about product feedback, partnerships and selective work.'],
  '/services': ['Selective Work | Anvisco', 'Focused product, integration and software collaborations.'],
  '/privacy': ['Privacy | Anvisco', 'Information about Anvisco website data handling.'],
  '/terms': ['Terms | Anvisco', 'General information about the Anvisco website and research concepts.'],
}

function RouteMeta() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const [title, description] = descriptions[pathname] || ['Page not found | Anvisco', 'The requested page was not found.']
    document.title = title
    let meta = document.head.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = description
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = 'https://anvisco.com' + (descriptions[pathname] ? pathname : '/')
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.appendChild(robots)
    }
    robots.content = descriptions[pathname] ? 'index, follow' : 'noindex, follow'
    if (!hash) window.scrollTo(0, 0)
    else window.requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView())
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#20352C]">
      <RouteMeta />
      <Nav />
      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/tools/feed-doctor" element={<FeedDoctorPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services" element={<SelectiveWorkPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
