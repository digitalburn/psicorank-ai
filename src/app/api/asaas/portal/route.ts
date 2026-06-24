import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// Redireciona para suporte WhatsApp — portal de autoatendimento planejado para v2
export async function POST() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end")
    .eq("user_id", user.id)
    .single();

  const planLabel = sub?.plan === "clinic" ? "Clínica" : "Pro";
  const msg = encodeURIComponent(
    `Olá! Preciso gerenciar minha assinatura PsicoRank ${planLabel}.`,
  );

  return NextResponse.json({
    url: `https://wa.me/5511982113231?text=${msg}`,
  });
}
