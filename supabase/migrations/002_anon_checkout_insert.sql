-- Pass 2 fix: allow unauthenticated (anon) users to insert rows created
-- by the /checkout request flow. All operations are INSERT-only; anon
-- cannot SELECT, UPDATE, or DELETE. The admin RLS policies from 001
-- still govern all authenticated reads and writes.
--
-- Run this in the Supabase SQL editor after 001_initial_anvisco_backend.sql.

-- clients: anon can insert a new lead
drop policy if exists "clients_anon_insert" on public.clients;
create policy "clients_anon_insert" on public.clients
  for insert to anon
  with check (status = 'lead');

-- client_packages: anon can insert a package row
drop policy if exists "client_packages_anon_insert" on public.client_packages;
create policy "client_packages_anon_insert" on public.client_packages
  for insert to anon
  with check (status = 'requested');

-- client_module_selections: anon can insert line items for a package
drop policy if exists "module_selections_anon_insert" on public.client_module_selections;
create policy "module_selections_anon_insert" on public.client_module_selections
  for insert to anon
  with check (true);

-- payment_schedules: anon can insert an initial payment record
drop policy if exists "payment_schedules_anon_insert" on public.payment_schedules;
create policy "payment_schedules_anon_insert" on public.payment_schedules
  for insert to anon
  with check (status = 'not_started');
