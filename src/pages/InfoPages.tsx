import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

function Label({ children }: { children: string }) {
  return <p className="mb-7 text-xs font-semibold uppercase tracking-[0.17em] text-[#A17A3E]">{children}</p>
}

export function AboutPage() {
  return (
    <>
      <section className="mx-auto grid max-w-[1440px] gap-14 px-6 pb-24 pt-24 md:px-10 md:pt-32 lg:grid-cols-[.6fr_1fr] lg:gap-20 lg:px-14">
        <div><Label>About Anvisco</Label></div>
        <div>
          <h1 className="text-[clamp(3.2rem,6vw,6rem)] font-medium leading-[1.02] tracking-[-0.07em]">Small problems. <span className="font-serif font-normal italic text-[#B08336]">Useful answers.</span></h1>
          <p className="mt-12 text-xl leading-[1.85] text-[#536356]">Anvisco began with websites, digital systems, and workflow improvements for clients. That experience shaped an interest in software people can use directly, without depending on the people who built it.</p>
          <p className="mt-6 text-lg leading-[1.9] text-[#536356]">We're moving toward focused, self-service tools for a changing technology landscape. We start with specific friction, test a small solution, and let real use determine where to invest further.</p>
          <p className="mt-6 text-lg leading-[1.9] text-[#536356]">AI is part of that landscape, not a requirement for every product. Usefulness and maintainability come first.</p>
        </div>
      </section>
      <section className="border-y border-[#D4DDD1] bg-[#EEF2EC]"><div className="mx-auto grid max-w-[1440px] gap-px bg-[#D4DDD1] md:grid-cols-2 md:px-10 lg:px-14">
        {[
          ['01','Narrow before broad','Solve one well-defined problem instead of starting with a platform.'],
          ['02','Self-service first','Make the useful result accessible without custom implementation.'],
          ['03','Useful before impressive','Clarity and practical outcomes over unnecessary complexity.'],
          ['04','Evidence before expansion','Release small, observe what works, and invest accordingly.'],
        ].map(([n,title,text]) => <article key={n} className="bg-[#F8FAF6] p-9"><span className="text-xs text-[#A17A3E]">{n}</span><h2 className="mt-7 text-2xl font-medium tracking-[-0.05em]">{title}</h2><p className="mt-3 text-sm leading-7 text-[#677869]">{text}</p></article>)}
      </div></section>
      <section className="mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-8 px-6 py-20 md:px-10 lg:px-14"><div><h2 className="text-3xl font-medium tracking-[-0.06em]">The previous chapter remains accessible.</h2><p className="mt-4 max-w-xl text-sm leading-7 text-[#627164]">Our client services website and selected past work are preserved separately.</p></div><a href="https://archive.anvisco.com" className="inline-flex items-center gap-3 border-b border-[#20352C] pb-2 text-sm font-semibold">Previous website <ArrowUpRight size={16}/></a></section>
    </>
  )
}

export function NotesPage() {
  return <section className="mx-auto max-w-[1440px] px-6 pb-28 pt-24 md:px-10 md:pt-32 lg:px-14">
    <Label>Notes / Workbench</Label>
    <h1 className="text-[clamp(3.5rem,7vw,7rem)] font-medium leading-[1.02] tracking-[-0.075em]">What we're <span className="font-serif font-normal italic text-[#B08336]">learning.</span></h1>
    <p className="mt-8 max-w-2xl text-lg leading-8 text-[#5F6F63]">Thoughts on building small tools for changing platforms. Product-specific guides will follow actual releases.</p>
    <article className="mt-16 grid gap-8 border-t border-[#D3DCD0] pt-10 md:grid-cols-[200px_1fr]"><span className="text-xs font-semibold uppercase tracking-[0.13em] text-[#93A090]">Field note 001 / October 2026</span><div><h2 className="text-3xl font-medium tracking-[-0.055em]">Why we're building smaller.</h2><p className="mt-6 max-w-2xl text-base leading-8 text-[#5F6F63]">Our earlier work focused on websites and client workflows. The next phase is about building small pieces of software around repeated problems, testing them with real users, and expanding only when there is evidence. Rather than launching a large suite of promises, we'll build one useful thing at a time.</p></div></article>
  </section>
}

