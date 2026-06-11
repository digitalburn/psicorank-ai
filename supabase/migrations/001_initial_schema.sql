-- ============================================================
-- PsicoRank AI — Schema inicial
-- Execute no SQL Editor do Supabase (https://supabase.com)
-- ============================================================

-- Extensão necessária para UUIDs
create extension if not exists "pgcrypto";

-- ── Enum de planos ─────────────────────────────────────────
create type plan_type as enum ('starter', 'pro', 'clinic');

-- ── Perfis de usuário ──────────────────────────────────────
create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text,
  name          text,
  specialty     text,
  city          text,
  clinic_name   text,
  plan          plan_type not null default 'starter',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Cria linha em profiles automaticamente após signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Atualiza updated_at automaticamente
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure set_updated_at();

-- ── Posts gerados ──────────────────────────────────────────
create table if not exists generated_posts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  topic         text not null,
  clinic_name   text,
  specialty     text,
  audience      text,
  tone          text,
  legenda       text not null,
  cta           text not null,
  hashtags      text[] not null default '{}',
  ideia_visual  text not null,
  created_at    timestamptz not null default now()
);

create index if not exists generated_posts_user_id_idx on generated_posts(user_id);

-- ── SEO gerado ─────────────────────────────────────────────
create table if not exists generated_seo (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  city                  text not null,
  specialty             text not null,
  therapeutic_focus     text not null,
  descricao_otimizada   text not null,
  servicos              text[] not null default '{}',
  perguntas_respostas   jsonb not null default '[]',
  titulos_locais_seo    text[] not null default '{}',
  posts_estrategicos    jsonb not null default '[]',
  created_at            timestamptz not null default now()
);

create index if not exists generated_seo_user_id_idx on generated_seo(user_id);

-- ── Tokens OAuth do Google Meu Negócio ────────────────────
create table if not exists gmb_tokens (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null unique references auth.users(id) on delete cascade,
  access_token   text not null,
  refresh_token  text,
  expires_at     timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger gmb_tokens_updated_at
  before update on gmb_tokens
  for each row execute procedure set_updated_at();

-- ── Localizações GMB do usuário ────────────────────────────
create table if not exists gmb_locations (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  account_id      text not null,
  location_id     text not null,
  location_name   text not null,
  address         text,
  created_at      timestamptz not null default now(),
  unique (user_id, location_id)
);

create index if not exists gmb_locations_user_id_idx on gmb_locations(user_id);

-- ============================================================
-- Row Level Security (RLS)
-- Cada usuário só acessa os próprios dados
-- ============================================================

alter table profiles         enable row level security;
alter table generated_posts  enable row level security;
alter table generated_seo    enable row level security;
alter table gmb_tokens       enable row level security;
alter table gmb_locations    enable row level security;

-- profiles
create policy "profiles: leitura própria"  on profiles for select using (auth.uid() = id);
create policy "profiles: escrita própria"  on profiles for all    using (auth.uid() = id);

-- generated_posts
create policy "posts: leitura própria"  on generated_posts for select using (auth.uid() = user_id);
create policy "posts: inserção própria" on generated_posts for insert with check (auth.uid() = user_id);
create policy "posts: exclusão própria" on generated_posts for delete using (auth.uid() = user_id);

-- generated_seo
create policy "seo: leitura própria"  on generated_seo for select using (auth.uid() = user_id);
create policy "seo: inserção própria" on generated_seo for insert with check (auth.uid() = user_id);
create policy "seo: exclusão própria" on generated_seo for delete using (auth.uid() = user_id);

-- gmb_tokens
create policy "gmb_tokens: acesso próprio" on gmb_tokens for all using (auth.uid() = user_id);

-- gmb_locations
create policy "gmb_locations: acesso próprio" on gmb_locations for all using (auth.uid() = user_id);
