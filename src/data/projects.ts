export interface Project {
  id: string
  tag: string
  client: string
  image: string
  link: string
  alt: string
  shortDescription: string
  stack: string[]
}

export const projects: Project[] = [
  {
    id: 'dgs',
    tag: 'Systems & Engagement',
    client: 'Do Good Society',
    image: '/images/work/dgs.png',
    link: 'https://www.dogood-society.com',
    alt: 'Do Good Society membership platform with pricing and conversion flow',
    shortDescription:
      'Built a membership platform combining the site, member portal, affiliate engine, payments, and newsletter system so visitors understand the offer quickly and the business runs end-to-end.',
    stack: ['Wix Studio', 'GoHighLevel', 'API Integration', 'Stripe', 'Brevo', 'Zoho Campaigns'],
  },
  {
    id: 'iwb',
    tag: 'Operations & Continuity',
    client: 'Immigrant Women in Business',
    image: '/images/work/iwib.png',
    link: 'https://iwbstore.myshopify.com/',
    alt: 'Immigrant Women in Business website showing community engagement and content structure',
    shortDescription:
      'Unified a WordPress and Shopify membership experience into one clearer journey, supporting a multi-year partnership with 14K+ contacts engaged through email and events.',
    stack: ['Shopify', 'WordPress', 'Brevo', 'Eventbrite', 'Google Forms'],
  },
  {
    id: 'pdt',
    tag: 'Scale & Investment',
    client: 'Purpose Driven Transformations',
    image: '/images/work/pdt.png',
    link: 'https://pdttoronto.com',
    alt: 'Purpose Driven Transformations membership economics and impact allocation system',
    shortDescription:
      'Built an investor-ready, member-accessible site for a women-owned social enterprise, structured as a city-by-city template for expansion across Canadian and US markets.',
    stack: ['Wix', 'Investor Narrative'],
  },
  {
    id: 'rtg',
    tag: 'Corporate & Partnership',
    client: 'RTG Group',
    image: '/images/work/rtg.png',
    link: 'https://rtggroupinc.com',
    alt: 'RTG Group ecosystem showing multiple programs and structured information architecture',
    shortDescription:
      "Clarified a holding company's web presence and companion decks so corporate partners, sponsors, and investors can understand the ecosystem quickly.",
    stack: ['Wix', 'Ecosystem Structure', 'Corporate Decks', 'Partner Pages'],
  },
]
