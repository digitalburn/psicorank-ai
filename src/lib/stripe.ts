import Stripe from "stripe";
import type { Plan } from "@/lib/database.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stripe = new (Stripe as any)(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
}) as Stripe;

export type BillingInterval = "monthly" | "annual";

export function getPriceId(plan: "pro" | "clinic", billing: BillingInterval): string {
  const map: Record<string, string | undefined> = {
    "pro-monthly": process.env.STRIPE_PRICE_PRO_MONTHLY,
    "pro-annual": process.env.STRIPE_PRICE_PRO_ANNUAL,
    "clinic-monthly": process.env.STRIPE_PRICE_CLINIC_MONTHLY,
    "clinic-annual": process.env.STRIPE_PRICE_CLINIC_ANNUAL,
  };
  const id = map[`${plan}-${billing}`];
  if (!id) throw new Error(`STRIPE_PRICE_${plan.toUpperCase()}_${billing.toUpperCase()} não configurado no .env`);
  return id;
}

export function planFromPriceId(priceId: string): Plan {
  const pro = [process.env.STRIPE_PRICE_PRO_MONTHLY, process.env.STRIPE_PRICE_PRO_ANNUAL];
  const clinic = [process.env.STRIPE_PRICE_CLINIC_MONTHLY, process.env.STRIPE_PRICE_CLINIC_ANNUAL];
  if (pro.includes(priceId)) return "pro";
  if (clinic.includes(priceId)) return "clinic";
  return "starter";
}
