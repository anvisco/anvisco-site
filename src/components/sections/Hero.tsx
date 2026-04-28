import { motion, useReducedMotion } from 'motion/react'

const CALENDLY = 'https://calendly.com/nducanhnguyenn/15-minute-discovery-call'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export function Hero() {
  return (
    <section
      className="relative min-h-[80vh] flex items-start pt-16 bg-background overflow-hidden"
    >
      <HeroSystemDiagram />

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 w-full pt-16 pb-6 lg:pt-24 lg:pb-8">

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          className="relative z-10 max-w-4xl"
        >
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-8 text-xs uppercase tracking-[0.2em] text-muted-foreground"
          >
            Brian Nguyen / Business Systems + Websites
          </motion.p>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-[clamp(2.4rem,11vw,3.4rem)] font-bold tracking-tight leading-[0.95] mb-8 text-white md:text-6xl md:leading-[1.03] xl:text-[5.5rem]"
          >
            Websites that run,
            <br />
            optimize, and grow
            <br />
            your business.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-10 max-w-xl text-lg leading-relaxed text-foreground/80"
          >
            I help local businesses turn complex offers and operations into
            clear, fast websites that convert.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-wrap items-center gap-5 mb-10"
          >
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/85"
            >
              Book a 15-minute call
            </a>
            <a
              href="#work"
              className="text-sm text-muted-foreground transition-colors duration-150 hover:text-white"
            >
              See the work ↓
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
            >
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
                <path
                  d="M1 1L8 8L15 1"
                  stroke="white"
                  strokeOpacity="0.3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  )
}

function HeroSystemDiagram() {
  const reduceMotion = useReducedMotion()

  const pulseTransition = reduceMotion
    ? undefined
    : {
        duration: 4.8,
        repeat: Infinity,
        repeatType: 'mirror' as const,
        ease: 'easeInOut' as const,
      }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-[42%] top-4 z-0 hidden h-[45rem] w-[56rem] opacity-45 lg:block xl:left-[45%] xl:h-[49rem] xl:w-[62rem]"
    >
      <div className="absolute inset-0 rounded-full bg-primary/[0.035] blur-3xl" />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 544 480"
        fill="none"
      >
        <defs>
          <linearGradient id="hero-line" x1="90" y1="120" x2="460" y2="360" gradientUnits="userSpaceOnUse">
            <stop stopColor="hsl(var(--primary))" stopOpacity="0.08" />
            <stop offset="0.5" stopColor="hsl(var(--primary))" stopOpacity="0.32" />
            <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0.06" />
          </linearGradient>
          <radialGradient id="hero-node" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 0) rotate(90) scale(46)">
            <stop stopColor="hsl(var(--primary))" stopOpacity="0.34" />
            <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
          </radialGradient>
        </defs>

        <path d="M118 148 C 210 126, 248 196, 322 178 S 414 154, 456 214" stroke="url(#hero-line)" strokeWidth="1.2" />
        <path d="M118 148 C 192 228, 260 242, 322 304 S 404 382, 456 330" stroke="url(#hero-line)" strokeWidth="1.2" />
        <path d="M196 336 C 232 282, 270 244, 322 178" stroke="url(#hero-line)" strokeWidth="1.2" />
        <path d="M196 336 C 260 352, 318 352, 456 330" stroke="url(#hero-line)" strokeWidth="1.2" />

        {[
          { x: 118, y: 148, delay: 0 },
          { x: 322, y: 178, delay: 0.45 },
          { x: 456, y: 214, delay: 0.9 },
          { x: 196, y: 336, delay: 1.35 },
          { x: 456, y: 330, delay: 1.8 },
        ].map((node) => (
          <g key={`${node.x}-${node.y}`}>
            <circle cx={node.x} cy={node.y} r="30" fill="url(#hero-node)" opacity="0.22" />
            <circle cx={node.x} cy={node.y} r="6" fill="hsl(var(--primary))" opacity="0.5" />
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="12"
              stroke="hsl(var(--primary))"
              strokeWidth="1"
              initial={false}
              animate={reduceMotion ? { opacity: 0.16, scale: 1 } : { opacity: [0.08, 0.36, 0.08], scale: [0.96, 1.18, 0.96] }}
              transition={pulseTransition ? { ...pulseTransition, delay: node.delay } : undefined}
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            />
          </g>
        ))}

        {[
          { x: 82, y: 112, w: 72 },
          { x: 286, y: 142, w: 92 },
          { x: 418, y: 178, w: 68 },
          { x: 158, y: 300, w: 84 },
          { x: 418, y: 294, w: 76 },
        ].map((block, index) => (
          <motion.g
            key={`${block.x}-${block.y}`}
            initial={false}
            animate={reduceMotion ? { opacity: 0.34 } : { opacity: [0.22, 0.42, 0.22] }}
            transition={pulseTransition ? { ...pulseTransition, delay: index * 0.3 } : undefined}
          >
            <rect x={block.x} y={block.y} width={block.w} height="40" rx="3" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeOpacity="0.38" />
            <rect x={block.x + 12} y={block.y + 12} width={block.w - 24} height="3" rx="1.5" fill="hsl(var(--primary))" opacity="0.3" />
            <rect x={block.x + 12} y={block.y + 22} width={(block.w - 24) * 0.64} height="3" rx="1.5" fill="hsl(var(--primary))" opacity="0.18" />
          </motion.g>
        ))}
      </svg>
    </div>
  )
}
