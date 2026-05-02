-- Pass 5: paid client welcome email support
--
-- Tracks whether the post-payment welcome email has already been sent so
-- Stripe webhook retries do not duplicate the message.

alter table public.client_packages
  add column if not exists welcome_email_sent_at timestamptz;
