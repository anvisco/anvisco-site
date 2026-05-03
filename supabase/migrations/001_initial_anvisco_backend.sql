-- Anvis backend - initial schema (Pass 1)
--
-- Creates:
--   profiles, clients, client_users, client_packages,
--   client_module_selections, payment_schedules, project_updates,
--   email_logs, email_templates
--
-- All tables have Row Level Security enabled. Policies are designed so:
--   - admins can do everything (is_admin() helper)
--   - a client can read their own client row, packages, module selections,
--     payment schedules, and project updates flagged visible_to_client
--   - clients cannot see email_logs, email_templates, or other clients
--   - clients cannot mutate payment status or admin tables
--
-- Run in the Supabase SQL editor or via `supabase db push`. See
-- BACKEND_SETUP.md for setup steps.

-- ---------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'client' check (role in ('admin', 'client')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- ---------------------------------------------------------------
-- is_admin() helper
-- ---------------------------------------------------------------
-- SECURITY DEFINER so it can read profiles even when the caller's
-- own RLS policies would not allow a self-select. Marked STABLE.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------
-- clients
-- ---------------------------------------------------------------
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business_name text,
  email text not null,
  phone text,
  website_url text,
  status text not null default 'lead' check (
    status in ('lead', 'active', 'paused', 'completed', 'archived')
  ),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.clients enable row level security;

-- ---------------------------------------------------------------
-- client_users (many-to-many between clients and auth.users)
-- ---------------------------------------------------------------
create table if not exists public.client_users (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (client_id, user_id)
);

alter table public.client_users enable row level security;

-- ---------------------------------------------------------------
-- client_packages
-- ---------------------------------------------------------------
create table if not exists public.client_packages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  package_type text not null check (
    package_type in ('audit', 'modules', 'build', 'recurring')
  ),
  package_name text not null,
  status text not null default 'requested' check (
    status in ('requested', 'scoped', 'in_progress', 'complete', 'cancelled')
  ),
  subtotal_cents integer not null default 0,
  discount_cents integer not null default 0,
  total_cents integer not null default 0,
  recurring_amount_cents integer,
  next_payment_due_at date,
  payment_url text,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.client_packages enable row level security;

-- ---------------------------------------------------------------
-- client_module_selections (line items inside a modules package)
-- ---------------------------------------------------------------
create table if not exists public.client_module_selections (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.client_packages(id) on delete cascade,
  module_id text not null,
  module_name text not null,
  quantity integer not null default 1 check (quantity >= 1),
  unit_price_cents integer not null,
  total_cents integer not null,
  created_at timestamptz not null default now()
);

alter table public.client_module_selections enable row level security;

-- ---------------------------------------------------------------
-- payment_schedules
-- ---------------------------------------------------------------
create table if not exists public.payment_schedules (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  package_id uuid not null references public.client_packages(id) on delete cascade,
  label text not null,
  amount_cents integer not null,
  due_date date,
  status text not null default 'not_started' check (
    status in ('not_started', 'pending', 'paid', 'overdue', 'cancelled')
  ),
  payment_url text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.payment_schedules enable row level security;

-- ---------------------------------------------------------------
-- project_updates
-- ---------------------------------------------------------------
create table if not exists public.project_updates (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  package_id uuid references public.client_packages(id) on delete set null,
  stage text not null check (
    stage in ('audit', 'scope', 'build', 'launch', 'support', 'complete')
  ),
  title text not null,
  body text,
  visible_to_client boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.project_updates enable row level security;

-- ---------------------------------------------------------------
-- email_logs (admin only)
-- ---------------------------------------------------------------
create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  to_email text not null,
  subject text not null,
  body text,
  status text not null default 'draft' check (
    status in ('draft', 'queued', 'sent', 'failed')
  ),
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.email_logs enable row level security;

-- ---------------------------------------------------------------
-- email_templates (admin only)
-- ---------------------------------------------------------------
create table if not exists public.email_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  subject text not null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.email_templates enable row level security;

-- ---------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------
create index if not exists idx_clients_email on public.clients (email);
create index if not exists idx_client_packages_client_id on public.client_packages (client_id);
create index if not exists idx_payment_schedules_client_id on public.payment_schedules (client_id);
create index if not exists idx_payment_schedules_package_id on public.payment_schedules (package_id);
create index if not exists idx_project_updates_client_id on public.project_updates (client_id);
create index if not exists idx_client_users_user_id on public.client_users (user_id);
create index if not exists idx_client_users_client_id on public.client_users (client_id);
create index if not exists idx_module_selections_package_id on public.client_module_selections (package_id);

-- ---------------------------------------------------------------
-- RLS policies
-- ---------------------------------------------------------------

-- profiles: a user can read their own profile; admins can read/write all.
drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- clients: admins do everything; a client can read clients they are linked to.
drop policy if exists "clients_admin_all" on public.clients;
create policy "clients_admin_all" on public.clients
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "clients_self_select" on public.clients;
create policy "clients_self_select" on public.clients
  for select to authenticated
  using (
    exists (
      select 1 from public.client_users cu
      where cu.client_id = clients.id
        and cu.user_id = auth.uid()
    )
  );

-- client_users: admins do everything; a user can read their own links.
drop policy if exists "client_users_admin_all" on public.client_users;
create policy "client_users_admin_all" on public.client_users
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "client_users_self_select" on public.client_users;
create policy "client_users_self_select" on public.client_users
  for select to authenticated
  using (user_id = auth.uid());

-- client_packages: admins do everything; clients read their own.
drop policy if exists "client_packages_admin_all" on public.client_packages;
create policy "client_packages_admin_all" on public.client_packages
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "client_packages_client_select" on public.client_packages;
create policy "client_packages_client_select" on public.client_packages
  for select to authenticated
  using (
    exists (
      select 1 from public.client_users cu
      where cu.client_id = client_packages.client_id
        and cu.user_id = auth.uid()
    )
  );

-- client_module_selections: admins do everything; clients read theirs via package.
drop policy if exists "module_selections_admin_all" on public.client_module_selections;
create policy "module_selections_admin_all" on public.client_module_selections
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "module_selections_client_select" on public.client_module_selections;
create policy "module_selections_client_select" on public.client_module_selections
  for select to authenticated
  using (
    exists (
      select 1
      from public.client_packages p
      join public.client_users cu on cu.client_id = p.client_id
      where p.id = client_module_selections.package_id
        and cu.user_id = auth.uid()
    )
  );

-- payment_schedules: admins do everything; clients read theirs (no updates).
drop policy if exists "payment_schedules_admin_all" on public.payment_schedules;
create policy "payment_schedules_admin_all" on public.payment_schedules
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "payment_schedules_client_select" on public.payment_schedules;
create policy "payment_schedules_client_select" on public.payment_schedules
  for select to authenticated
  using (
    exists (
      select 1 from public.client_users cu
      where cu.client_id = payment_schedules.client_id
        and cu.user_id = auth.uid()
    )
  );

-- project_updates: admins do everything; clients read only entries flagged visible.
drop policy if exists "project_updates_admin_all" on public.project_updates;
create policy "project_updates_admin_all" on public.project_updates
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "project_updates_client_select" on public.project_updates;
create policy "project_updates_client_select" on public.project_updates
  for select to authenticated
  using (
    visible_to_client = true
    and exists (
      select 1 from public.client_users cu
      where cu.client_id = project_updates.client_id
        and cu.user_id = auth.uid()
    )
  );

-- email_logs: admin only. No client access.
drop policy if exists "email_logs_admin_all" on public.email_logs;
create policy "email_logs_admin_all" on public.email_logs
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- email_templates: admin only.
drop policy if exists "email_templates_admin_all" on public.email_templates;
create policy "email_templates_admin_all" on public.email_templates
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_clients_updated_at on public.clients;
create trigger trg_clients_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

drop trigger if exists trg_packages_updated_at on public.client_packages;
create trigger trg_packages_updated_at
  before update on public.client_packages
  for each row execute function public.set_updated_at();
