import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, CircleDot } from 'lucide-react'

export function HomePage() {
  return (
    <>
      <section className="border-b border-[#D4DED3]">
        <div className="mx-auto grid max-w-[1440px] gap-20 px-6 pb-24 pt-24 md:px-10 md:pt-32 lg:grid-cols-[1.1fr_.9fr] lg:gap-20 lg:px-14 lg:pt-36">
          <div>
            <p className="mb-8 flex items-center gap-3 text-[0.69rem] font-semibold uppercase tracking-[0.20em] text-[#92713D]"><span className="h-1.5 w-1.5 rounded-full bg-[#B08336]" /> Independent software & experiments</p>
            <h1 className="max-w-[800px] text-[clamp(3.6rem,7vw,7.2rem)] font-medium leading-[0.99] tracking-[-0.078em]">Small tools for the <span className="font-serif font-normal italic tracking-[-0.045em] text-[#B08336]">AI-native web.</span></h1>
            <p className="mt-9 max-w-[560px] text-lg leading-[1.85] text-[#596A5D]">Anvisco explores the friction behind emerging platforms and turns specific problems into useful, self-service software.</p>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link to="/tools" className="inline-flex items-center gap-5 bg-[#20352C] px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#345342]">Explore tools <ArrowUpRight size={16}/></Link>
              <Link to="/about" className="inline-flex items-center gap-2 py-4 text-sm font-semibold hover:underline">About Anvisco <ArrowUpRight size={16}/></Link>
            </div>
            <p className="mt-14 text-xs leading-6 text-[#879187]">Early stage, deliberately. Products will launch here when they are ready.</p>
          </div>
          <div className="flex items-center">
            <div className="w-full border border-[#CDD9C9] bg-[#EAEFE7] p-5 shadow-[20px_20px_0_0_#E0E7DD] md:p-7">
              <div className="border border-[#CBD5C8] bg-[#FBFCF9]">
                <div className="flex items-center justify-between border-b border-[#E0E7DD] px-6 py-4">
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#7B897A]">The Anvisco approach</span>
                  <span className="flex gap-1.5"><span className="h-2 w-2 rounded-full bg-[#D3DCD1]"/><span className="h-2 w-2 rounded-full bg-[#D3DCD1]"/><span className="h-2 w-2 rounded-full bg-[#B08336]"/></span>
                </div>
                <div className="space-y-9 px-7 py-10 md:px-9 md:py-12">
                  {[
                    ['01','Find the friction.','Start with a specific problem, not a grand platform.'],
                    ['02','Build the useful part.','Remove needless setup and repetitive work.'],
                    ['03','Ship. Learn. Improve.','Let real use determine what deserves to grow.'],
                  ].map(([number,title,body]) => (
                    <div key={number} className="flex gap-5">
                      <span className="pt-1 text-xs font-semibold text-[#B08336]">{number}</span>
                      <div><h2 className="text-2xl font-medium tracking-[-0.05em]">{title}</h2><p className="mt-2 text-sm leading-7 text-[#6A7A6C]">{body}</p></div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-[#E0E7DD] bg-[#F4F7F1] px-6 py-4 text-xs text-[#879286]"><span>Focused by design</span><Check size={16} /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-10 px-6 py-24 md:px-10 md:py-32 lg:grid-cols-[.8fr_1.2fr] lg:gap-28 lg:px-14">
        <div>
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.17em] text-[#A17A3E]">What we're working toward</p>
          <h2 className="text-4xl font-medium leading-[1.08] tracking-[-0.055em] md:text-5xl">Less noise.<br/>More useful software.</h2>
        </div>
        <div>
          <p className="text-lg leading-[1.9] text-[#596A5D]">AI platforms create new capabilities, but also unfamiliar data formats, changing requirements, fragile integrations and repetitive technical work.</p>
          <p className="mt-6 text-lg leading-[1.9] text-[#596A5D]">We're interested in the small pieces of software that make these workflows simpler. Tools that people can use directly, without a sales call.</p>
          <Link to="/tools" className="mt-8 inline-flex items-center gap-2 border-b border-[#B08336] pb-2 text-sm font-semibold">See the workbench <ArrowUpRight size={16}/></Link>
        </div>
      </section>

      <section className="border-y border-[#D2DCCF] bg-[#EEF2EC]">
        <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24 lg:px-14">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div><p className="mb-4 text-xs font-semibold uppercase tracking-[0.17em] text-[#A17A3E]">On the workbench</p><h2 className="text-4xl font-medium tracking-[-0.065em] md:text-5xl">Ideas under evaluation.</h2></div>
            <Link to="/tools" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline">All experiments <ArrowUpRight size={16}/></Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Link to="/tools/feed-doctor" className="group flex min-h-[280px] flex-col justify-between border border-[#D0DBCB] bg-[#FBFCF8] p-8 transition-colors hover:border-[#829783] md:p-10">
              <div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A9687]">01 / Commerce data</span><ArrowUpRight size={19} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"/></div>
              <div><span className="mb-3 inline-flex items-center gap-2 text-xs text-[#A17A3E]"><CircleDot size={12}/> Research concept</span><h3 className="text-3xl font-medium tracking-[-0.06em]">Feed Doctor</h3><p className="mt-3 max-w-md text-sm leading-7 text-[#687869]">Exploring better ways to check product data before it enters AI commerce workflows.</p></div>
            </Link>
            <div className="flex min-h-[280px] flex-col justify-between border border-dashed border-[#C7D3C4] p-8 md:p-10">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A9687]">02 / Future experiments</span>
              <div><h3 className="text-3xl font-medium tracking-[-0.06em]">More to come.</h3><p className="mt-3 max-w-md text-sm leading-7 text-[#687869]">New ideas are being tested in data quality, developer tooling and AI integrations.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-10 px-6 py-24 md:px-10 md:py-32 lg:px-14">
        <div><p className="mb-5 text-xs font-semibold uppercase tracking-[0.17em] text-[#A17A3E]">Previous chapter</p><h2 className="text-4xl font-medium leading-[1.12] tracking-[-0.055em] md:text-5xl">Built on real work.<br/><span className="font-serif font-normal italic text-[#B08336]">Moving toward products.</span></h2><p className="mt-6 max-w-xl text-base leading-8 text-[#627164]">Anvisco's earlier client-facing website and selected work will remain accessible as this new direction takes shape.</p></div>
        <a href="https://archive.anvisco.com" className="inline-flex items-center gap-3 border-b border-[#20352C] pb-2 text-sm font-semibold">View previous website <ArrowUpRight size={16}/></a>
      </section>
    </>
  )
}
