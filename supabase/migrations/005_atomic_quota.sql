-- ============================================================
-- PsicoRank AI — Quota de geração atômica
--
-- Problema: o padrão check-then-insert tem uma race condition
-- (TOCTOU): dois requests simultâneos lêem count=4, ambos passam
-- na verificação, ambos chamam Claude, ambos salvam → count=6.
--
-- Solução: funções Postgres que verificam quota E inserem em uma
-- única transação serializada por advisory lock por usuário.
-- O lock é transaction-scoped: liberado automaticamente no commit.
-- ============================================================

CREATE OR REPLACE FUNCTION public.check_and_save_post(
  p_user_id        uuid,
  p_topic          text,
  p_clinic_name    text,
  p_specialty      text,
  p_audience       text,
  p_tone           text,
  p_legenda        text,
  p_cta            text,
  p_hashtags       text[],
  p_ideia_visual   text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan  text;
  v_count integer;
  v_id    uuid;
BEGIN
  IF auth.uid() IS DISTINCT FROM p_user_id THEN
    RAISE EXCEPTION 'permission_denied';
  END IF;

  -- Serializa requisições concorrentes do mesmo usuário
  PERFORM pg_advisory_xact_lock(abs(hashtext(p_user_id::text)));

  SELECT plan INTO v_plan FROM public.profiles WHERE id = p_user_id;

  IF v_plan = 'starter' THEN
    SELECT COUNT(*) INTO v_count
    FROM public.generated_posts
    WHERE user_id = p_user_id
      AND created_at >= date_trunc('month', now());

    IF v_count >= 5 THEN
      RAISE EXCEPTION 'quota_exceeded';
    END IF;
  END IF;

  INSERT INTO public.generated_posts (
    user_id, topic, clinic_name, specialty, audience, tone,
    legenda, cta, hashtags, ideia_visual
  ) VALUES (
    p_user_id, p_topic, p_clinic_name, p_specialty, p_audience, p_tone,
    p_legenda, p_cta, p_hashtags, p_ideia_visual
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;


CREATE OR REPLACE FUNCTION public.check_and_save_seo(
  p_user_id             uuid,
  p_city                text,
  p_specialty           text,
  p_therapeutic_focus   text,
  p_descricao_otimizada text,
  p_servicos            text[],
  p_perguntas_respostas jsonb,
  p_titulos_locais_seo  text[],
  p_posts_estrategicos  jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan  text;
  v_count integer;
  v_id    uuid;
BEGIN
  IF auth.uid() IS DISTINCT FROM p_user_id THEN
    RAISE EXCEPTION 'permission_denied';
  END IF;

  PERFORM pg_advisory_xact_lock(abs(hashtext(p_user_id::text)));

  SELECT plan INTO v_plan FROM public.profiles WHERE id = p_user_id;

  IF v_plan = 'starter' THEN
    SELECT COUNT(*) INTO v_count
    FROM public.generated_seo
    WHERE user_id = p_user_id
      AND created_at >= date_trunc('month', now());

    IF v_count >= 1 THEN
      RAISE EXCEPTION 'quota_exceeded';
    END IF;
  END IF;

  INSERT INTO public.generated_seo (
    user_id, city, specialty, therapeutic_focus,
    descricao_otimizada, servicos, perguntas_respostas,
    titulos_locais_seo, posts_estrategicos
  ) VALUES (
    p_user_id, p_city, p_specialty, p_therapeutic_focus,
    p_descricao_otimizada, p_servicos, p_perguntas_respostas,
    p_titulos_locais_seo, p_posts_estrategicos
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;
