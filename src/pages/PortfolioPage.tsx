import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { BracketLabel } from '@/components/ui/BracketLabel'
import { ProjectCard } from '@/components/sections/ProjectCard'
import { projects, otherProjects } from '@/data/projects'
import { Link } from 'react-router-dom'

export function PortfolioPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="bg-[var(--color-bg)] py-24 md:py-32">
          <div className="mx-auto max-w-screen-xl px-6 lg:px-12">
            <BracketLabel>Work</BracketLabel>
            <h1 className="mb-8 mt-10 max-w-4xl text-[2.75rem] font-medium leading-[1.02] tracking-[-0.03em] text-ink sm:text-[3.5rem] md:leading-[0.98] md:tracking-[-0.04em] md:text-[5rem]">
              Selected work.
            </h1>
          </div>
        </section>

        <section className="pb-20 md:pb-28 bg-[var(--color-bg)]">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        <section className="py-20 md:py-28 bg-[var(--color-surface)]">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
            <div className="mb-12 flex items-center gap-4 border-t border-[var(--color-border)] pt-7">
              <BracketLabel>Selected Supporting Work</BracketLabel>
            </div>
            <div className="grid gap-px bg-[var(--color-border)] md:grid-cols-3">
              {otherProjects.map((project) => (
                <article key={project.id} className="bg-[var(--color-bg)] p-6">
                  <p className="mb-3 text-[0.7rem] tracking-[0.1em] uppercase text-amber">{project.tag}</p>
                  <h2 className="mb-4 text-lg font-medium tracking-[-0.01em] text-ink">{project.client}</h2>
                  <p className="text-sm leading-relaxed text-ink-muted">{project.shortDescription}</p>
                </article>
              ))}
            </div>
            <p className="mt-8 text-sm text-ink-muted">
              Still deciding?{' '}
              <Link to="/faq" className="text-amber hover:underline">
                Read the FAQ →
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
