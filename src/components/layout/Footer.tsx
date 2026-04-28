const EMAIL = 'brian@anvisco.com'

const links = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'About', href: '#about' },
]

export function Footer() {
  return (
    <footer
      className="py-12 px-6 lg:px-12 border-t border-border bg-background"
    >
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

        <div>
          <p className="text-sm font-semibold tracking-tight mb-1 text-white">Brian Nguyen</p>
          <a
            href={`mailto:${EMAIL}`}
            className="text-xs text-muted-foreground transition-colors duration-150 hover:text-white"
          >
            {EMAIL}
          </a>
        </div>

        <nav className="flex flex-wrap gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs text-muted-foreground transition-colors duration-150 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Brian Nguyen
        </p>

      </div>
    </footer>
  )
}
