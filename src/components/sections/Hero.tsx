import { motion, useReducedMotion } from 'motion/react'
import { BracketLabel } from '@/components/ui/BracketLabel'

const CALENDLY = 'https://calendly.com/nducanhnguyenn/15-minute-discovery-call'

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export function Hero() {
  const reduceMotion = useReducedMotion()
  const variants = reduceMotion
    ? { hidden: {}, visible: {} }
    : undefined

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-end bg-[var(--color-bg)] overflow-hidden pt-16">

      {/* MAKEDO-style thin grid wireframe */}
      <HeroGrid />

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 w-full pb-16 lg:pb-20 relative z-10">

        <div className="grid lg:grid-cols-[1fr_300px] lg:gap-16 items-end">

          {/* Left column — headline block */}
          <div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={variants ?? { visible: { transition: { staggerChildren: 0.08 } } }}
            >
              {/* Bracket tag */}
              <motion.div
                variants={reduceMotion ? undefined : fadeIn}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="mb-10"
              >
                <BracketLabel>Business Systems + Website</BracketLabel>
              </motion.div>

              {/* Display headline */}
              <motion.h1
                variants={reduceMotion ? undefined : fadeUp}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="mb-8 font-sans font-medium leading-[0.95] tracking-[-0.04em] text-ink"
                style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}
              >
                <span className="block">Websites that</span>
                <em
                  className="font-serif italic text-amber"
                  style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
                >
                  run
                </em>
                <span className="block">optimize</span>
                <span className="block">and grow</span>
                <span className="block">your business.</span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                variants={reduceMotion ? undefined : fadeUp}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="mb-10 max-w-[52ch] text-[1.125rem] leading-relaxed text-ink-muted tracking-[-0.005em]"
              >
                I help local businesses turn complex offers and operations into
                clear, fast websites that convert.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={reduceMotion ? undefined : fadeUp}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex flex-wrap items-center gap-6"
              >
                <a
                  href={CALENDLY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 border border-[var(--color-border-strong)] px-6 py-3 text-sm font-medium text-ink tracking-[-0.005em] transition-all duration-200 hover:border-amber hover:text-amber"
                >
                  Book a 15-minute call
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </a>

                <a
                  href="#work"
                  className="group relative text-sm text-ink-subtle transition-colors duration-200 hover:text-ink"
                >
                  See the work
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-0 h-px w-0 bg-amber transition-all duration-200 group-hover:w-full"
                  />
                </a>
              </motion.div>

            </motion.div>
          </div>

          {/* Right column — floating bracket labels, desktop only */}
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

      {/* Full-viewport structural rule at base of hero */}
      <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-px bg-[var(--color-border)]" />
    </section>
  )
}

function HeroGrid() {
  const reduceMotion = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-0 top-0 z-0 hidden h-full w-[55%] lg:block"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 560 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Vertical grid lines */}
        {[0, 140, 280, 420, 560].map((x) => (
          <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="800"
            stroke="var(--color-border)" strokeWidth="0.75" />
        ))}
        {/* Horizontal grid lines */}
        {[0, 160, 320, 480, 640, 800].map((y) => (
          <line key={`h-${y}`} x1="0" y1={y} x2="560" y2={y}
            stroke="var(--color-border)" strokeWidth="0.75" />
        ))}

        {/* Bracket annotations inside grid cells */}
        <text x="16" y="178" fontSize="7" fill="var(--color-ink-subtle)"
          letterSpacing="1.5" fontFamily="Inter, sans-serif" opacity="0.55">[ SCOPE ]</text>
        <text x="156" y="338" fontSize="7" fill="var(--color-ink-subtle)"
          letterSpacing="1.5" fontFamily="Inter, sans-serif" opacity="0.55">[ STRUCTURE ]</text>
        <text x="296" y="178" fontSize="7" fill="var(--color-amber)"
          letterSpacing="1.5" fontFamily="Inter, sans-serif" opacity="0.65">[ 01 ]</text>
        <text x="436" y="498" fontSize="7" fill="var(--color-ink-subtle)"
          letterSpacing="1.5" fontFamily="Inter, sans-serif" opacity="0.55">[ LAUNCH ]</text>
        <text x="16" y="498" fontSize="7" fill="var(--color-ink-subtle)"
          letterSpacing="1.5" fontFamily="Inter, sans-serif" opacity="0.55">[ CONVERT ]</text>

        {/* Amber crosshair accent */}
        <motion.g
          initial={false}
          animate={reduceMotion ? { opacity: 0.4 } : { opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <line x1="275" y1="315" x2="285" y2="325" stroke="var(--color-amber)" strokeWidth="0.8" />
          <line x1="285" y1="315" x2="275" y2="325" stroke="var(--color-amber)" strokeWidth="0.8" />
        </motion.g>

        {/* Amber dot */}
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
