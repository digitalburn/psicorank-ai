import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  findOrCreateCustomer,
  createSubscription,
  type BillingInterval,
  type PlanKey,
} from "@/lib/asaas";

export async function POST(request: Request) {
  if (!process.env.ASAAS_API_KEY) {
    return NextResponse.json({ error: "ASAAS_API_KEY não configurado." }, { status: 500 });
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { plan, billing, cpfCnpj } = (await request.json()) as {
    plan: PlanKey;
    billing: BillingInterval;
    cpfCnpj: string;
  };

  if (!["pro", "clinic"].includes(plan) || !["monthly", "annual"].includes(billing)) {
    return NextResponse.json({ error: "Plano ou período inválido." }, { status: 400 });
  }

  const cpf = (cpfCnpj ?? "").replace(/\D/g, "");
  if (cpf.length !== 11 && cpf.length !== 14) {
    return NextResponse.json({ error: "CPF ou CNPJ inválido." }, { status: 400 });
  }

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, email, name")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id as string | undefined;

    if (!customerId) {
      customerId = await findOrCreateCustomer(
        profile?.email ?? user.email ?? "",
        profile?.name ?? "Psicólogo(a)",
        cpf,
      );
      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const { id: subscriptionId, invoiceUrl } = await createSubscription({
      customerId,
      plan,
      billing,
      userId: user.id,
    });

    if (!invoiceUrl) {
      return NextResponse.json(
        { error: "Não foi possível gerar o link de pagamento. Tente novamente." },
        { status: 500 },
      );
    }

    // Salva assinatura pendente para o webhook atualizar ao confirmar
    await supabase.from("subscriptions").upsert(
      {
        user_id: user.id,
        stripe_subscription_id: subscriptionId,
        stripe_price_id: `${plan}-${billing}`,
        status: "pending",
        plan,
        current_period_end: null,
        cancel_at_period_end: false,
      },
      { onConflict: "user_id" },
    );

    return NextResponse.json({ url: invoiceUrl });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao criar assinatura.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
