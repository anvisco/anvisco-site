import { supabase } from '@/lib/supabase'

export interface AdminClientDeletePreviewClient {
  id: string
  name: string
  business_name: string | null
  email: string
  status: string
  created_at: string
}

export interface AdminClientDeletePreviewPackage {
  id: string
  client_id: string
  package_name: string
  package_type: string
  status: string
  total_cents: number
  recurring_amount_cents: number | null
  created_at: string
}

export interface AdminClientDeletePreviewPayment {
  id: string
  client_id: string
  package_id: string
  label: string
  amount_cents: number
  status: string
  due_date: string | null
  created_at: string
}

export interface AdminClientDeletePreviewUpdate {
  id: string
  client_id: string
  package_id: string | null
  stage: string
  title: string
  created_at: string
}

export interface AdminClientDeletePreviewModuleSelection {
  id: string
  package_id: string
  module_name: string
  quantity: number
  total_cents: number
}

export interface AdminClientDeletePreviewLink {
  id: string
  client_id: string
  user_id: string
  created_at: string
}

export interface AdminClientDeletePreview {
  client: AdminClientDeletePreviewClient
  packages: AdminClientDeletePreviewPackage[]
  payments: AdminClientDeletePreviewPayment[]
  updates: AdminClientDeletePreviewUpdate[]
  moduleSelections: AdminClientDeletePreviewModuleSelection[]
  clientUsers: AdminClientDeletePreviewLink[]
}

export interface AdminClientDeletePreviewBundle {
  clients: AdminClientDeletePreviewClient[]
  packages: AdminClientDeletePreviewPackage[]
  payments: AdminClientDeletePreviewPayment[]
  updates: AdminClientDeletePreviewUpdate[]
  moduleSelections: AdminClientDeletePreviewModuleSelection[]
  clientUsers: AdminClientDeletePreviewLink[]
}

function ensureSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured.')
  }
  return supabase
}

interface QueryResponse<T> {
  data: T | null
  error: { message: string } | null
}

async function query<T>(promise: PromiseLike<QueryResponse<T>>): Promise<T | null> {
  const { data, error } = await promise
  if (error) throw new Error(error.message)
  return data as T | null
}

function uniqueIds(ids: string[]): string[] {
  return [...new Set(ids.filter(Boolean))]
}

export async function loadAdminClientDeletePreviewBundle(
  clientIds: string[],
): Promise<AdminClientDeletePreviewBundle> {
  const client = ensureSupabase()
  const normalizedIds = uniqueIds(clientIds)

  if (normalizedIds.length === 0) {
    throw new Error('No client records were selected.')
  }

  const clients = (await query<AdminClientDeletePreviewClient[]>(
    client
      .from('clients')
      .select('id, name, business_name, email, status, created_at')
      .in('id', normalizedIds)
      .order('created_at', { ascending: false }),
  )) ?? []

  if (clients.length === 0) {
    throw new Error('Client not found.')
  }

  const [packages, payments, updates, clientUsers] = await Promise.all([
    query<AdminClientDeletePreviewPackage[]>(
      client
        .from('client_packages')
        .select('id, client_id, package_name, package_type, status, total_cents, recurring_amount_cents, created_at')
        .in('client_id', normalizedIds)
        .order('created_at', { ascending: false }),
    ),
    query<AdminClientDeletePreviewPayment[]>(
      client
        .from('payment_schedules')
        .select('id, client_id, package_id, label, amount_cents, status, due_date, created_at')
        .in('client_id', normalizedIds)
        .order('created_at', { ascending: false }),
    ),
    query<AdminClientDeletePreviewUpdate[]>(
      client
        .from('project_updates')
        .select('id, client_id, package_id, stage, title, created_at')
        .in('client_id', normalizedIds)
        .order('created_at', { ascending: false }),
    ),
    query<AdminClientDeletePreviewLink[]>(
      client
        .from('client_users')
        .select('id, client_id, user_id, created_at')
        .in('client_id', normalizedIds)
        .order('created_at', { ascending: false }),
    ),
  ])

  const packageIds = (packages ?? []).map((pkg) => pkg.id)
  const moduleSelections = packageIds.length
    ? ((await query<AdminClientDeletePreviewModuleSelection[]>(
        client
          .from('client_module_selections')
          .select('id, package_id, module_name, quantity, total_cents')
          .in('package_id', packageIds)
          .order('created_at', { ascending: false }),
      )) ?? [])
    : []

  return {
    clients,
    packages: (packages ?? []) as AdminClientDeletePreviewPackage[],
    payments: (payments ?? []) as AdminClientDeletePreviewPayment[],
    updates: (updates ?? []) as AdminClientDeletePreviewUpdate[],
    moduleSelections: moduleSelections as AdminClientDeletePreviewModuleSelection[],
    clientUsers: (clientUsers ?? []) as AdminClientDeletePreviewLink[],
  }
}

export async function loadAdminClientDeletePreview(clientId: string): Promise<AdminClientDeletePreview> {
  const preview = await loadAdminClientDeletePreviewBundle([clientId])

  const client = preview.clients[0]
  if (!client) {
    throw new Error('Client not found.')
  }

  return {
    client,
    packages: preview.packages,
    payments: preview.payments,
    updates: preview.updates,
    moduleSelections: preview.moduleSelections,
    clientUsers: preview.clientUsers,
  }
}

export async function deleteAdminClient(clientId: string): Promise<void> {
  await deleteAdminClients([clientId])
}

export async function deleteAdminClients(clientIds: string[]): Promise<void> {
  const client = ensureSupabase()
  const preview = await loadAdminClientDeletePreviewBundle(clientIds)
  const normalizedIds = uniqueIds(clientIds)
  const packageIds = preview.packages.map((pkg) => pkg.id)

  const steps: Array<PromiseLike<{ error: { message: string } | null }>> = [
    client.from('project_updates').delete().in('client_id', normalizedIds),
    client.from('payment_schedules').delete().in('client_id', normalizedIds),
    packageIds.length
      ? client.from('client_module_selections').delete().in('package_id', packageIds)
      : Promise.resolve({ error: null }),
    client.from('client_packages').delete().in('client_id', normalizedIds),
    client.from('client_users').delete().in('client_id', normalizedIds),
    client.from('clients').delete().in('id', normalizedIds),
  ]

  for (const step of steps) {
    const { error } = await step
    if (error) {
      throw new Error(error.message)
    }
  }
}
