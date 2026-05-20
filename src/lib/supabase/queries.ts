import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  GeneratedGoogleSeo,
  GeneratedPost,
  GoogleSeoGeneratorPayload,
  PostGeneratorPayload,
} from "@/lib/generation";
import type { GeneratedPostRow, GeneratedSeoRow, Profile } from "@/lib/database.types";

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
  const { data, error } = await supabase
    .from("generated_posts")
    .insert({
      user_id: userId,
      topic: payload.topic,
      clinic_name: payload.clinicName,
      specialty: payload.specialty,
      audience: payload.audience,
      tone: payload.tone,
      legenda: content.legenda,
      cta: content.cta,
      hashtags: content.hashtags,
      ideia_visual: content.ideiaVisual,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data as { id: string };
}

export async function saveSeo(
  supabase: SupabaseClient,
  userId: string,
  payload: GoogleSeoGeneratorPayload,
  content: GeneratedGoogleSeo,
): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from("generated_seo")
    .insert({
      user_id: userId,
      city: payload.city,
      specialty: payload.specialty,
      therapeutic_focus: payload.therapeuticFocus,
      descricao_otimizada: content.descricaoOtimizada,
      servicos: content.servicos,
      perguntas_respostas: content.perguntasRespostas,
      titulos_locais_seo: content.titulosLocaisSeo,
      posts_estrategicos: content.postsEstrategicos,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data as { id: string };
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
