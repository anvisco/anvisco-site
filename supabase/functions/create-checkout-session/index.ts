import { createClient } from 'npm:@supabase/supabase-js@2.105.1'
import {
  buildCheckoutPricing,
  type AuditSelection,
  type BuildSelection,
  type PackageType,
  type RecurringSelection,
  type SelectedModuleInput,
} from '../_shared/pricing.ts'

type CheckoutPayload = {
  package_type: PackageType
  selected_audit?: AuditSelection
  selected_modules?: SelectedModuleInput[]
  selected_build?: BuildSelection
  selected_plan?: RecurringSelection
  client_id?: string
  package_id?: string
  email?: string
  name?: string
  business_name?: string
  phone?: string
  website_url?: string
  notes?: string
  success_url?: string
  cancel_url?: string
}

type DbClient = { id: string }
type DbPackage = { id: string; client_id: string }
type DbPaymentSchedule = { id: string }

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

function getRequiredEnv(name: string): string | null {
  const value = Deno.env.get(name)
  return value && value.trim() ? value.trim() : null
}

function safeUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : null
  } catch {
    return null
  }
}

const VALID_PACKAGE_TYPES: PackageType[] = ['audit', 'modules', 'build', 'recurring']
const VALID_BUILD_SELECTIONS: BuildSelection[] = ['essentials', 'standard', 'premium']
const VALID_RECURRING_SELECTIONS: RecurringSelection[] = ['care', 'growth']

function isPackageType(value: unknown): value is PackageType {
  return typeof value === 'string' && VALID_PACKAGE_TYPES.includes(value as PackageType)
}

function isBuildSelection(value: unknown): value is BuildSelection {
  return typeof value === 'string' && VALID_BUILD_SELECTIONS.includes(value as BuildSelection)
}

function isRecurringSelection(value: unknown): value is RecurringSelection {
  return typeof value === 'string' && VALID_RECURRING_SELECTIONS.includes(value as RecurringSelection)
}

function appendLineItem(
  params: URLSearchParams,
  index: number,
  item: {
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
  },
) {
  params.append(`line_items[${index}][quantity]`, String(item.quantity))
  params.append(`line_items[${index}][price_data][currency]`, item.price_data.currency)
  params.append(
    `line_items[${index}][price_data][unit_amount]`,
    String(item.price_data.unit_amount),
  )
  params.append(`line_items[${index}][price_data][product_data][name]`, item.price_data.product_data.name)
  if (item.price_data.product_data.description) {
    params.append(
      `line_items[${index}][price_data][product_data][description]`,
      item.price_data.product_data.description,
    )
  }
  if (item.price_data.recurring) {
    params.append(
      `line_items[${index}][price_data][recurring][interval]`,
      item.price_data.recurring.interval,
    )
  }
}

