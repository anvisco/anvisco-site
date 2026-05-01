import { createClient } from 'npm:@supabase/supabase-js@2.105.1'
import { type PackageType } from '../_shared/pricing.ts'

type StripeCheckoutSession = {
  id: string
  amount_total: number | null
  currency: string | null
  payment_status: string | null
  status: string | null
  metadata: Record<string, string | null | undefined> | null
}

type ClientPackage = {
  id: string
  client_id: string
  package_type: PackageType
  package_name: string
  status: string
  subtotal_cents: number
  discount_cents: number
  total_cents: number
  recurring_amount_cents: number | null
  next_payment_due_at: string | null
  payment_url: string | null
}

type ModuleSelection = {
  module_name: string
  quantity: number
  total_cents: number
}

type CheckoutSummaryResponse = {
  package_type: PackageType
  package_name: string
  amount_total_cents: number
  currency: string
  payment_status: string
  selected_modules: ModuleSelection[]
  next_steps: string[]
  portal_url: string
  support_email: string
}

type SummaryErrorCode =
  | 'missing_supabase_url'
  | 'missing_supabase_secret'
  | 'missing_stripe_secret'
  | 'invalid_payload'
  | 'stripe_session_retrieve_failed'
  | 'supabase_lookup_failed'
  | 'unknown_error'

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

function safeEnv(name: string): string | null {
  const value = Deno.env.get(name)
  return value && value.trim() ? value.trim() : null
}

function safeString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function safeCents(value: number | null | undefined): number {
  const n = typeof value === 'number' ? value : NaN
  return Number.isFinite(n) ? Math.round(n) : 0
}

function packageTypeFrom(value: unknown): PackageType | null {
  return value === 'audit' || value === 'modules' || value === 'build' || value === 'recurring'
    ? value
    : null
}

function stripeRequest(path: string, secretKey: string) {
  return fetch(`https://api.stripe.com/v1${path}`, {
    headers: {
      authorization: `Bearer ${secretKey}`,
    },
  })
}

function summaryError(status: number, error: string, debug_code: SummaryErrorCode) {
  return jsonResponse({ error, debug_code }, status)
}

function nextStepsFor(packageType: PackageType, moduleCount: number): string[] {
  switch (packageType) {
    case 'audit':
      return [
        'You will receive audit onboarding details.',
        'Your website, goals, and current issues will be reviewed.',
        'You will receive a ranked action plan.',
        'If you move into a module or build within 30 days, the audit fee can be applied to that project.',
      ]
    case 'modules':
      return [
        'Your selected modules will be reviewed.',
        'Any missing access or content requirements will be confirmed.',
        'A project stage will be created in your client portal.',
        'You will receive updates as the work moves forward.',
      ]
    case 'build':
      return [
        'Your build tier will be reviewed.',
        'Onboarding details will be sent.',
        'Your project stage will be added to the client portal.',
        'You will receive updates as the build progresses.',
      ]
    case 'recurring':
      return [
        'Your care plan will be connected to your client profile.',
        'Your next payment date will appear in the portal.',
        'Ongoing updates and recommendations will be posted there.',
      ]
    default:
      return moduleCount > 0
        ? ['Your selected modules will be reviewed.', 'You will receive next-step instructions soon.']
        : ['Brian will follow up with next steps.']
  }
}

