// Enable only after the separately approved apex cutover.
const NEW_SITE_AVAILABLE = false

export function ArchiveNotice() {
  return (
    <aside aria-label="Archive notice" className="border-b border-[var(--color-border)] px-6 pb-4 pt-20 text-sm leading-relaxed text-ink-muted lg:px-12">
      <div className="mx-auto max-w-screen-xl">
        <p>You&apos;re viewing Anvisco&apos;s previous website. We&apos;ve moved to a new chapter. This site remains available as an archive of our earlier work, but its services, pricing, and checkout are no longer active.</p>
        {NEW_SITE_AVAILABLE && <a href="https://anvisco.com" className="mt-2 inline-block text-amber hover:underline">Visit the new Anvisco →</a>}
      </div>
    </aside>
  )
}
