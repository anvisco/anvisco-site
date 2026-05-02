import { createClient } from 'npm:@supabase/supabase-js@2.105.1'

type ClientUserRow = {
  client_id: string
  user_id: string
}

type ClaimResponse =
  | { linked: true; client_id: string; auth_email: string; matched_client_email: string; alreadyLinked?: boolean }
  | { linked: false; reason: 'no_matching_client'; auth_email: string; candidate_count: number }
  | { linked: false; reason: 'insert_failed'; auth_email: string; client_id: string; error: string; code?: string }

type ClientCandidateRow = {
  id: string
  email: string
  created_at: string
}

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

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
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

  const authSupabase = createClient(SUPABASE_URL, ANVIS_SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  })

  const adminSupabase = createClient(SUPABASE_URL, ANVIS_SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  console.log('claim-client-profile admin context', {
    auth_secret_present: Boolean(ANVIS_SUPABASE_SECRET_KEY),
  })

  const { data: userData, error: userError } = await authSupabase.auth.getUser(accessToken)
  const user = userData?.user ?? null

  if (userError || !user?.id || !user.email) {
    return unauthorized('Invalid or expired session.')
  }

  const normalizedEmail = normalizeEmail(user.email)
  console.log('claim-client-profile auth context', {
    auth_user_id: user.id,
    auth_email: user.email,
    normalized_email: normalizedEmail,
  })

  const { data: existingLink, error: existingLinkError } = await adminSupabase
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
    const { data: existingClient, error: existingClientError } = await adminSupabase
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
      matched_client_email: existingClient?.email ?? normalizedEmail,
    }
    return jsonResponse(response)
  }

  async function findRecentClientCandidates() {
    const { data, error } = await adminSupabase
      .from('clients')
      .select('id, email, created_at')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error
    return (data as ClientCandidateRow[] | null) ?? []
  }

  let candidates: ClientCandidateRow[] = []
  let matchingClient: ClientCandidateRow | null = null
  let clientError: { code?: string; message?: string; details?: string; hint?: string } | null = null

  try {
    candidates = await findRecentClientCandidates()
    matchingClient = candidates.find((client) => normalizeEmail(client.email) === normalizedEmail) ?? null
  } catch (error) {
    clientError = error as { code?: string; message?: string; details?: string; hint?: string }
  }

  if (clientError) {
    console.error('claim-client-profile client lookup failed', clientError)
    return jsonResponse({ error: 'Could not look up your client profile.' }, 500)
  }

  const matchingClientsFound = candidates.filter((client) => normalizeEmail(client.email) === normalizedEmail)

  console.log('claim-client-profile email match scan', {
    auth_email: normalizedEmail,
    candidate_count: candidates.length,
    matching_clients_found: matchingClientsFound.length,
    selected_client_id: matchingClient?.id ?? null,
  })

  if (!matchingClient?.id) {
    const response: ClaimResponse = {
      linked: false,
      reason: 'no_matching_client',
      auth_email: normalizedEmail,
      candidate_count: candidates.length,
    }
    return jsonResponse(response)
  }

  const { error: insertError } = await adminSupabase.from('client_users').insert({
    user_id: user.id,
    client_id: matchingClient.id,
  })

  console.log('claim-client-profile insert attempt', {
    auth_user_id: user.id,
    auth_email: normalizedEmail,
    client_id: matchingClient.id,
    insert_error: insertError ? insertError.code ?? insertError.message ?? 'unknown' : null,
  })

  if (insertError) {
    if (insertError.code === '23505') {
      const { data: conflictedLink } = await adminSupabase
        .from('client_users')
        .select('client_id, user_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle<ClientUserRow>()

      if (conflictedLink?.client_id) {
        const { data: conflictedClient, error: conflictedClientError } = await adminSupabase
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
          matched_client_email: conflictedClient?.email ?? normalizedEmail,
        }
        return jsonResponse(response)
      }
    }

    console.error('claim-client-profile insert failed', insertError)
    const response: ClaimResponse = {
      linked: false,
      reason: 'insert_failed',
      auth_email: normalizedEmail,
      client_id: matchingClient.id,
      error: 'Could not connect your client profile.',
      code: insertError.code,
    }
    return jsonResponse(response, 500)
  }

  const response: ClaimResponse = {
    linked: true,
    client_id: matchingClient.id,
    auth_email: normalizedEmail,
    matched_client_email: matchingClient.email,
  }
  return jsonResponse(response)
})