export function ContactPage() {
  return <section className="mx-auto grid max-w-[1440px] gap-14 px-6 pb-28 pt-24 md:px-10 md:pt-32 lg:grid-cols-2 lg:px-14">
    <div><Label>Contact</Label><h1 className="text-[clamp(3.5rem,7vw,7rem)] font-medium leading-[1] tracking-[-0.075em]">Start a <span className="font-serif font-normal italic text-[#B08336]">conversation.</span></h1></div>
    <div className="lg:pt-20"><p className="max-w-xl text-xl leading-[1.85] text-[#5B6B5E]">Have feedback on an experiment, noticed an interesting problem, or want to discuss a relevant partnership or narrowly scoped project?</p><a href="mailto:brian@anvisco.com" className="mt-12 inline-flex items-center gap-5 border-b border-[#20352C] pb-3 text-xl font-medium tracking-[-0.05em] md:text-3xl">brian@anvisco.com <ArrowUpRight size={21}/></a></div>
  </section>
}

export function SelectiveWorkPage() {
  return <section className="mx-auto max-w-[1440px] px-6 pb-28 pt-24 md:px-10 md:pt-32 lg:px-14">
    <Label>Selective work</Label>
    <h1 className="max-w-5xl text-[clamp(3.5rem,7vw,7rem)] font-medium leading-[1.02] tracking-[-0.075em]">Product-first.<br/><span className="font-serif font-normal italic text-[#B08336]">Open to the right work.</span></h1>
    <p className="mt-9 max-w-3xl text-xl leading-8 text-[#5B6B5E]">Anvisco is moving away from a general-purpose website-service model. We may still collaborate on well-defined web products, integrations, and workflow tools.</p>
    <div className="mt-16 grid gap-5 md:grid-cols-3">
      {[
        ['Product prototypes', 'Turn a tightly scoped concept into a usable web product.'],
        ['Integrations & automation', 'Connect systems and remove repetitive workflow steps.'],
        ['Web product implementation', 'Build focused experiences with clear functional requirements.'],
      ].map(([title,text]) => <article key={title} className="border-t border-[#BECFBC] pt-8"><h2 className="text-2xl font-medium tracking-[-0.05em]">{title}</h2><p className="mt-4 text-sm leading-7 text-[#667667]">{text}</p></article>)}
    </div>
    <div className="mt-12 flex flex-wrap gap-8"><Link to="/contact" className="inline-flex items-center gap-2 border-b border-[#20352C] pb-2 text-sm font-semibold">Discuss a project <ArrowUpRight size={16}/></Link><a href="https://archive.anvisco.com/services" className="inline-flex items-center gap-2 text-sm text-[#586E5D] hover:underline">Previous services <ArrowUpRight size={16}/></a></div>
  </section>
}

function Legal({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mx-auto max-w-[900px] px-6 pb-24 pt-24 md:pt-32"><Label>Website information</Label><h1 className="text-5xl font-medium tracking-[-0.07em] md:text-7xl">{title}</h1><div className="mt-12 space-y-6 text-base leading-8 text-[#5F6F63]">{children}</div></section>
}
export function PrivacyPage() {
  return <Legal title="Privacy.">
    <p>This notice covers the public company website, not the legacy site or future products with separate data handling.</p>
    <p>If you email Anvisco, we receive your address and any details you choose to send. We use that information to respond to your inquiry. Hosting infrastructure may process technical request data needed to serve and protect the site.</p>
    <p>This website has no login or product-data upload feature. Product experiments have not launched and will require their own accurate privacy disclosures before release.</p>
    <p>For data questions, contact <a className="underline" href="mailto:brian@anvisco.com">brian@anvisco.com</a>.</p>
  </Legal>
}
export function TermsPage() {
  return <Legal title="Terms.">
    <p>Anvisco currently uses this website to describe its work and explore potential software products.</p>
    <p>Concepts shown as research, in evaluation, or under development are not available products. Descriptions and future features may change.</p>
    <p>References to third-party platforms do not imply affiliation or endorsement. Website content is informational and does not guarantee product availability or compatibility.</p>
    <p>Questions: <a className="underline" href="mailto:brian@anvisco.com">brian@anvisco.com</a>. Additional product terms will be published if paid software becomes available.</p>
  </Legal>
}
export function NotFoundPage() {
  return <section className="mx-auto max-w-[1440px] px-6 py-32 md:px-10 lg:px-14"><Label>404 / Not found</Label><h1 className="text-5xl font-medium tracking-[-0.07em] md:text-7xl">Nothing here yet.</h1><p className="mt-6 text-base leading-8 text-[#5F6F63]">This page may have moved.</p><div className="mt-8 flex gap-8"><Link to="/" className="underline underline-offset-4">Return home</Link><a href="https://archive.anvisco.com" className="underline underline-offset-4">Previous website</a></div></section>
}
