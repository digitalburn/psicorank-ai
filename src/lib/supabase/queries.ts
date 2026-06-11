import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  GeneratedGoogleSeo,
  GeneratedPost,
  GoogleSeoGeneratorPayload,
  PostGeneratorPayload,
} from "@/lib/generation";
import type { GeneratedPostRow, GeneratedSeoRow, Profile, Subscription } from "@/lib/database.types";

export class QuotaExceededError extends Error {
  constructor() {
    super("quota_exceeded");
    this.name = "QuotaExceededError";
  }
}

export async function getProfile(supabase: SupabaseClient): Promise<Profile | null> {
  const { data, error } = await supabase.from("profiles").select("*").single();
  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function savePost(
  supabase: SupabaseClient,
  userId: string,
  payload: PostGeneratorPayload,
  content: GeneratedPost,
): Promise<{ id: string }> {
  const { data, error } = await supabase.rpc("check_and_save_post", {
    p_user_id:      userId,
    p_topic:        payload.topic,
    p_clinic_name:  payload.clinicName,
    p_specialty:    payload.specialty,
    p_audience:     payload.audience,
    p_tone:         payload.tone,
    p_legenda:      content.legenda,
    p_cta:          content.cta,
    p_hashtags:     content.hashtags,
    p_ideia_visual: content.ideiaVisual,
  });

  if (error) {
    if (error.message.includes("quota_exceeded")) throw new QuotaExceededError();
    throw error;
  }
  return { id: data as string };
}

export async function saveSeo(
  supabase: SupabaseClient,
  userId: string,
  payload: GoogleSeoGeneratorPayload,
  content: GeneratedGoogleSeo,
): Promise<{ id: string }> {
  const { data, error } = await supabase.rpc("check_and_save_seo", {
    p_user_id:               userId,
    p_city:                  payload.city,
    p_specialty:             payload.specialty,
    p_therapeutic_focus:     payload.therapeuticFocus,
    p_descricao_otimizada:   content.descricaoOtimizada,
    p_servicos:              content.servicos,
    p_perguntas_respostas:   content.perguntasRespostas,
    p_titulos_locais_seo:    content.titulosLocaisSeo,
    p_posts_estrategicos:    content.postsEstrategicos,
  });

  if (error) {
    if (error.message.includes("quota_exceeded")) throw new QuotaExceededError();
    throw error;
  }
  return { id: data as string };
}

export async function getRecentPosts(
  supabase: SupabaseClient,
  limit = 12,
): Promise<GeneratedPostRow[]> {
  const { data, error } = await supabase
    .from("generated_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as GeneratedPostRow[];
}

export async function getRecentSeo(
  supabase: SupabaseClient,
  limit = 12,
): Promise<GeneratedSeoRow[]> {
  const { data, error } = await supabase
    .from("generated_seo")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as GeneratedSeoRow[];
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  data: Partial<Pick<Profile, "name" | "specialty" | "city" | "clinic_name">>,
): Promise<void> {
  const { error } = await supabase.from("profiles").update(data).eq("id", userId);
  if (error) throw error;
}

export async function deletePost(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from("generated_posts").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteSeo(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from("generated_seo").delete().eq("id", id);
  if (error) throw error;
}

export async function getSubscription(supabase: SupabaseClient): Promise<Subscription | null> {
  const { data, error } = await supabase.from("subscriptions").select("*").single();
  if (error && error.code !== "PGRST116") throw error;
  return data as Subscription | null;
}

export async function getPostCountThisMonth(
  supabase: SupabaseClient,
  userId: string,
): Promise<number> {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const { count } = await supabase
    .from("generated_posts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", start.toISOString());
  return count ?? 0;
}

export async function getSeoCountThisMonth(
  supabase: SupabaseClient,
  userId: string,
): Promise<number> {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const { count } = await supabase
    .from("generated_seo")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", start.toISOString());
  return count ?? 0;
}
