-- ============================================================
-- PsicoRank AI — Stripe billing
-- Execute no SQL Editor do Supabase
-- ============================================================

-- Adiciona stripe_customer_id ao profiles
alter table profiles add column if not exists stripe_customer_id text unique;

-- Tabela de assinaturas
create table if not exists subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null unique references auth.users(id) on delete cascade,
  stripe_subscription_id text unique not null,
  stripe_price_id        text not null,
  status                 text not null,              -- active | canceled | past_due | trialing
  plan                   plan_type not null,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create trigger subscriptions_updated_at
  before update on subscriptions
  for each row execute procedure set_updated_at();

alter table subscriptions enable row level security;
create policy "subscriptions: leitura própria" on subscriptions
  for select using (auth.uid() = user_id);
