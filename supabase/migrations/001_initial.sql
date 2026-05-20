-- ============================================================
-- PsicoRank AI — schema inicial
-- Execute no Supabase SQL Editor: https://supabase.com/dashboard
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- profiles (espelho de auth.users)
-- ============================================================
create table if not exists public.profiles (
  id          uuid        primary key references auth.users (id) on delete cascade,
  email       text,
  name        text,
  specialty   text,
  city        text,
  clinic_name text,
  plan        text        not null default 'starter' check (plan in ('starter', 'pro', 'clinic')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: leitura própria"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: atualização própria"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ============================================================
-- generated_posts
-- ============================================================
create table if not exists public.generated_posts (
  id           uuid        primary key default uuid_generate_v4(),
  user_id      uuid        not null references public.profiles (id) on delete cascade,
  topic        text        not null,
  clinic_name  text,
  specialty    text,
  audience     text,
  tone         text,
  legenda      text        not null,
  cta          text        not null,
  hashtags     text[]      not null default '{}',
  ideia_visual text        not null,
  created_at   timestamptz not null default now()
);

alter table public.generated_posts enable row level security;

create policy "generated_posts: leitura própria"
  on public.generated_posts for select
  using (auth.uid() = user_id);

create policy "generated_posts: inserção própria"
  on public.generated_posts for insert
  with check (auth.uid() = user_id);

create policy "generated_posts: exclusão própria"
  on public.generated_posts for delete
  using (auth.uid() = user_id);

-- ============================================================
-- generated_seo
-- ============================================================
create table if not exists public.generated_seo (
  id                  uuid        primary key default uuid_generate_v4(),
  user_id             uuid        not null references public.profiles (id) on delete cascade,
  city                text        not null,
  specialty           text        not null,
  therapeutic_focus   text        not null,
  descricao_otimizada text        not null,
  servicos            text[]      not null default '{}',
  perguntas_respostas jsonb       not null default '[]',
  titulos_locais_seo  text[]      not null default '{}',
  posts_estrategicos  jsonb       not null default '[]',
  created_at          timestamptz not null default now()
);

alter table public.generated_seo enable row level security;

create policy "generated_seo: leitura própria"
  on public.generated_seo for select
  using (auth.uid() = user_id);

create policy "generated_seo: inserção própria"
  on public.generated_seo for insert
  with check (auth.uid() = user_id);

create policy "generated_seo: exclusão própria"
  on public.generated_seo for delete
  using (auth.uid() = user_id);

-- ============================================================
-- trigger: criar profile automaticamente no signup
-- ============================================================
create or replace function public.handle_new_user ()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'full_name',
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user ();

-- ============================================================
-- trigger: updated_at automático em profiles
-- ============================================================
create or replace function public.handle_updated_at ()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at ();
