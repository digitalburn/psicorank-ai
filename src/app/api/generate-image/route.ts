import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { ideiaVisual, topic, specialty } = (await request.json()) as {
    ideiaVisual: string;
    topic?: string;
    specialty?: string;
  };

  if (!ideiaVisual?.trim()) {
    return NextResponse.json({ error: "Descrição da imagem ausente." }, { status: 400 });
  }

  const prompt = [
    `Create a professional Instagram post image for a Brazilian psychologist.`,
    `Visual concept: ${ideiaVisual}`,
    topic ? `Theme: ${topic}` : "",
    specialty ? `Specialty: ${specialty}` : "",
    `Style: calm, warm, minimalist, pastel tones, soft lighting, no text, no words, no letters, high quality photography or illustration, suitable for mental health professionals, Instagram square format.`,
  ]
    .filter(Boolean)
    .join(" ");

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural",
    });

    const url = response.data?.[0]?.url;
    if (!url) throw new Error("Sem URL na resposta do DALL-E.");

    return NextResponse.json({ url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao gerar imagem.";
    console.error("[generate-image]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
