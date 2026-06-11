-- ============================================================
-- PsicoRank AI — Tabelas Google Meu Negócio
-- Depende de: 001_initial_schema.sql (plan_type enum, set_updated_at)
-- Idempotente: seguro para rodar mesmo que as tabelas já existam
-- ============================================================

create table if not exists public.gmb_tokens (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references public.profiles (id) on delete cascade,
  access_token  text        not null,
  refresh_token text,
  expires_at    timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (user_id)
);

alter table public.gmb_tokens enable row level security;

drop policy if exists "gmb_tokens: leitura própria"     on public.gmb_tokens;
drop policy if exists "gmb_tokens: inserção própria"    on public.gmb_tokens;
drop policy if exists "gmb_tokens: atualização própria" on public.gmb_tokens;
drop policy if exists "gmb_tokens: exclusão própria"    on public.gmb_tokens;
drop policy if exists "gmb_tokens: acesso próprio"      on public.gmb_tokens;

create policy "gmb_tokens: leitura própria"
  on public.gmb_tokens for select using (auth.uid() = user_id);

create policy "gmb_tokens: inserção própria"
  on public.gmb_tokens for insert with check (auth.uid() = user_id);

create policy "gmb_tokens: atualização própria"
  on public.gmb_tokens for update using (auth.uid() = user_id);

create policy "gmb_tokens: exclusão própria"
  on public.gmb_tokens for delete using (auth.uid() = user_id);

drop trigger if exists set_gmb_tokens_updated_at on public.gmb_tokens;
drop trigger if exists gmb_tokens_updated_at      on public.gmb_tokens;
create trigger set_gmb_tokens_updated_at
  before update on public.gmb_tokens
  for each row execute function public.set_updated_at();

-- ============================================================

create table if not exists public.gmb_locations (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references public.profiles (id) on delete cascade,
  account_id    text        not null,
  location_id   text        not null,
  location_name text        not null,
  address       text,
  created_at    timestamptz not null default now(),
  unique (user_id, location_id)
);

alter table public.gmb_locations enable row level security;

drop policy if exists "gmb_locations: leitura própria"  on public.gmb_locations;
drop policy if exists "gmb_locations: inserção própria" on public.gmb_locations;
drop policy if exists "gmb_locations: exclusão própria" on public.gmb_locations;
drop policy if exists "gmb_locations: acesso próprio"   on public.gmb_locations;

create policy "gmb_locations: leitura própria"
  on public.gmb_locations for select using (auth.uid() = user_id);

create policy "gmb_locations: inserção própria"
  on public.gmb_locations for insert with check (auth.uid() = user_id);

create policy "gmb_locations: exclusão própria"
  on public.gmb_locations for delete using (auth.uid() = user_id);
