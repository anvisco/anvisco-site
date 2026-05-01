-- Pass 4: Stripe Checkout Sessions + webhook support
--
-- Adds Stripe tracking columns and an idempotency table for webhook events.

alter table public.client_packages
  drop constraint if exists client_packages_status_check;

alter table public.client_packages
  add constraint client_packages_status_check
  check (
    status in ('requested', 'scoped', 'in_progress', 'active', 'complete', 'cancelled')
  );

alter table public.payment_schedules
  add column if not exists stripe_session_id text,
  add column if not exists stripe_payment_intent_id text,
  add column if not exists stripe_invoice_id text;

alter table public.client_packages
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text;

create table if not exists public.stripe_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now()
);

alter table public.stripe_events enable row level security;

drop policy if exists "stripe_events_admin_all" on public.stripe_events;
create policy "stripe_events_admin_all" on public.stripe_events
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

