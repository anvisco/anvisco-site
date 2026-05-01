export type PackageType = 'audit' | 'modules' | 'build' | 'recurring'
export type AuditSelection = 'full-audit'
export type BuildSelection = 'essentials' | 'standard' | 'premium'
export type RecurringSelection = 'care' | 'growth'

export interface SelectedModuleInput {
  module_id: string
  quantity: number
}

export interface NormalizedModuleSelection {
  module_id: string
  module_name: string
  quantity: number
  unit_price_cents: number
  total_cents: number
}

export interface CheckoutPricingResult {
  package_name: string
  package_type: PackageType
  subtotal_cents: number
  discount_cents: number
  total_cents: number
  charge_cents: number
  recurring_amount_cents: number | null
  line_items: StripeLineItem[]
  selected_modules: NormalizedModuleSelection[]
  summary: string
}

export interface StripeLineItem {
  quantity: number
  price_data: {
    currency: string
    unit_amount: number
    product_data: {
      name: string
      description?: string
    }
    recurring?: {
      interval: 'month'
    }
  }
}

export const BUNDLE_DISCOUNT_RATE = 0.15
export const BUNDLE_DISCOUNT_MIN_MODULES = 3

export const AUDIT_PRICES = {
  freeSnapshot: 0,
  fullAudit: 250,
} as const

export const MODULE_PRICES = {
  'content-architecture': {
    name: 'Content Architecture Upgrade',
    price: 1400,
  },
  'visual-redesign': {
    name: 'Visual Redesign',
    price: 1800,
  },
  'booking-flow': {
    name: 'Booking Flow Optimization',
    price: 1200,
  },
  'animation-premium': {
    name: 'Animation & Premium Interaction',
    price: 900,
  },
  'service-page-expansion': {
    name: 'Service Page Expansion',
    price: 600,
    unit: 'per page',
    minQuantity: 3,
  },
  'mobile-speed-cleanup': {
    name: 'Mobile Speed Cleanup',
    price: 750,
  },
} as const

export const BUILD_PRICES = {
  essentials: { name: 'Essentials', founding: 1500, public: 2200 },
  standard: { name: 'Standard', founding: 2600, public: 3800 },
  premium: { name: 'Premium', founding: 4500, public: 6500 },
} as const

export const RECURRING_PRICES = {
  care: { name: 'Care Plan', price: 149 },
  growth: { name: 'Growth Plan', price: 449 },
} as const

export function toCents(amount: number): number {
  return Math.round(amount * 100)
}

export function normalizeModuleQuantity(moduleId: string, quantity: number): number {
  const min = moduleId === 'service-page-expansion' ? 3 : 1
  const q = Number.isFinite(quantity) ? Math.floor(quantity) : min
  return Math.max(min, q)
}

export function normalizeModuleSelections(
  selectedModules: SelectedModuleInput[] | undefined,
): NormalizedModuleSelection[] {
  const seen = new Set<string>()
  const normalized: NormalizedModuleSelection[] = []

  for (const raw of selectedModules ?? []) {
    const offer = MODULE_PRICES[raw.module_id as keyof typeof MODULE_PRICES]
    if (!offer) continue
    if (seen.has(raw.module_id)) continue

    const quantity = normalizeModuleQuantity(raw.module_id, raw.quantity)
    const total_cents = offer.price * quantity

    normalized.push({
      module_id: raw.module_id,
      module_name: offer.name,
      quantity,
      unit_price_cents: toCents(offer.price),
      total_cents: toCents(total_cents),
    })
    seen.add(raw.module_id)
  }

  return normalized
}

export function calculateModulePricing(selectedModules: SelectedModuleInput[] | undefined) {
  const normalized = normalizeModuleSelections(selectedModules)
  const subtotalCents = normalized.reduce((sum, item) => sum + item.total_cents, 0)
  const discountCents =
    normalized.length >= BUNDLE_DISCOUNT_MIN_MODULES
      ? Math.round(subtotalCents * BUNDLE_DISCOUNT_RATE)
      : 0
  const totalCents = Math.max(0, subtotalCents - discountCents)

  return {
    normalized,
    subtotalCents,
    discountCents,
    totalCents,
  }
}

export function buildCheckoutPricing(input: {
  package_type: PackageType
  selected_audit?: AuditSelection
  selected_modules?: SelectedModuleInput[]
  selected_build?: BuildSelection
  selected_plan?: RecurringSelection
  currency: string
}): CheckoutPricingResult {
  const currency = input.currency.toLowerCase() || 'usd'

  if (input.package_type === 'audit') {
    const price = AUDIT_PRICES.fullAudit
    return {
      package_name: 'Full Website Audit',
      package_type: 'audit',
      subtotal_cents: toCents(price),
      discount_cents: 0,
      total_cents: toCents(price),
      charge_cents: toCents(price),
      recurring_amount_cents: null,
      line_items: [
        stripeLineItem(currency, 'Full Website Audit', toCents(price), 'A deeper review with a ranked action plan across visibility, trust, content, speed, and booking flow.'),
      ],
      selected_modules: [],
      summary: 'full-audit',
    }
  }

  if (input.package_type === 'modules') {
    const { normalized, subtotalCents, discountCents, totalCents } = calculateModulePricing(input.selected_modules)

    const details = normalized.map((m) => `${m.module_name}${m.quantity > 1 ? ` × ${m.quantity}` : ''}`).join(', ')
    return {
      package_name: 'Module bundle',
      package_type: 'modules',
      subtotal_cents: subtotalCents,
      discount_cents: discountCents,
      total_cents: totalCents,
      charge_cents: totalCents,
      recurring_amount_cents: null,
      line_items: [
        stripeLineItem(
          currency,
          'Module bundle',
          totalCents,
          details
            ? `Selected modules: ${details}. Bundle discount already applied server-side.`
            : 'Server-side calculated module bundle total.',
        ),
      ],
      selected_modules: normalized,
      summary: 'modules',
    }
  }

  if (input.package_type === 'build') {
    const build = input.selected_build ?? 'standard'
    const offer = BUILD_PRICES[build]
    const depositCents = Math.round(toCents(offer.founding) * 0.5)
    return {
      package_name: `${offer.name} build`,
      package_type: 'build',
      subtotal_cents: toCents(offer.founding),
      discount_cents: 0,
      total_cents: toCents(offer.founding),
      charge_cents: depositCents,
      recurring_amount_cents: null,
      line_items: [
        stripeLineItem(
          currency,
          `${offer.name} Build Deposit`,
          depositCents,
          `50% deposit on the ${offer.name} founding rate. Public rate: $${offer.public}.`,
        ),
      ],
      selected_modules: [],
      summary: build,
    }
  }

  const plan = input.selected_plan ?? 'care'
  const offer = RECURRING_PRICES[plan]
  return {
    package_name: offer.name,
    package_type: 'recurring',
    subtotal_cents: 0,
    discount_cents: 0,
    total_cents: 0,
    charge_cents: toCents(offer.price),
    recurring_amount_cents: toCents(offer.price),
    line_items: [
      stripeLineItem(
        currency,
        offer.name,
        toCents(offer.price),
        'First month of the recurring care or growth plan.',
        true,
      ),
    ],
    selected_modules: [],
    summary: plan,
  }
}

function stripeLineItem(
  currency: string,
  name: string,
  unitAmount: number,
  description?: string,
  recurring = false,
): StripeLineItem {
  return {
    quantity: 1,
    price_data: {
      currency,
      unit_amount: unitAmount,
      product_data: { name, description },
      ...(recurring ? { recurring: { interval: 'month' as const } } : {}),
    },
  }
}
