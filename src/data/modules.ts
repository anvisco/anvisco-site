import { MODULE_OFFERS } from '@/data/offers'
import { formatCurrency } from '@/lib/pricing'

/**
 * Marketing-facing module list. Derived from src/data/offers.ts so
 * pricing stays in one place. Marketing pages display the "Starting at"
 * label; the /checkout flow uses the canonical offers directly.
 */
export interface Module {
  id: string
  name: string
  description: string
  startingAt: string
  startingAtValue: number
}

export const modules: Module[] = MODULE_OFFERS.map((offer) => ({
  id: offer.id,
  name: offer.name,
  description: offer.description,
  startingAt: offer.unit
    ? `${formatCurrency(offer.price)} ${offer.unit}`
    : formatCurrency(offer.price),
  startingAtValue: offer.price,
}))
