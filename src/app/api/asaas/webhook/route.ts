import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { planFromPriceKey } from "@/lib/asaas";
import { sendPaymentReceiptEmail } from "@/lib/email";

type AsaasPayment = {
  id: string;
  customer: string;
  subscription?: string;
  status: string;
  value: number;
  billingType: string;
  dueDate: string;
  paymentDate?: string;
  externalReference?: string;
};

type AsaasSubscription = {
  id: string;
  customer: string;
  externalReference?: string;
};

type AsaasEvent =
  | { event: string; payment: AsaasPayment }
  | { event: string; subscription: AsaasSubscription };

export async function POST(request: Request) {
  const token = request.headers.get("asaas-access-token")?.trim();
  const envToken = process.env.ASAAS_WEBHOOK_TOKEN?.trim();
  if (envToken && token !== envToken) {
    return NextResponse.json({ error: "Token inválido." }, { status: 401 });
  }

  let event: AsaasEvent;
  try {
    event = (await request.json()) as AsaasEvent;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  try {
    if ("payment" in event) {
      const { payment } = event;
      const subscriptionId = payment.subscription;
      if (!subscriptionId) return NextResponse.json({ ok: true });

      if (event.event === "PAYMENT_CONFIRMED" || event.event === "PAYMENT_RECEIVED") {
        // Busca subscription no DB para obter user_id e plano
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("user_id, stripe_price_id")
          .eq("stripe_subscription_id", subscriptionId)
          .single();

        if (!sub) return NextResponse.json({ ok: true });

        const plan = planFromPriceKey(sub.stripe_price_id ?? "");
        const billing = (sub.stripe_price_id ?? "").includes("annual") ? "annual" : "monthly";
        const daysAhead = billing === "annual" ? 366 : 31;
        const periodEnd = new Date();
        periodEnd.setDate(periodEnd.getDate() + daysAhead);

        await supabase
          .from("subscriptions")
          .update({
            status: "active",
            current_period_end: periodEnd.toISOString(),
          })
          .eq("stripe_subscription_id", subscriptionId);

        await supabase
          .from("profiles")
          .update({ plan })
          .eq("id", sub.user_id);

        // Envia recibo por email
        const { data: profile } = await supabase
          .from("profiles")
          .select("email, name, plan")
          .eq("id", sub.user_id)
          .single();

        if (profile?.email) {
          const planLabel = plan === "clinic" ? "Clínica" : "Pro";
          const amountStr = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(payment.value);
          sendPaymentReceiptEmail(profile.email, profile.name, planLabel, amountStr).catch(
            () => null,
          );
        }
      }

      if (event.event === "PAYMENT_DELETED" || event.event === "PAYMENT_REFUNDED") {
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", subscriptionId)
          .single();

        if (sub) {
          await supabase
            .from("subscriptions")
            .update({ status: "cancelled" })
            .eq("stripe_subscription_id", subscriptionId);
          await supabase
            .from("profiles")
            .update({ plan: "starter" })
            .eq("id", sub.user_id);
        }
      }
    }

    if ("subscription" in event && event.event === "SUBSCRIPTION_DELETED") {
      const { subscription } = event;
      const userId = subscription.externalReference;

      await supabase
        .from("subscriptions")
        .update({ status: "cancelled", cancel_at_period_end: false })
        .eq("stripe_subscription_id", subscription.id);

      if (userId) {
        await supabase.from("profiles").update({ plan: "starter" }).eq("id", userId);
      }
    }
  } catch (err) {
    console.error(`[asaas-webhook] falha ao processar ${event.event}:`, err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