function packageNameFallback(packageType: PackageType, metadata: Record<string, string | null | undefined>) {
  const selectedBuild = safeString(metadata.selected_build)
  const selectedPlan = safeString(metadata.selected_plan)

  if (packageType === 'audit') return 'Full Website Audit'
  if (packageType === 'modules') return 'Website Improvement Modules'
  if (packageType === 'build') {
    const tier = selectedBuild ? `${selectedBuild[0].toUpperCase()}${selectedBuild.slice(1)}` : 'Website'
    return `${tier} Build`
  }
  if (packageType === 'recurring') {
    const plan = selectedPlan ? `${selectedPlan[0].toUpperCase()}${selectedPlan.slice(1)}` : 'Care'
    return `${plan} Plan`
  }
  return 'Client checkout'
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (request.method === 'GET') {
    return jsonResponse({ ok: true, function: 'checkout-session-summary' })
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405)
  }

  try {
    const SUPABASE_URL = safeEnv('SUPABASE_URL') ?? safeEnv('ANVIS_SUPABASE_URL')
    const ANVIS_SUPABASE_SECRET_KEY = safeEnv('ANVIS_SUPABASE_SECRET_KEY')
    const STRIPE_SECRET_KEY = safeEnv('STRIPE_SECRET_KEY')

    if (!SUPABASE_URL) {
      return summaryError(500, 'Supabase URL function secret is missing.', 'missing_supabase_url')
    }
    if (!ANVIS_SUPABASE_SECRET_KEY) {
      return summaryError(500, 'Supabase service secret is not configured.', 'missing_supabase_secret')
    }
    if (!STRIPE_SECRET_KEY) {
      return summaryError(500, 'Stripe secret key is not configured.', 'missing_stripe_secret')
    }

    let body: { session_id?: unknown }
    try {
      body = await request.json()
    } catch {
      return summaryError(400, 'Invalid checkout session request.', 'invalid_payload')
    }

    const sessionId = safeString(body.session_id)
    if (!sessionId) {
      return summaryError(400, 'Invalid checkout session request.', 'invalid_payload')
    }

    const stripeResponse = await stripeRequest(`/checkout/sessions/${encodeURIComponent(sessionId)}`, STRIPE_SECRET_KEY)
    const stripeJson = await stripeResponse.json().catch(() => null)
    if (!stripeResponse.ok || !stripeJson) {
      console.error('checkout-session-summary stripe error', {
        status: stripeResponse.status,
        error:
          stripeJson && typeof stripeJson === 'object' && 'error' in stripeJson
            ? (stripeJson as { error?: unknown }).error
            : undefined,
      })
      return summaryError(500, 'Could not load checkout summary.', 'stripe_session_retrieve_failed')
    }
    const stripeSession = stripeJson as StripeCheckoutSession
    const metadata = stripeSession.metadata ?? {}
    const packageId = safeString(metadata.package_id)
    const paymentScheduleId = safeString(metadata.payment_schedule_id)
    const packageTypeMetadata = packageTypeFrom(metadata.package_type) ?? packageTypeFrom(metadata.selected_path)

    const supabase = createClient(SUPABASE_URL, ANVIS_SUPABASE_SECRET_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    let packageRow: ClientPackage | null = null
    if (packageId) {
      const { data, error } = await supabase
        .from('client_packages')
        .select(
          'id, client_id, package_type, package_name, status, subtotal_cents, discount_cents, total_cents, recurring_amount_cents, next_payment_due_at, payment_url',
        )
        .eq('id', packageId)
        .maybeSingle()

      if (error) {
        console.error('checkout-session-summary package lookup failed', {
          step: 'client_packages_select',
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        return summaryError(500, 'Could not load checkout summary.', 'supabase_lookup_failed')
      }
      packageRow = (data as ClientPackage | null) ?? null
    }

    const packageType = packageTypeMetadata ?? packageRow?.package_type ?? 'audit'
    const packageName = packageRow?.package_name ?? packageNameFallback(packageType, metadata)

    let selectedModules: ModuleSelection[] = []
    if (packageType === 'modules' && packageId) {
      const { data, error } = await supabase
        .from('client_module_selections')
        .select('module_name, quantity, total_cents')
        .eq('package_id', packageId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('checkout-session-summary module lookup failed', {
          step: 'module_selections_select',
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        return summaryError(500, 'Could not load checkout summary.', 'supabase_lookup_failed')
      }

      selectedModules = ((data as ModuleSelection[]) ?? []).map((item) => ({
        module_name: item.module_name,
        quantity: item.quantity,
        total_cents: safeCents(item.total_cents),
      }))
    }

    if (paymentScheduleId) {
      const { error } = await supabase
        .from('payment_schedules')
        .select('id')
        .eq('id', paymentScheduleId)
        .maybeSingle()

      if (error) {
        console.error('checkout-session-summary payment schedule lookup failed', {
          step: 'payment_schedules_select',
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        return summaryError(500, 'Could not load checkout summary.', 'supabase_lookup_failed')
      }
    }

    const amountTotalCents = safeCents(
      stripeSession.amount_total ?? packageRow?.total_cents ?? packageRow?.recurring_amount_cents ?? 0,
    )
    const paymentStatus =
      safeString(stripeSession.payment_status) ??
      (safeString(stripeSession.status) === 'complete' ? 'paid' : 'unknown')
    const currency = safeString(stripeSession.currency)?.toUpperCase() ?? 'CAD'

    const summary: CheckoutSummaryResponse = {
      package_type: packageType,
      package_name: packageName,
      amount_total_cents: amountTotalCents,
      currency,
      payment_status: paymentStatus,
      selected_modules: selectedModules,
      next_steps: nextStepsFor(packageType, selectedModules.length),
      portal_url: '/portal',
      support_email: 'brian@anvisco.com',
    }

    return jsonResponse(summary)
  } catch (error) {
    console.error('checkout-session-summary error', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return summaryError(500, 'Could not load checkout summary.', 'unknown_error')
  }
})
