import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { WhyThisMatters } from '@/components/sections/WhyThisMatters'
import { SelectedWork } from '@/components/sections/SelectedWork'
import { WhatIHandle } from '@/components/sections/WhatIHandle'
import { Process } from '@/components/sections/Process'
import { Pricing } from '@/components/sections/Pricing'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'

export function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WhyThisMatters />
        <SelectedWork />
        <WhatIHandle />
        <Process />
        <Pricing />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
