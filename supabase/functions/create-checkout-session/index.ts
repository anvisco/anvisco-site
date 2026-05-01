import { createClient } from 'npm:@supabase/supabase-js@2.105.1'
import {
  buildCheckoutPricing,
  type CheckoutPricingResult,
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
type CheckoutStep =
  | 'client_lookup'
  | 'clients_insert'
  | 'client_packages_select'
  | 'client_packages_insert'
  | 'module_selections_insert'
  | 'payment_schedules_insert'
  | 'client_packages_update'
  | 'payment_schedules_update'
  | 'stripe_session_create'

type CheckoutErrorCode =
  | 'missing_supabase_secret'
  | 'missing_supabase_url'
  | 'missing_stripe_secret'
  | 'missing_site_url'
  | 'invalid_payload'
  | 'invalid_package_type'
  | 'stripe_session_create_failed'
  | 'supabase_insert_failed'
  | 'supabase_update_failed'
  | 'unknown_error'

class CheckoutFailure extends Error {
  debug_code: CheckoutErrorCode
  step?: CheckoutStep

  constructor(message: string, debug_code: CheckoutErrorCode, step?: CheckoutStep) {
    super(message)
    this.name = 'CheckoutFailure'
    this.debug_code = debug_code
    this.step = step
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

function errorResponse(status: number, error: string, debug_code: CheckoutErrorCode, step?: CheckoutStep) {
  return jsonResponse({ error, debug_code, ...(step ? { step } : {}) }, status)
}

function safeCheckoutErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) return error.message.trim()
  if (typeof error === 'string' && error.trim()) return error.trim()
  return 'Unknown checkout error'
}

function logCheckoutError(error: unknown) {
  const stripeError =
    error && typeof error === 'object' ? (error as { type?: unknown; code?: unknown; param?: unknown; message?: unknown }) : null
  console.error('create-checkout-session failed', {
    message: safeCheckoutErrorMessage(error),
    stack: error instanceof Error ? error.stack : undefined,
    type: typeof stripeError?.type === 'string' ? stripeError.type : undefined,
    code: typeof stripeError?.code === 'string' ? stripeError.code : undefined,
    param: typeof stripeError?.param === 'string' ? stripeError.param : undefined,
    stripe_message: typeof stripeError?.message === 'string' ? stripeError.message : undefined,
  })
}

function logSupabaseFailure(step: CheckoutStep, error: unknown) {
  const supabaseError = error as {
    message?: unknown
    details?: unknown
    hint?: unknown
    code?: unknown
  }
  console.error('Supabase insert/update failed', {
    step,
    message: typeof supabaseError?.message === 'string' ? supabaseError.message : safeCheckoutErrorMessage(error),
    details: typeof supabaseError?.details === 'string' ? supabaseError.details : undefined,
    hint: typeof supabaseError?.hint === 'string' ? supabaseError.hint : undefined,
    code: typeof supabaseError?.code === 'string' ? supabaseError.code : undefined,
  })
}

function checkoutFailure(message: string, debug_code: CheckoutErrorCode, step?: CheckoutStep) {
  return new CheckoutFailure(message, debug_code, step)
}

function logStep(step: string, details?: Record<string, unknown>) {
  console.log('create-checkout-session', { step, ...(details ?? {}) })
}

function getRequiredEnv(name: string): string | null {
  const value = Deno.env.get(name)
  return value && value.trim() ? value.trim() : null
}

function safeCents(value: number | null | undefined): number {
  const n = typeof value === 'number' ? value : NaN
  return Number.isFinite(n) ? Math.round(n) : 0
}

function assertIntegerCents(name: string, value: number | null | undefined) {
  if (!Number.isInteger(value ?? NaN)) {
    throw checkoutFailure(`Invalid pricing for ${name}.`, 'invalid_payload')
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

Deno.serve(async (request) => {
  logStep('function started')

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  if (request.method === 'GET') {
    logStep('health check requested')
    return jsonResponse({
      ok: true,
      function: 'create-checkout-session',
      cors: true,
      jwt: 'disabled-required',
    })
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405)
  }

  let createdRecords: {
    clientId: string
    packageId: string
    createdClient: boolean
    createdPackage: boolean
  } | null = null
  let paymentScheduleId: string | null = null
  let createdPaymentSchedule = false
  let failureStep: CheckoutStep | undefined = undefined
  let failureCode: CheckoutErrorCode = 'unknown_error'

  try {
    logStep('method received', { method: request.method })

    const SUPABASE_URL = getRequiredEnv('SUPABASE_URL') ?? getRequiredEnv('ANVIS_SUPABASE_URL')
    const ANVIS_SUPABASE_SECRET_KEY = getRequiredEnv('ANVIS_SUPABASE_SECRET_KEY')
    const STRIPE_SECRET_KEY = getRequiredEnv('STRIPE_SECRET_KEY')
    const STRIPE_CURRENCY = getRequiredEnv('STRIPE_CURRENCY')
    const SITE_URL = getRequiredEnv('SITE_URL')

    logStep('loaded env vars')

    if (!SUPABASE_URL) {
      return errorResponse(500, 'Supabase URL function secret is missing.', 'missing_supabase_url')
    }

    if (!ANVIS_SUPABASE_SECRET_KEY) {
      return errorResponse(500, 'Supabase service secret is not configured.', 'missing_supabase_secret')
    }

    if (!STRIPE_SECRET_KEY) {
      return errorResponse(500, 'Stripe secret key is not configured.', 'missing_stripe_secret')
    }

    if (!STRIPE_CURRENCY) {
      return errorResponse(500, 'Stripe currency secret is not configured.', 'missing_stripe_secret')
    }

    if (!SITE_URL) {
      return errorResponse(500, 'SITE_URL function secret is missing.', 'missing_site_url')
    }

    const supabase = createClient(SUPABASE_URL, ANVIS_SUPABASE_SECRET_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    logStep('supabase client initialized')

    let payload: CheckoutPayload
    try {
      payload = (await request.json()) as CheckoutPayload
    } catch {
      return errorResponse(400, 'Invalid checkout selection.', 'invalid_payload')
    }
    logStep('parsed payload')

    if (!isPackageType(payload?.package_type)) {
      return errorResponse(400, 'Invalid checkout selection.', 'invalid_package_type')
    }
    logStep('validated package type', { package_type: payload.package_type })

    const successUrl = `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${SITE_URL}/checkout`

    const pricing = buildCheckoutPricing({
      package_type: payload.package_type,
      selected_audit: payload.selected_audit,
      selected_modules: payload.selected_modules,
      selected_build: payload.selected_build,
      selected_plan: payload.selected_plan,
      currency: STRIPE_CURRENCY.toLowerCase(),
    })
    logStep('calculated pricing', {
      package_type: payload.package_type,
      line_items: pricing.line_items.length,
      total_cents: pricing.total_cents,
      charge_cents: pricing.charge_cents,
    })

    if (payload.package_type === 'audit' && payload.selected_audit && payload.selected_audit !== 'full-audit') {
      return errorResponse(400, 'Invalid checkout selection.', 'invalid_payload')
    }

    if (payload.package_type === 'build' && payload.selected_build && !isBuildSelection(payload.selected_build)) {
      return errorResponse(400, 'Invalid checkout selection.', 'invalid_payload')
    }

    if (payload.package_type === 'recurring' && payload.selected_plan && !isRecurringSelection(payload.selected_plan)) {
      return errorResponse(400, 'Invalid checkout selection.', 'invalid_payload')
    }

    if (payload.package_type === 'modules' && pricing.selected_modules.length === 0) {
      return errorResponse(400, 'Invalid checkout selection.', 'invalid_payload')
    }

    let resolvedClientId = payload.client_id?.trim() || null
    if (payload.package_id) {
      failureStep = 'client_packages_select'
      const { data: existingPackage, error: existingPackageError } = await supabase
        .from('client_packages')
        .select('id, client_id')
        .eq('id', payload.package_id)
        .maybeSingle()

      if (existingPackageError) {
        logSupabaseFailure('client_packages_select', existingPackageError)
        throw checkoutFailure(
          existingPackageError.message || 'Supabase package lookup failed.',
          'supabase_insert_failed',
          'client_packages_select',
        )
      }
      if (!existingPackage) {
        return errorResponse(404, 'Invalid checkout selection.', 'invalid_payload')
      }
      if (resolvedClientId && existingPackage.client_id !== resolvedClientId) {
        return errorResponse(400, 'Invalid checkout selection.', 'invalid_payload')
      }
      resolvedClientId = existingPackage.client_id
    }

    createdRecords = {
      clientId: resolvedClientId ?? '',
      packageId: payload.package_id ?? '',
      createdClient: false,
      createdPackage: false,
    }

    failureStep = 'clients_insert'
    const clientId = resolvedClientId ?? (await createClientRow(supabase, payload, 'clients_insert'))
    createdRecords.clientId = clientId
    createdRecords.createdClient = !resolvedClientId
    logStep('client record ready')

    failureStep = 'client_packages_insert'
    const packageId = payload.package_id ?? (await createPackageRow(supabase, clientId, payload, pricing, 'client_packages_insert'))
    createdRecords.packageId = packageId
    createdRecords.createdPackage = !payload.package_id
    logStep('package record ready')

    if (payload.package_type === 'modules' && pricing.selected_modules.length > 0 && !payload.package_id) {
      failureStep = 'module_selections_insert'
      await insertModuleSelections(supabase, packageId, pricing.selected_modules, 'module_selections_insert')
      logStep('module selections inserted')
    }

    failureStep = 'payment_schedules_insert'
    paymentScheduleId = await createPaymentScheduleRow(
      supabase,
      clientId,
      packageId,
      payload.package_type,
      pricing,
      'payment_schedules_insert',
    )
    createdPaymentSchedule = true
    logStep('payment schedule ready')

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
    logStep('prepared line items', { count: pricing.line_items.length })

    logStep('creating Stripe session')
    const stripeRes = await stripeApi(STRIPE_SECRET_KEY, '/checkout/sessions', sessionParams)
    const stripeJson = await stripeRes.json()
    failureStep = 'stripe_session_create'
    failureCode = 'stripe_session_create_failed'
    if (!stripeRes.ok) {
      const stripeError =
        stripeJson && typeof stripeJson.error === 'object' && stripeJson.error
          ? (stripeJson.error as { type?: unknown; code?: unknown; message?: unknown; param?: unknown })
          : null
      console.error('create-checkout-session stripe error', {
        type: typeof stripeError?.type === 'string' ? stripeError.type : undefined,
        code: typeof stripeError?.code === 'string' ? stripeError.code : undefined,
        message: typeof stripeError?.message === 'string' ? stripeError.message : undefined,
        param: typeof stripeError?.param === 'string' ? stripeError.param : undefined,
      })
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
    logStep('Stripe session created', { session_id: sessionId })

    failureStep = 'client_packages_update'
    failureCode = 'supabase_update_failed'
    try {
      const { error: clientPackageUpdateError } = await supabase
        .from('client_packages')
        .update({ payment_url: sessionUrl })
        .eq('id', packageId)
      if (clientPackageUpdateError) {
        logSupabaseFailure('client_packages_update', clientPackageUpdateError)
      } else {
        logStep('supabase records updated', { table: 'client_packages' })
      }

      failureStep = 'payment_schedules_update'
      const { error: paymentScheduleUpdateError } = await supabase
        .from('payment_schedules')
        .update({
          payment_url: sessionUrl,
          stripe_session_id: sessionId,
          status: 'pending',
        })
        .eq('id', paymentScheduleId)
      if (paymentScheduleUpdateError) {
        logSupabaseFailure('payment_schedules_update', paymentScheduleUpdateError)
      } else {
        logStep('supabase records updated', { table: 'payment_schedules' })
      }
    } catch (updateError) {
      console.error('create-checkout-session supabase update failed', {
        message: safeCheckoutErrorMessage(updateError),
        stack: updateError instanceof Error ? updateError.stack : undefined,
      })
    }

    return jsonResponse({
      url: sessionUrl,
      session_id: sessionId,
      package_id: packageId,
      client_id: clientId,
    })
  } catch (error) {
    logCheckoutError(error)
    const SUPABASE_URL = getRequiredEnv('SUPABASE_URL') ?? getRequiredEnv('ANVIS_SUPABASE_URL')
    const ANVIS_SUPABASE_SECRET_KEY = getRequiredEnv('ANVIS_SUPABASE_SECRET_KEY')
    if (SUPABASE_URL && ANVIS_SUPABASE_SECRET_KEY && createdRecords) {
      const supabase = createClient(SUPABASE_URL, ANVIS_SUPABASE_SECRET_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
      try {
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
      } catch (cleanupError) {
        console.error('create-checkout-session cleanup failed', cleanupError)
      }
    }

    const failureMessage =
      error instanceof CheckoutFailure
        ? error.message
        : safeCheckoutErrorMessage(error)
    const debug_code =
      error instanceof CheckoutFailure ? error.debug_code : failureCode
    const step =
      error instanceof CheckoutFailure ? error.step ?? failureStep : failureStep
    return errorResponse(500, failureMessage, debug_code, step)
  }
})

async function createClientRow(
  supabase: ReturnType<typeof createClient>,
  payload: CheckoutPayload,
  step: CheckoutStep,
): Promise<string> {
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

  if (error || !data) {
    logSupabaseFailure(step, error ?? new Error('client_insert_failed'))
    throw checkoutFailure(
      (error as { message?: string } | null)?.message || 'Supabase client insert failed.',
      'supabase_insert_failed',
      step,
    )
  }
  return (data as DbClient).id
}

async function createPackageRow(
  supabase: ReturnType<typeof createClient>,
  clientId: string,
  payload: CheckoutPayload,
  pricing: ReturnType<typeof buildCheckoutPricing>,
  step: CheckoutStep,
): Promise<string> {
  assertIntegerCents('subtotal_cents', pricing.subtotal_cents)
  assertIntegerCents('discount_cents', pricing.discount_cents)
  assertIntegerCents('total_cents', pricing.total_cents)
  if (payload.package_type === 'recurring') {
    assertIntegerCents('recurring_amount_cents', pricing.recurring_amount_cents)
  }

  const recurringAmountCents =
    payload.package_type === 'recurring'
      ? safeCents(pricing.recurring_amount_cents)
      : 0

  const insertPayload = {
    client_id: clientId,
    package_type: payload.package_type,
    package_name: pricing.package_name,
    status: 'requested',
    subtotal_cents: safeCents(pricing.subtotal_cents),
    discount_cents: safeCents(pricing.discount_cents),
    total_cents: safeCents(pricing.total_cents),
    recurring_amount_cents: recurringAmountCents,
  }

  const { data, error } = await supabase
    .from('client_packages')
    .insert(insertPayload)
    .select('id')
    .single()

  if (error || !data) {
    logSupabaseFailure(step, error ?? new Error('package_insert_failed'))
    console.error('Supabase insert payload', {
      step,
      payload: insertPayload,
    })
    throw checkoutFailure(
      (error as { message?: string } | null)?.message || 'Supabase package insert failed.',
      'supabase_insert_failed',
      step,
    )
  }
  return (data as DbPackage).id
}

async function insertModuleSelections(
  supabase: ReturnType<typeof createClient>,
  packageId: string,
  selectedModules: { module_id: string; module_name: string; quantity: number; unit_price_cents: number; total_cents: number }[],
  step: CheckoutStep,
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
  if (error) {
    logSupabaseFailure(step, error)
    throw checkoutFailure(
      error.message || 'Supabase module selection insert failed.',
      'supabase_insert_failed',
      step,
    )
  }
}

async function createPaymentScheduleRow(
  supabase: ReturnType<typeof createClient>,
  clientId: string,
  packageId: string,
  packageType: PackageType,
  pricing: CheckoutPricingResult,
  step: CheckoutStep,
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

  if (error || !data) {
    logSupabaseFailure(step, error ?? new Error('payment_schedule_insert_failed'))
    throw checkoutFailure(
      (error as { message?: string } | null)?.message || 'Supabase payment schedule insert failed.',
      'supabase_insert_failed',
      step,
    )
  }
  return (data as DbPaymentSchedule).id
}
