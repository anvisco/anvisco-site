/**
 * Source of truth for every Anvis offer, price, and bundle rule.
 *
 * - Prices are stored in DOLLARS as numbers for direct UI use.
 * - The DB stores them in cents (offer.priceCents = price * 100).
 * - Bundle rule lives here too so /checkout, marketing, and the
 *   admin can never disagree about pricing.
 */

export const BUNDLE_DISCOUNT_RATE = 0.15
export const BUNDLE_DISCOUNT_MIN_MODULES = 3

// ---------- Audit ----------

export type AuditId = 'free-snapshot' | 'full-audit'

export interface AuditOffer {
  id: AuditId
  name: string
  price: number
  description: string
  note?: string
}

export const AUDIT_OFFERS: AuditOffer[] = [
  {
    id: 'free-snapshot',
    name: 'Free AI-Ready Website Snapshot',
    price: 0,
    description:
      'Three to five priority findings. A quick first look at where the site may be losing visibility, trust, or bookings.',
  },
  {
    id: 'full-audit',
    name: 'Full Website Audit',
    price: 250,
    description:
      'A deeper review with a ranked action plan across visibility, trust, content, speed, and booking flow.',
    note: 'If you move forward with a module or build within 30 days, the audit fee is applied to that project.',
  },
]

// ---------- Modules ----------

export type ModuleId =
  | 'content-architecture'
  | 'visual-redesign'
  | 'booking-flow'
  | 'animation-premium'
  | 'service-page-expansion'
  | 'mobile-speed-cleanup'

export interface ModuleOffer {
  id: ModuleId
  name: string
  description: string
  /** Price in dollars. For per-page modules this is the price per page. */
  price: number
  /** Optional unit label, e.g. 'per page'. Undefined means flat price. */
  unit?: string
  /** If the module is priced per unit, the minimum quantity. Defaults to 1. */
  minQuantity?: number
}

export const MODULE_OFFERS: ModuleOffer[] = [
  {
    id: 'content-architecture',
    name: 'Content Architecture Upgrade',
    description:
      'Restructure content so people, Google, and AI tools clearly understand the business.',
    price: 1400,
  },
  {
    id: 'visual-redesign',
    name: 'Visual Redesign',
    description: 'Modernize the look without rebuilding the system.',
    price: 1800,
  },
  {
    id: 'booking-flow',
    name: 'Booking Flow Optimization',
    description: 'Make it easier to move from interest to appointment.',
    price: 1200,
  },
  {
    id: 'animation-premium',
    name: 'Animation & Premium Interaction',
    description: 'Add motion and polish without overengineering.',
    price: 900,
  },
  {
    id: 'service-page-expansion',
    name: 'Service Page Expansion',
    description: 'Dedicated pages for high-value services.',
    price: 600,
    unit: 'per page',
    minQuantity: 3,
  },
  {
    id: 'mobile-speed-cleanup',
    name: 'Mobile Speed Cleanup',
    description: 'Fix slow, bloated, or broken mobile experiences.',
    price: 750,
  },
]

export function getModuleOffer(id: string): ModuleOffer | undefined {
  return MODULE_OFFERS.find((m) => m.id === id)
}

// ---------- Full Builds ----------

export type BuildId = 'essentials' | 'standard' | 'premium'

export interface BuildOffer {
  id: BuildId
  name: string
  /** First few clients only. Lower price. */
  foundingPrice: number
  /** Standing public list price. */
  publicPrice: number
  delivery: string
  features: string[]
  recommended?: boolean
}

export const BUILD_OFFERS: BuildOffer[] = [
  {
    id: 'essentials',
    name: 'Essentials',
    foundingPrice: 1500,
    publicPrice: 2200,
    delivery: '7 to 10 days',
    features: [
      'Up to 5 pages.',
      'Mobile-first.',
      'Booking-focused.',
      'Basic AI-ready content structure.',
      'Local SEO foundations.',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    foundingPrice: 2600,
    publicPrice: 3800,
    delivery: '10 to 14 days',
    recommended: true,
    features: [
      'Up to 10 pages.',
      'Full AI-ready content architecture.',
      'Schema setup.',
      'Booking integration.',
      'One additional language.',
      'Conversion tracking.',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    foundingPrice: 4500,
    publicPrice: 6500,
    delivery: '14 to 21 days',
    features: [
      'Custom features.',
      'Portals, APIs, advanced flows.',
      'Up to two additional languages.',
      'Premium animations.',
      'CMS or easy editing layer.',
    ],
  },
]

export const FOUNDING_RATE_NOTE =
  'Founding rate: limited to the first few dental and local service builds, then prices return to public rates.'

// ---------- Recurring ----------

export type RecurringId = 'care' | 'growth'

export interface RecurringOffer {
  id: RecurringId
  name: string
  /** Monthly price in dollars. */
  monthlyPrice: number
  features: string[]
}

export const RECURRING_OFFERS: RecurringOffer[] = [
  {
    id: 'care',
    name: 'Care Plan',
    monthlyPrice: 149,
    features: [
      'Hosting and deployment support.',
      'Small content and image updates, up to 1 hour/month, rolls over up to 2 hours.',
      'Bug fixes.',
      'Security and uptime monitoring.',
      'Backups.',
      'Priority email support.',
      'Larger work scoped separately.',
    ],
  },
  {
    id: 'growth',
    name: 'Growth Plan',
    monthlyPrice: 449,
    features: [
      'Everything in Care Plan.',
      'Up to 3 hours of content or page updates monthly.',
      'One new or rebuilt service page per quarter.',
      'Monthly AI visibility check.',
      'GBP alignment review.',
      'Quarterly analytics review.',
      'Conversion improvements based on real traffic data.',
      'Caps reset monthly with one-month rollover.',
    ],
  },
]
