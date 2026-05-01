import { createClient } from 'npm:@supabase/supabase-js@2.105.1'

type StripeEvent = {
  id: string
  type: string
  data: {
    object: Record<string, unknown>
  }
}

type StripeObject = Record<string, unknown>

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')?.trim() ?? ''
const ANVIS_SUPABASE_SECRET_KEY = Deno.env.get('ANVIS_SUPABASE_SECRET_KEY')?.trim() ?? ''
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')?.trim() ?? ''
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')?.trim() ?? ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
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

function getString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function getMetadata(obj: StripeObject): Record<string, string> {
  const metadata = obj.metadata
  if (!metadata || typeof metadata !== 'object') return {}
  return Object.fromEntries(
    Object.entries(metadata).filter(([, value]) => typeof value === 'string') as [string, string][],
  )
}

function toDateStringFromUnix(value: unknown): string | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null
  return new Date(value * 1000).toISOString().slice(0, 10)
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let out = 0
  for (let i = 0; i < a.length; i += 1) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return out === 0
}

async function verifyStripeSignature(rawBody: string, signatureHeader: string, secret: string) {
  const parts = signatureHeader.split(',').reduce<Record<string, string[]>>((acc, segment) => {
    const [key, value] = segment.split('=')
    if (!key || !value) return acc
    acc[key] = acc[key] ?? []
    acc[key].push(value)
    return acc
  }, {})

  const timestamp = parts.t?.[0]
  const signatures = parts.v1 ?? []
  if (!timestamp || signatures.length === 0) return false

  const timestampNum = Number(timestamp)
  if (!Number.isFinite(timestampNum)) return false
  const ageSeconds = Math.abs(Math.floor(Date.now() / 1000) - timestampNum)
  if (ageSeconds > 300) return false

  const signedPayload = `${timestamp}.${rawBody}`
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedPayload))
  const expected = Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, '0')).join('')
  return signatures.some((sig) => timingSafeEqualHex(sig, expected))
}

async function stripeGet(path: string) {
  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    headers: { authorization: `Bearer ${STRIPE_SECRET_KEY}` },
  })
  if (!response.ok) {
    throw new Error(`Stripe GET ${path} failed with status ${response.status}`)
  }
  return (await response.json()) as StripeObject
}

async function markEventProcessed(
  supabase: ReturnType<typeof createClient>,
  event: StripeEvent,
): Promise<boolean> {
  const { error } = await supabase.from('stripe_events').insert({
    id: event.id,
    type: event.type,
  })
  if (!error) return true
  if ((error as { code?: string }).code === '23505') return false
  throw error
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  if (request.method !== 'POST') {
    return json(405, { error: 'Method not allowed.' })
  }

  if (!SUPABASE_URL || !ANVIS_SUPABASE_SECRET_KEY || !STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return json(500, { error: 'Stripe webhook environment is not configured.' })
  }

  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return json(400, { error: 'Missing Stripe signature header.' })
  }

  const verified = await verifyStripeSignature(rawBody, signature, STRIPE_WEBHOOK_SECRET)
  if (!verified) {
    return json(400, { error: 'Invalid Stripe signature.' })
  }

  let event: StripeEvent
  try {
    event = JSON.parse(rawBody) as StripeEvent
  } catch {
    return json(400, { error: 'Invalid Stripe event payload.' })
  }

  const supabase = createClient(SUPABASE_URL, ANVIS_SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const shouldProcess = await markEventProcessed(supabase, event)
  if (!shouldProcess) {
    return json(200, { received: true, duplicate: true })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(supabase, event.data.object)
        break
      case 'invoice.paid':
        await handleInvoicePaid(supabase, event.data.object)
        break
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(supabase, event.data.object)
        break
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(supabase, event.data.object)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(supabase, event.data.object)
        break
      default:
        break
    }
  } catch (error) {
    console.error('Stripe webhook handler failed', error)
    return json(500, {
      error: error instanceof Error ? error.message : 'Webhook handler failed.',
    })
  }

  return json(200, { received: true })
}