async function stripeApi(
  secretKey: string,
  path: string,
  params: URLSearchParams,
): Promise<{ ok: boolean; status: number; json: () => Promise<Record<string, unknown>> }> {
  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${secretKey}`,
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  return {
    ok: response.ok,
    status: response.status,
    json: async () => (await response.json()) as Record<string, unknown>,
  }
}

const SUPABASE_URL = getRequiredEnv('SUPABASE_URL')
const ANVIS_SUPABASE_SECRET_KEY = getRequiredEnv('ANVIS_SUPABASE_SECRET_KEY')
const STRIPE_SECRET_KEY = getRequiredEnv('STRIPE_SECRET_KEY')
const STRIPE_CURRENCY = (getRequiredEnv('STRIPE_CURRENCY') ?? 'usd').toLowerCase()

if (!SUPABASE_URL || !ANVIS_SUPABASE_SECRET_KEY) {
  console.warn('Missing Supabase service credentials for Stripe checkout function.')
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return json(405, { error: 'Method not allowed.' })
  }

  if (!SUPABASE_URL || !ANVIS_SUPABASE_SECRET_KEY) {
    return json(500, { error: 'Supabase service role secret is not configured.' })
  }

  if (!STRIPE_SECRET_KEY) {
    return json(500, { error: 'Stripe secret key is not configured.' })
  }

  const supabase = createClient(SUPABASE_URL, ANVIS_SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  let payload: CheckoutPayload
  try {
    payload = (await request.json()) as CheckoutPayload
  } catch {
    return json(400, { error: 'Invalid JSON body.' })
  }

  if (!isPackageType(payload?.package_type)) {
    return json(400, { error: 'package_type is required.' })
  }

  const successUrl = safeUrl(payload.success_url)
  const cancelUrl = safeUrl(payload.cancel_url)
  if (!successUrl || !cancelUrl) {
    return json(400, { error: 'success_url and cancel_url must be valid http(s) URLs.' })
  }

  const pricing = buildCheckoutPricing({
    package_type: payload.package_type,
    selected_audit: payload.selected_audit,
    selected_modules: payload.selected_modules,
    selected_build: payload.selected_build,
    selected_plan: payload.selected_plan,
    currency: STRIPE_CURRENCY,
  })

  if (payload.package_type === 'audit' && payload.selected_audit && payload.selected_audit !== 'full-audit') {
    return json(400, { error: 'Only the full audit can be sent to Stripe.' })
  }

  if (payload.package_type === 'build' && payload.selected_build && !isBuildSelection(payload.selected_build)) {
    return json(400, { error: 'selected_build is invalid.' })
  }

  if (payload.package_type === 'recurring' && payload.selected_plan && !isRecurringSelection(payload.selected_plan)) {
    return json(400, { error: 'selected_plan is invalid.' })
  }

  if (payload.package_type === 'modules' && pricing.selected_modules.length === 0) {
    return json(400, { error: 'At least one valid module is required.' })
  }

  let resolvedClientId = payload.client_id?.trim() || null
  if (payload.package_id) {
    const { data: existingPackage, error: existingPackageError } = await supabase
      .from('client_packages')
      .select('id, client_id')
      .eq('id', payload.package_id)
      .maybeSingle()

    if (existingPackageError) {
      throw existingPackageError
    }
    if (!existingPackage) {
      return json(404, { error: 'package_id was not found.' })
    }
    if (resolvedClientId && existingPackage.client_id !== resolvedClientId) {
      return json(400, { error: 'package_id does not belong to the provided client_id.' })
    }
    resolvedClientId = existingPackage.client_id
  }

  const createdRecords = { clientId: resolvedClientId ?? '', packageId: payload.package_id ?? '', createdClient: false, createdPackage: false }
  let paymentScheduleId: string | null = null
  let createdPaymentSchedule = false

  try {
    const clientId = resolvedClientId ?? (await createClientRow(supabase, payload))
    createdRecords.clientId = clientId
    createdRecords.createdClient = !resolvedClientId

    const packageId = payload.package_id ?? (await createPackageRow(supabase, clientId, payload, pricing))
    createdRecords.packageId = packageId
    createdRecords.createdPackage = !payload.package_id

    if (payload.package_type === 'modules' && pricing.selected_modules.length > 0 && !payload.package_id) {
      await insertModuleSelections(supabase, packageId, pricing.selected_modules)
    }

    paymentScheduleId = await createPaymentScheduleRow(
      supabase,
      clientId,
      packageId,
      payload.package_type,
      pricing,
    )
    createdPaymentSchedule = true

    const sessionParams = new URLSearchParams()
    sessionParams.set('mode', payload.package_type === 'recurring' ? 'subscription' : 'payment')
    sessionParams.set('success_url', successUrl)
    sessionParams.set('cancel_url', cancelUrl)
    if (payload.email?.trim()) {
      sessionParams.set('customer_email', payload.email.trim().toLowerCase())
    }
    sessionParams.set('client_reference_id', clientId)
    sessionParams.set('metadata[client_id]', clientId)
    sessionParams.set('metadata[package_id]', packageId)
    sessionParams.set('metadata[payment_schedule_id]', paymentScheduleId)
    sessionParams.set('metadata[package_type]', payload.package_type)
    sessionParams.set('metadata[selected_path]', payload.package_type)
    sessionParams.set('metadata[source]', 'anvis-plan-builder')
    sessionParams.set('metadata[selected_audit]', payload.selected_audit ?? '')
    sessionParams.set('metadata[selected_build]', payload.selected_build ?? '')
    sessionParams.set('metadata[selected_plan]', payload.selected_plan ?? '')
    sessionParams.set(
      'metadata[selected_modules]',
      JSON.stringify(pricing.selected_modules.map((item) => ({ module_id: item.module_id, quantity: item.quantity }))),
    )

    if (payload.package_type === 'recurring') {
      sessionParams.set('subscription_data[metadata][client_id]', clientId)
      sessionParams.set('subscription_data[metadata][package_id]', packageId)
      sessionParams.set('subscription_data[metadata][package_type]', payload.package_type)
      sessionParams.set('subscription_data[metadata][selected_path]', payload.package_type)
      sessionParams.set('subscription_data[metadata][source]', 'anvis-plan-builder')
    } else {
      sessionParams.set('payment_intent_data[metadata][client_id]', clientId)
      sessionParams.set('payment_intent_data[metadata][package_id]', packageId)
      sessionParams.set('payment_intent_data[metadata][package_type]', payload.package_type)
      sessionParams.set('payment_intent_data[metadata][selected_path]', payload.package_type)
      sessionParams.set('payment_intent_data[metadata][source]', 'anvis-plan-builder')
    }

    pricing.line_items.forEach((item, index) => appendLineItem(sessionParams, index, item))

    const stripeRes = await stripeApi(STRIPE_SECRET_KEY, '/checkout/sessions', sessionParams)
    const stripeJson = await stripeRes.json()
    if (!stripeRes.ok) {
      throw new Error(
        typeof stripeJson.error === 'object' && stripeJson.error && 'message' in stripeJson.error
          ? String((stripeJson.error as { message?: unknown }).message ?? 'Stripe request failed')
          : 'Stripe request failed',
      )
    }

    const sessionUrl = typeof stripeJson.url === 'string' ? stripeJson.url : null
    const sessionId = typeof stripeJson.id === 'string' ? stripeJson.id : null
    if (!sessionUrl || !sessionId) {
      throw new Error('Stripe session response was incomplete.')
    }

    await supabase
      .from('client_packages')
      .update({ payment_url: sessionUrl })
      .eq('id', packageId)

    await supabase
      .from('payment_schedules')
      .update({
        payment_url: sessionUrl,
        stripe_session_id: sessionId,
        status: 'pending',
      })
      .eq('id', paymentScheduleId)

    return json(200, {
      url: sessionUrl,
      session_id: sessionId,
      package_id: packageId,
      client_id: clientId,
    })
  } catch (error) {
    if (createdRecords.createdPackage && createdRecords.packageId) {
      await supabase.from('client_module_selections').delete().eq('package_id', createdRecords.packageId)
      await supabase.from('payment_schedules').delete().eq('package_id', createdRecords.packageId)
    }
    if (createdPaymentSchedule && paymentScheduleId) {
      await supabase.from('payment_schedules').delete().eq('id', paymentScheduleId)
    }
    if (createdRecords.createdPackage && createdRecords.packageId) {
      await supabase.from('client_packages').delete().eq('id', createdRecords.packageId)
    }
    if (createdRecords.createdClient && createdRecords.clientId) {
      await supabase.from('clients').delete().eq('id', createdRecords.clientId)
    }

    return json(400, {
      error: error instanceof Error ? error.message : 'Could not create Stripe Checkout session.',
    })
  }
}

async function createClientRow(supabase: ReturnType<typeof createClient>, payload: CheckoutPayload): Promise<string> {
  const name = payload.name?.trim()
  const email = payload.email?.trim().toLowerCase()
  if (!name) throw new Error('name is required.')
  if (!email) throw new Error('email is required.')

  const { data, error } = await supabase
    .from('clients')
    .insert({
      name,
      business_name: payload.business_name?.trim() || null,
      email,
      phone: payload.phone?.trim() || null,
      website_url: payload.website_url?.trim() || null,
      status: 'lead',
      notes: payload.notes?.trim() || null,
    })
    .select('id')
    .single()

  if (error || !data) throw error ?? new Error('client_insert_failed')
  return (data as DbClient).id
}

async function createPackageRow(
  supabase: ReturnType<typeof createClient>,
  clientId: string,
  payload: CheckoutPayload,
  pricing: ReturnType<typeof buildCheckoutPricing>,
): Promise<string> {
  const { data, error } = await supabase
    .from('client_packages')
    .insert({
      client_id: clientId,
      package_type: payload.package_type,
      package_name: pricing.package_name,
      status: 'requested',
      subtotal_cents: pricing.subtotal_cents,
      discount_cents: pricing.discount_cents,
      total_cents: pricing.total_cents,
      recurring_amount_cents: pricing.recurring_amount_cents,
    })
    .select('id')
    .single()

  if (error || !data) throw error ?? new Error('package_insert_failed')
  return (data as DbPackage).id
}

async function insertModuleSelections(
  supabase: ReturnType<typeof createClient>,
  packageId: string,
  selectedModules: { module_id: string; module_name: string; quantity: number; unit_price_cents: number; total_cents: number }[],
) {
  const rows = selectedModules.map((module) => ({
    package_id: packageId,
    module_id: module.module_id,
    module_name: module.module_name,
    quantity: module.quantity,
    unit_price_cents: module.unit_price_cents,
    total_cents: module.total_cents,
  }))

  const { error } = await supabase.from('client_module_selections').insert(rows)
  if (error) throw error
}

async function createPaymentScheduleRow(
  supabase: ReturnType<typeof createClient>,
  clientId: string,
  packageId: string,
  packageType: PackageType,
  pricing: CheckoutPricingResult,
): Promise<string> {
  const label =
    packageType === 'audit'
      ? 'Audit fee'
      : packageType === 'modules'
        ? 'Module bundle'
        : packageType === 'build'
          ? 'Deposit (50%)'
          : 'Subscription payment'

  const amountCents =
    packageType === 'build'
      ? pricing.charge_cents
      : packageType === 'recurring'
        ? pricing.charge_cents
        : pricing.total_cents

  const { data, error } = await supabase
    .from('payment_schedules')
    .insert({
      client_id: clientId,
      package_id: packageId,
      label,
      amount_cents: amountCents,
      due_date: new Date().toISOString().slice(0, 10),
      status: 'pending',
    })
    .select('id')
    .single()

  if (error || !data) throw error ?? new Error('payment_schedule_insert_failed')
  return (data as DbPaymentSchedule).id
}
