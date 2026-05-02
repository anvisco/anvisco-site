import { createClient } from 'npm:@supabase/supabase-js@2.105.1'

type ClientUserRow = {
  client_id: string
  user_id: string
}

type ClaimResponse =
  | { linked: true; client_id: string; auth_email: string; matched_client_email: string; alreadyLinked?: boolean }
  | { linked: false; reason: 'no_matching_client'; auth_email: string }
  | { linked: false; reason: 'insert_failed'; auth_email: string; error: string; code?: string }

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

function getRequiredEnv(name: string): string | null {
  const value = Deno.env.get(name)
  return value && value.trim() ? value.trim() : null
}

function unauthorized(message = 'Unauthorized') {
  return jsonResponse({ error: message }, 401)
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (request.method === 'GET') {
    return jsonResponse({ ok: true, function: 'claim-client-profile' })
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405)
  }

  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    return unauthorized('Missing authorization header.')
  }

  const accessToken = authHeader.slice('bearer '.length).trim()
  if (!accessToken) {
    return unauthorized('Missing authorization token.')
  }

  const SUPABASE_URL = getRequiredEnv('SUPABASE_URL') ?? getRequiredEnv('ANVIS_SUPABASE_URL')
  const ANVIS_SUPABASE_SECRET_KEY = getRequiredEnv('ANVIS_SUPABASE_SECRET_KEY')

  if (!SUPABASE_URL) {
    return jsonResponse({ error: 'Supabase URL function secret is missing.' }, 500)
  }

  if (!ANVIS_SUPABASE_SECRET_KEY) {
    return jsonResponse({ error: 'Supabase service secret is not configured.' }, 500)
  }

  const supabase = createClient(SUPABASE_URL, ANVIS_SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  })

  const { data: userData, error: userError } = await supabase.auth.getUser(accessToken)
  const user = userData?.user ?? null

  if (userError || !user?.id || !user.email) {
    return unauthorized('Invalid or expired session.')
  }

  const normalizedEmail = user.email.trim().toLowerCase()

  const { data: existingLink, error: existingLinkError } = await supabase
    .from('client_users')
    .select('client_id, user_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<ClientUserRow>()

  if (existingLinkError) {
    console.error('claim-client-profile existing link lookup failed', existingLinkError)
    return jsonResponse({ error: 'Could not verify portal linkage.' }, 500)
  }

  if (existingLink?.client_id) {
    const { data: existingClient, error: existingClientError } = await supabase
      .from('clients')
      .select('email')
      .eq('id', existingLink.client_id)
      .maybeSingle<{ email: string }>()

    if (existingClientError) {
      console.error('claim-client-profile existing client lookup failed', existingClientError)
      return jsonResponse({ error: 'Could not verify portal linkage.' }, 500)
    }

    const response: ClaimResponse = {
      linked: true,
      alreadyLinked: true,
      client_id: existingLink.client_id,
      auth_email: normalizedEmail,
      matched_client_email: existingClient?.email?.trim().toLowerCase() ?? normalizedEmail,
    }
    return jsonResponse(response)
  }

  const { data: matchingClient, error: clientError } = await supabase
    .from('clients')
    .select('id, email, created_at')
    .eq('email', normalizedEmail)
    .maybeSingle<{ id: string; email: string; created_at: string }>()

  if (clientError) {
    console.error('claim-client-profile client lookup failed', clientError)
    return jsonResponse({ error: 'Could not look up your client profile.' }, 500)
  }

  if (!matchingClient?.id) {
    const response: ClaimResponse = { linked: false, reason: 'no_matching_client', auth_email: normalizedEmail }
    return jsonResponse(response)
  }

  const { error: insertError } = await supabase.from('client_users').insert({
    user_id: user.id,
    client_id: matchingClient.id,
  })

  if (insertError) {
    if (insertError.code === '23505') {
      const { data: conflictedLink } = await supabase
        .from('client_users')
        .select('client_id, user_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle<ClientUserRow>()

      if (conflictedLink?.client_id) {
        const { data: conflictedClient, error: conflictedClientError } = await supabase
          .from('clients')
          .select('email')
          .eq('id', conflictedLink.client_id)
          .maybeSingle<{ email: string }>()

        if (conflictedClientError) {
          console.error('claim-client-profile conflicted client lookup failed', conflictedClientError)
          return jsonResponse({ error: 'Could not connect your client profile.' }, 500)
        }

        const response: ClaimResponse = {
          linked: true,
          alreadyLinked: true,
          client_id: conflictedLink.client_id,
          auth_email: normalizedEmail,
          matched_client_email: conflictedClient?.email?.trim().toLowerCase() ?? normalizedEmail,
        }
        return jsonResponse(response)
      }
    }

    console.error('claim-client-profile insert failed', insertError)
    const response: ClaimResponse = {
      linked: false,
      reason: 'insert_failed',
      auth_email: normalizedEmail,
      error: 'Could not connect your client profile.',
      code: insertError.code,
    }
    return jsonResponse(response, 500)
  }

  const response: ClaimResponse = {
    linked: true,
    client_id: matchingClient.id,
    auth_email: normalizedEmail,
    matched_client_email: matchingClient.email.trim().toLowerCase(),
  }
  return jsonResponse(response)
})
