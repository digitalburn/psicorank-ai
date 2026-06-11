import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe, planFromPriceId } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendPaymentReceiptEmail } from "@/lib/email";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook não configurado." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.mode !== "subscription" || !session.subscription) return NextResponse.json({ ok: true });

    const sub = await stripe.subscriptions.retrieve(session.subscription as string);
    await upsertSubscription(supabase, sub);

    // Envia recibo de pagamento
    const userId = sub.metadata?.supabase_user_id;
    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("email, name, plan")
        .eq("id", userId)
        .single();
      if (profile?.email) {
        const planLabel = profile.plan === "clinic" ? "Clínica" : "Pro";
        const amountTotal = session.amount_total ?? 0;
        const amountStr = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amountTotal / 100);
        sendPaymentReceiptEmail(profile.email, profile.name, planLabel, amountStr).catch(() => null);
      }
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.created") {
    const sub = event.data.object as Stripe.Subscription;
    await upsertSubscription(supabase, sub);
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const userId = sub.metadata?.supabase_user_id;
    if (!userId) return NextResponse.json({ ok: true });

    await supabase.from("subscriptions").delete().eq("stripe_subscription_id", sub.id);
    await supabase.from("profiles").update({ plan: "starter" }).eq("id", userId);
  }

  return NextResponse.json({ ok: true });
}

async function upsertSubscription(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  sub: Stripe.Subscription,
) {
  const userId = sub.metadata?.supabase_user_id;
  if (!userId) return;

  const priceId = sub.items.data[0]?.price?.id ?? "";
  const plan = planFromPriceId(priceId);
  const isActive = sub.status === "active" || sub.status === "trialing";

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: sub.id,
      stripe_price_id: priceId,
      status: sub.status,
      plan,
      current_period_end: new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000).toISOString(),
      cancel_at_period_end: sub.cancel_at_period_end,
    },
    { onConflict: "user_id" },
  );

  if (isActive) {
    await supabase.from("profiles").update({ plan }).eq("id", userId);
  } else {
    await supabase.from("profiles").update({ plan: "starter" }).eq("id", userId);
  }
}
