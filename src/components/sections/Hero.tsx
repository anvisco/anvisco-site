import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { BracketLabel } from '@/components/ui/BracketLabel'

export function Hero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-end bg-[var(--color-bg)] overflow-hidden pt-16">

      <HeroGrid />

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 w-full pb-16 lg:pb-20 relative z-10">

        <div className="grid lg:grid-cols-[1fr_300px] lg:gap-16 items-end">

          <div>
            <div>
              <div className="mb-10">
                <BracketLabel>Local service websites</BracketLabel>
              </div>

              <h1 className="mb-8 max-w-[11ch] text-[clamp(3rem,8vw,7rem)] font-medium leading-[0.98] tracking-[-0.035em] text-ink sm:max-w-[14ch] lg:max-w-[13ch]">
                <span className="block font-sans text-[0.74em] tracking-[-0.025em]">Websites built to</span>
                <span
                  className="mt-2 block font-serif italic leading-[0.9] text-amber"
                  style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
                >
                  run, grow,
                </span>
                <span
                  className="block font-serif italic leading-[0.9] text-amber"
                  style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
                >
                  and get discovered.
                </span>
              </h1>

              <p
                className="mb-10 max-w-[31ch] text-[1.125rem] leading-relaxed text-ink-muted tracking-[-0.005em] sm:max-w-[52ch]"
              >
                I build custom websites for local service businesses that improve operations, trust, and conversion. Now structured for how people search through Google, AI tools, Maps, and local recommendations.
              </p>

              <div className="flex flex-col items-start gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
                <Link
                  to="/audit"
                  className="group inline-flex items-center gap-2.5 border-[1.5px] border-ink px-6 py-3 text-sm font-medium text-ink tracking-[-0.005em] transition-all duration-200 hover:border-amber hover:text-amber"
                >
                  Get a Website Audit
                  <span className="text-amber transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </Link>

                <a
                  href="/portfolio"
                  className="group relative text-sm text-ink-muted transition-colors duration-200 hover:text-ink"
                >
                  See Selected Work
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-0 h-px w-0 bg-amber transition-all duration-200 group-hover:w-full"
                  />
                </a>
              </div>

            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.35 }}
            className="hidden lg:flex flex-col gap-3 pb-2 text-right"
          >
            <BracketLabel>strategy</BracketLabel>
            <BracketLabel>systems</BracketLabel>
            <BracketLabel>web</BracketLabel>
            <BracketLabel>conversion</BracketLabel>
          </motion.div>

        </div>
      </div>

      <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-px bg-[var(--color-border)]" />
    </section>
  )
}

function HeroGrid() {
  const reduceMotion = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-0 top-16 z-0 hidden h-[calc(100%-4rem)] w-[55%] opacity-60 lg:block"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 560 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {[0, 140, 280, 420, 560].map((x) => (
          <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="800"
            stroke="var(--color-border-strong)" strokeWidth="0.75" opacity="0.34" />
        ))}
        {[0, 160, 320, 480, 640, 800].map((y) => (
          <line key={`h-${y}`} x1="0" y1={y} x2="560" y2={y}
            stroke="var(--color-border-strong)" strokeWidth="0.75" opacity="0.34" />
        ))}

        <text x="16" y="178" fontSize="7" fill="var(--color-ink-subtle)"
          letterSpacing="1.5" fontFamily="Inter, sans-serif" opacity="0.34">[ SCOPE ]</text>
        <text x="156" y="338" fontSize="7" fill="var(--color-ink-subtle)"
          letterSpacing="1.5" fontFamily="Inter, sans-serif" opacity="0.34">[ STRUCTURE ]</text>
        <text x="436" y="498" fontSize="7" fill="var(--color-ink-subtle)"
          letterSpacing="1.5" fontFamily="Inter, sans-serif" opacity="0.34">[ LAUNCH ]</text>
        <text x="16" y="498" fontSize="7" fill="var(--color-ink-subtle)"
          letterSpacing="1.5" fontFamily="Inter, sans-serif" opacity="0.34">[ CONVERT ]</text>

        <motion.g
          initial={false}
          animate={reduceMotion ? { opacity: 0.4 } : { opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <line x1="275" y1="315" x2="285" y2="325" stroke="var(--color-amber)" strokeWidth="0.8" />
          <line x1="285" y1="315" x2="275" y2="325" stroke="var(--color-amber)" strokeWidth="0.8" />
        </motion.g>

        <motion.circle
          cx="420" cy="320" r="2" fill="var(--color-amber)"
          initial={false}
          animate={reduceMotion ? { opacity: 0.5 } : { opacity: [0.25, 0.65, 0.25] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        />
      </svg>
    </div>
  )
}
