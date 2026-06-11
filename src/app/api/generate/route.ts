import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import {
  buildGoogleSeoPrompt,
  buildPostPrompt,
  googleSeoSystemPrompt,
  isPostTopic,
  postGeneratorSystemPrompt,
  type GeneratedGoogleSeo,
  type GeneratedPost,
  type GeneratorRequest,
  type GoogleSeoGeneratorPayload,
  type PostGeneratorPayload,
} from "@/lib/generation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { savePost, saveSeo, getPostCountThisMonth, getSeoCountThisMonth } from "@/lib/supabase/queries";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const CLAUDE_MODEL = process.env.CLAUDE_MODEL ?? "claude-haiku-4-5-20251001";

function cleanJsonText(text: string) {
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

async function callClaude({
  prompt,
  systemPrompt,
}: {
  prompt: string;
  systemPrompt: string;
}): Promise<string> {
  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1400,
    system: systemPrompt,
    messages: [{ role: "user", content: prompt }],
  });

  const block = message.content[0];
  if (block.type !== "text") throw new Error("Resposta inesperada da IA.");
  return block.text;
}

function parseGeneratedPost(text: string): GeneratedPost {
  const data = JSON.parse(cleanJsonText(text)) as Partial<GeneratedPost>;

  if (
    typeof data.legenda !== "string" ||
    typeof data.cta !== "string" ||
    !Array.isArray(data.hashtags) ||
    typeof data.ideiaVisual !== "string"
  ) {
    throw new Error("Resposta da IA fora do formato esperado.");
  }

  return {
    legenda: data.legenda,
    cta: data.cta,
    hashtags: data.hashtags.filter((h): h is string => typeof h === "string"),
    ideiaVisual: data.ideiaVisual,
  };
}

function parseGeneratedGoogleSeo(text: string): GeneratedGoogleSeo {
  const data = JSON.parse(cleanJsonText(text)) as Partial<GeneratedGoogleSeo>;

  if (
    typeof data.descricaoOtimizada !== "string" ||
    !Array.isArray(data.servicos) ||
    !Array.isArray(data.perguntasRespostas) ||
    !Array.isArray(data.titulosLocaisSeo) ||
    !Array.isArray(data.postsEstrategicos)
  ) {
    throw new Error("Resposta da IA fora do formato esperado.");
  }

  return {
    descricaoOtimizada: data.descricaoOtimizada,
    servicos: data.servicos.filter((s): s is string => typeof s === "string"),
    perguntasRespostas: data.perguntasRespostas
      .filter(
        (item): item is { pergunta: string; resposta: string } =>
          typeof item?.pergunta === "string" && typeof item?.resposta === "string",
      )
      .map((item) => ({ pergunta: item.pergunta, resposta: item.resposta })),
    titulosLocaisSeo: data.titulosLocaisSeo.filter((t): t is string => typeof t === "string"),
    postsEstrategicos: data.postsEstrategicos
      .filter(
        (item): item is { titulo: string; texto: string; objetivo: string } =>
          typeof item?.titulo === "string" &&
          typeof item?.texto === "string" &&
          typeof item?.objetivo === "string",
      )
      .map((item) => ({ titulo: item.titulo, texto: item.texto, objetivo: item.objetivo })),
  };
}

async function persistPost(payload: PostGeneratorPayload, content: GeneratedPost) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const saved = await savePost(supabase, user.id, payload, content);
    return saved.id;
  } catch {
    return null;
  }
}

async function persistSeo(payload: GoogleSeoGeneratorPayload, content: GeneratedGoogleSeo) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const saved = await saveSeo(supabase, user.id, payload, content);
    return saved.id;
  } catch {
    return null;
  }
}

async function generatePost(payload: PostGeneratorPayload) {
  if (!isPostTopic(payload.topic)) {
    return NextResponse.json(
      { error: "Selecione um tema válido para gerar o post." },
      { status: 400 },
    );
  }

  if (!payload.clinicName || !payload.specialty || !payload.audience || !payload.tone) {
    return NextResponse.json(
      { error: "Preencha os campos obrigatórios antes de gerar o post." },
      { status: 400 },
    );
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("plan").eq("id", user.id).single();
    if (profile?.plan === "starter") {
      const count = await getPostCountThisMonth(supabase, user.id);
      if (count >= 5) {
        return NextResponse.json(
          { error: "Limite de 5 posts/mês atingido no plano Starter. Faça upgrade para o Pro." },
          { status: 403 },
        );
      }
    }
  }

  const text = await callClaude({
    prompt: buildPostPrompt(payload),
    systemPrompt: postGeneratorSystemPrompt,
  });

  const content = parseGeneratedPost(text);
  const savedId = await persistPost(payload, content);

  return NextResponse.json({
    title: `Post sobre ${payload.topic}`,
    content,
    savedId,
  });
}

async function generateGoogleSeo(payload: GoogleSeoGeneratorPayload) {
  if (!payload.city || !payload.specialty || !payload.therapeuticFocus) {
    return NextResponse.json(
      { error: "Preencha cidade, especialidade e foco terapêutico antes de gerar o SEO." },
      { status: 400 },
    );
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("plan").eq("id", user.id).single();
    if (profile?.plan === "starter") {
      const count = await getSeoCountThisMonth(supabase, user.id);
      if (count >= 1) {
        return NextResponse.json(
          { error: "Limite de 1 SEO/mês atingido no plano Starter. Faça upgrade para o Pro." },
          { status: 403 },
        );
      }
    }
  }

  const text = await callClaude({
    prompt: buildGoogleSeoPrompt(payload),
    systemPrompt: googleSeoSystemPrompt,
  });

  const content = parseGeneratedGoogleSeo(text);
  const savedId = await persistSeo(payload, content);

  return NextResponse.json({
    title: `SEO Google Meu Negócio em ${payload.city}`,
    content,
    savedId,
  });
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Configure ANTHROPIC_API_KEY no arquivo .env.local." },
      { status: 500 },
    );
  }

  try {
    const payload = (await request.json()) as GeneratorRequest;

    if (payload.kind === "google-seo") return await generateGoogleSeo(payload);
    if (payload.kind === "post") return await generatePost(payload);

    return NextResponse.json({ error: "Tipo de gerador inválido." }, { status: 400 });
  } catch (error) {
    const message =
      error instanceof SyntaxError
        ? "A IA retornou um formato inválido. Tente gerar novamente."
        : error instanceof Error
          ? error.message
          : "Erro inesperado ao gerar conteúdo.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
