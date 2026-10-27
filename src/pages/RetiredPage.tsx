import { Link } from 'react-router-dom'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { EMAIL } from '@/data/contact'

export function RetiredPage({ unknown = false }: { unknown?: boolean }) {
  return (
    <>
      <Nav />
      <main className="mx-auto min-h-[50vh] max-w-screen-xl px-6 py-16 lg:px-12">
        <h1 className="mb-6 text-3xl font-medium text-ink">{unknown ? 'Page not found.' : 'This page is no longer available.'}</h1>
        <p className="max-w-xl text-ink-muted">The former checkout, client portal and admin services have been retired. For help with a previous purchase or account, email <a className="text-amber underline" href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
        <Link className="mt-8 inline-block text-amber hover:underline" to="/work">View the archived work →</Link>
      </main>
      <Footer />
    </>
  )
}
