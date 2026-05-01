import {
  BUNDLE_DISCOUNT_MIN_MODULES,
  BUNDLE_DISCOUNT_RATE,
  getModuleOffer,
  type ModuleId,
} from '@/data/offers'

const cadFormatter = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  maximumFractionDigits: 0,
})

/** Format a dollar amount for display. */
export function formatCurrency(amount: number): string {
  return cadFormatter.format(Math.max(0, Math.round(amount)))
}

/** A single module the user has selected, with the chosen quantity. */
export interface SelectedModule {
  id: ModuleId | string
  quantity: number
}

/**
 * Clamp a quantity to the module's minimum (and at least 1).
 * Service Page Expansion has minQuantity=3, so picking it always
 * costs at least 3 pages.
 */
export function normalizeModuleQuantity(
  moduleId: ModuleId | string,
  quantity: number,
): number {
  const offer = getModuleOffer(moduleId)
  const min = Math.max(1, offer?.minQuantity ?? 1)
  const q = Number.isFinite(quantity) ? Math.floor(quantity) : min
  return Math.max(min, q)
}

/** Subtotal for a single line (price * normalized quantity). */
export function calculateModuleLineTotal(
  moduleId: ModuleId | string,
  quantity: number,
): number {
  const offer = getModuleOffer(moduleId)
  if (!offer) return 0
  const q = normalizeModuleQuantity(moduleId, quantity)
  return offer.price * q
}

/** Subtotal across every selected module, before any bundle discount. */
export function calculateModuleSubtotal(
  selectedModules: SelectedModule[],
): number {
  return selectedModules.reduce(
    (sum, m) => sum + calculateModuleLineTotal(m.id, m.quantity),
    0,
  )
}

/** True when 3+ distinct modules are selected. */
export function hasBundleDiscount(selectedModules: SelectedModule[]): boolean {
  return selectedModules.length >= BUNDLE_DISCOUNT_MIN_MODULES
}

/** 15% off the module subtotal, rounded. Zero if not eligible. */
export function calculateBundleDiscount(
  selectedModules: SelectedModule[],
): number {
  if (!hasBundleDiscount(selectedModules)) return 0
  const subtotal = calculateModuleSubtotal(selectedModules)
  return Math.round(subtotal * BUNDLE_DISCOUNT_RATE)
}

/** Final module total after bundle discount. */
export function calculateModuleTotal(
  selectedModules: SelectedModule[],
): number {
  return (
    calculateModuleSubtotal(selectedModules) -
    calculateBundleDiscount(selectedModules)
  )
}

/** Helper for storage: dollars -> cents. */
export function toCents(dollars: number): number {
  return Math.round(dollars * 100)
}
