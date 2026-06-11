-- ============================================================
-- PsicoRank AI — Corrige RLS da tabela profiles
--
-- Problema: a policy FOR ALL (ou UPDATE sem WITH CHECK restritivo)
-- permitia que qualquer usuário autenticado fizesse:
--   UPDATE profiles SET plan = 'pro' WHERE id = auth.uid()
-- usando a anon key do Supabase (exposta no browser por design).
--
-- Solução: substituir por policies separadas, com WITH CHECK que
-- impede alteração de plan e stripe_customer_id pelo client.
-- O service role (webhook Stripe) ignora RLS e continua funcionando.
-- ============================================================

-- Remove todas as políticas existentes em profiles
-- (cobre tanto 001_initial.sql quanto 001_initial_schema.sql)
DROP POLICY IF EXISTS "profiles: leitura própria"           ON public.profiles;
DROP POLICY IF EXISTS "profiles: atualização própria"       ON public.profiles;
DROP POLICY IF EXISTS "profiles: escrita própria"           ON public.profiles;
DROP POLICY IF EXISTS "profiles: atualização campos permitidos" ON public.profiles;

-- SELECT: usuário lê apenas o próprio perfil
CREATE POLICY "profiles: leitura própria"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- UPDATE: campos de perfil do psicólogo (name, specialty, city, clinic_name)
-- plan e stripe_customer_id são imutáveis pelo client — só o service role altera
CREATE POLICY "profiles: atualização campos permitidos"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND plan              = (SELECT plan              FROM public.profiles WHERE id = auth.uid())
    AND (stripe_customer_id IS NOT DISTINCT FROM
         (SELECT stripe_customer_id FROM public.profiles WHERE id = auth.uid()))
  );
