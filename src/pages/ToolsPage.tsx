import { Link } from 'react-router-dom'
import { ArrowUpRight, FileSpreadsheet, ScanSearch, Wrench } from 'lucide-react'

export function ToolsPage() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 pb-28 pt-24 md:px-10 md:pt-32 lg:px-14">
      <p className="mb-6 text-xs font-semibold uppercase tracking-[0.17em] text-[#A17A3E]">Tools / Workbench</p>
      <h1 className="max-w-4xl text-[clamp(3.6rem,7vw,7rem)] font-medium leading-[1] tracking-[-0.075em]">Useful software, <span className="font-serif font-normal italic text-[#B08336]">not a suite.</span></h1>
      <p className="mt-8 max-w-2xl text-lg leading-8 text-[#607062]">We're evaluating focused tools for emerging platforms, data and developer workflows. The concepts below are not released products.</p>
      <Link to="/tools/feed-doctor" className="group mt-16 grid gap-7 border-y border-[#D0DCCD] py-12 md:grid-cols-[90px_1fr_auto] md:items-center">
        <span className="text-sm text-[#A17A3E]">01</span>
        <div><p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#9A7942]">Research concept</p><h2 className="text-4xl font-medium tracking-[-0.06em]">Feed Doctor</h2><p className="mt-3 max-w-xl text-sm leading-7 text-[#647465]">Exploring product-feed validation and clearer error explanations for AI commerce.</p></div>
        <ArrowUpRight size={22} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"/>
      </Link>
      <div className="grid gap-7 border-b border-[#D0DCCD] py-12 md:grid-cols-[90px_1fr_auto]">
        <span className="text-sm text-[#A17A3E]">02</span>
        <div><p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#9A7942]">Early research</p><h2 className="text-4xl font-medium tracking-[-0.06em]">Developer readiness</h2><p className="mt-3 max-w-xl text-sm leading-7 text-[#647465]">Investigating how developers can catch integration and release problems before production.</p></div>
        <span className="text-xs text-[#8A9789]">No product commitment</span>
      </div>
    </section>
  )
}

export function FeedDoctorPage() {
  return (
    <>
      <section className="mx-auto max-w-[1440px] px-6 pb-20 pt-24 md:px-10 md:pt-32 lg:px-14">
        <p className="mb-7 text-xs font-semibold uppercase tracking-[0.17em] text-[#A17A3E]">Anvisco / Research concept 01</p>
        <h1 className="text-[clamp(3.8rem,9vw,8rem)] font-medium leading-[1] tracking-[-0.078em]">Feed <span className="font-serif font-normal italic text-[#B08336]">Doctor.</span></h1>
        <p className="mt-9 max-w-3xl text-xl leading-[1.8] text-[#596A5D]">Exploring a simpler way to identify product-feed problems before they disrupt AI commerce workflows.</p>
        <div className="mt-8 inline-block border border-[#E1D5B8] bg-[#F5EEDD] px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#896829]">Concept in evaluation. Not yet available.</div>
        <div className="mt-10"><a href="mailto:brian@anvisco.com?subject=Feed%20Doctor%20feedback" className="inline-flex items-center gap-4 bg-[#20352C] px-6 py-4 text-sm font-semibold text-white hover:bg-[#345342]">Share feedback <ArrowUpRight size={16}/></a></div>
      </section>
      <section className="border-y border-[#D0DCCD] bg-[#EEF2EC]">
        <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 lg:px-14">
          <p className="mb-9 text-xs font-semibold uppercase tracking-widest text-[#9A7942]">Research directions</p>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: FileSpreadsheet, name: 'Check the data', body: 'Detect potentially missing fields and inconsistent values.' },
              { icon: ScanSearch, name: 'Explain the issues', body: 'Translate technical feed problems into practical guidance.' },
              { icon: Wrench, name: 'Prepare the next step', body: 'Explore safe repairs and cleaner data exports.' },
            ].map(({icon: Icon, name, body}) => (
              <div key={name} className="border border-[#D4DFD0] bg-[#FBFCF8] p-8"><Icon className="text-[#A17A3E]" size={24}/><h2 className="mt-12 text-2xl font-medium tracking-[-0.05em]">{name}</h2><p className="mt-3 text-sm leading-7 text-[#69796B]">{body}</p></div>
            ))}
          </div>
          <p className="mt-8 text-sm leading-7 text-[#718072]">These are exploration areas, not released capabilities. Anvisco is independent of and not endorsed by OpenAI or any AI commerce platform.</p>
        </div>
      </section>
      <section className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 lg:px-14"><Link to="/tools" className="text-sm font-semibold underline underline-offset-4">Back to tools</Link></section>
    </>
  )
}
