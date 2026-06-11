import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { stripe, getPriceId, type BillingInterval } from "@/lib/stripe";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { plan, billing } = (await request.json()) as {
    plan: "pro" | "clinic";
    billing: BillingInterval;
  };

  if (!["pro", "clinic"].includes(plan) || !["monthly", "annual"].includes(billing)) {
    return NextResponse.json({ error: "Plano ou período inválido." }, { status: 400 });
  }

  let priceId: string;
  try {
    priceId = getPriceId(plan, billing);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Price ID não configurado." },
      { status: 500 },
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, email, name")
    .eq("id", user.id)
    .single();

  let customerId = profile?.stripe_customer_id as string | undefined;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email ?? user.email ?? undefined,
      name: profile?.name ?? undefined,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${siteUrl}/dashboard?checkout=success`,
    cancel_url: `${siteUrl}/#planos`,
    locale: "pt-BR",
    metadata: { supabase_user_id: user.id },
    subscription_data: {
      metadata: { supabase_user_id: user.id, plan, billing },
    },
  });

  return NextResponse.json({ url: session.url });
}