async function handleCheckoutSessionCompleted(
  supabase: ReturnType<typeof createClient>,
  session: StripeObject,
) {
  const metadata = getMetadata(session)
  const packageId = getString(metadata.package_id)
  const paymentScheduleId = getString(metadata.payment_schedule_id)
  const clientId = getString(metadata.client_id)
  if (!packageId || !clientId) return

  const sessionCustomer = getString(session.customer)
  const sessionSubscription = getString(session.subscription)
  const sessionPaymentIntent = getString(session.payment_intent)
  const subscription = sessionSubscription ? await stripeGet(`/subscriptions/${sessionSubscription}`) : null
  const subscriptionPeriodEnd = subscription ? toDateStringFromUnix(subscription.current_period_end) : null

  const schedule = paymentScheduleId
    ? { id: paymentScheduleId }
    : await findLatestPaymentSchedule(supabase, packageId)

  if (schedule) {
    await supabase
      .from('payment_schedules')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        stripe_payment_intent_id: sessionPaymentIntent,
        stripe_invoice_id: getString(session.invoice),
      })
      .eq('id', schedule.id)
  }

  const update: Record<string, unknown> = {
    status: 'active',
    stripe_customer_id: sessionCustomer,
    stripe_subscription_id: sessionSubscription,
  }
  if (subscriptionPeriodEnd) {
    update.next_payment_due_at = subscriptionPeriodEnd
  }
  await supabase.from('client_packages').update(update).eq('id', packageId)
}

async function handleInvoicePaid(
  supabase: ReturnType<typeof createClient>,
  invoice: StripeObject,
) {
  const subscriptionId = getString(invoice.subscription)
  const invoiceId = getString(invoice.id)
  if (!subscriptionId) return

  const packageRow = await findPackageBySubscription(supabase, subscriptionId)
  if (!packageRow) return

  const subscription = await stripeGet(`/subscriptions/${subscriptionId}`)
  const nextDueDate = toDateStringFromUnix(subscription.current_period_end)

  const schedule = await findLatestPaymentSchedule(supabase, packageRow.id)
  if (schedule) {
    await supabase
      .from('payment_schedules')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        stripe_invoice_id: invoiceId,
        stripe_payment_intent_id: getString(invoice.payment_intent),
      })
      .eq('id', schedule.id)
  }

  await supabase
    .from('client_packages')
    .update({
      status: 'active',
      stripe_customer_id: getString(invoice.customer) ?? packageRow.stripe_customer_id,
      stripe_subscription_id: subscriptionId,
      next_payment_due_at: nextDueDate,
    })
    .eq('id', packageRow.id)
}

async function handleInvoicePaymentFailed(
  supabase: ReturnType<typeof createClient>,
  invoice: StripeObject,
) {
  const subscriptionId = getString(invoice.subscription)
  if (!subscriptionId) return

  const packageRow = await findPackageBySubscription(supabase, subscriptionId)
  if (!packageRow) return

  const schedule = await findLatestPaymentSchedule(supabase, packageRow.id)
  if (schedule) {
    await supabase
      .from('payment_schedules')
      .update({ status: 'overdue', stripe_invoice_id: getString(invoice.id) })
      .eq('id', schedule.id)
  }
}

async function handleSubscriptionUpdated(
  supabase: ReturnType<typeof createClient>,
  subscription: StripeObject,
) {
  const subscriptionId = getString(subscription.id)
  const customerId = getString(subscription.customer)
  if (!subscriptionId) return

  const packageRow = await findPackageBySubscription(supabase, subscriptionId)
  if (!packageRow) return

  const status = getString(subscription.status)
  const update: Record<string, unknown> = {
    stripe_customer_id: customerId ?? packageRow.stripe_customer_id,
    stripe_subscription_id: subscriptionId,
  }

  const nextDueDate = toDateStringFromUnix(subscription.current_period_end)
  if (nextDueDate) update.next_payment_due_at = nextDueDate

  if (status === 'canceled' || status === 'unpaid') {
    update.status = 'cancelled'
  } else {
    update.status = 'active'
  }

  await supabase.from('client_packages').update(update).eq('id', packageRow.id)
}

async function handleSubscriptionDeleted(
  supabase: ReturnType<typeof createClient>,
  subscription: StripeObject,
) {
  const subscriptionId = getString(subscription.id)
  if (!subscriptionId) return

  const packageRow = await findPackageBySubscription(supabase, subscriptionId)
  if (!packageRow) return

  await supabase
    .from('client_packages')
    .update({ status: 'cancelled', stripe_subscription_id: subscriptionId })
    .eq('id', packageRow.id)
}

async function findPackageBySubscription(
  supabase: ReturnType<typeof createClient>,
  subscriptionId: string,
) {
  const { data, error } = await supabase
    .from('client_packages')
    .select('id, stripe_customer_id, stripe_subscription_id')
    .eq('stripe_subscription_id', subscriptionId)
    .maybeSingle()

  if (error) throw error
  return data as { id: string; stripe_customer_id: string | null; stripe_subscription_id: string | null } | null
}

async function findLatestPaymentSchedule(
  supabase: ReturnType<typeof createClient>,
  packageId: string,
) {
  const { data, error } = await supabase
    .from('payment_schedules')
    .select('id')
    .eq('package_id', packageId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data as { id: string } | null
}
