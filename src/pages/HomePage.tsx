import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { OriginalEdge } from '@/components/sections/OriginalEdge'
import { DiscoveryLayer } from '@/components/sections/DiscoveryLayer'
import { ThreePaths } from '@/components/sections/ThreePaths'
import { Modules } from '@/components/sections/Modules'
import { CustomBuild } from '@/components/sections/CustomBuild'
import { Process } from '@/components/sections/Process'
import { HomepageFaq } from '@/components/sections/HomepageFaq'
import { Contact } from '@/components/sections/Contact'

export function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <OriginalEdge />
        <DiscoveryLayer />
        <ThreePaths />
        <Modules />
        <CustomBuild />
        <Process />
        <HomepageFaq />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
