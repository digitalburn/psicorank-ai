import type { Plan } from "@/lib/database.types";

const BASE_URL =
  process.env.ASAAS_SANDBOX === "true"
    ? "https://sandbox.asaas.com/api/v3"
    : "https://api.asaas.com/v3";

async function req<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      access_token: process.env.ASAAS_API_KEY!,
      ...(options?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Asaas ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

export type BillingInterval = "monthly" | "annual";
export type PlanKey = "pro" | "clinic";

const PLAN_VALUES: Record<string, number> = {
  "pro-monthly": 147,
  "pro-annual": 1470,
  "clinic-monthly": 347,
  "clinic-annual": 3470,
};

export function getPlanValue(plan: PlanKey, billing: BillingInterval): number {
  return PLAN_VALUES[`${plan}-${billing}`] ?? 0;
}

export function planFromPriceKey(priceKey: string): Plan {
  if (priceKey.startsWith("pro")) return "pro";
  if (priceKey.startsWith("clinic")) return "clinic";
  return "starter";
}

export async function findOrCreateCustomer(
  email: string,
  name: string,
  cpfCnpj: string,
): Promise<string> {
  type CustomerList = { data: Array<{ id: string }> };
  const list = await req<CustomerList>(
    `/customers?email=${encodeURIComponent(email)}&limit=1`,
  );
  if (list.data.length > 0) return list.data[0].id;

  const customer = await req<{ id: string }>("/customers", {
    method: "POST",
    body: JSON.stringify({ name, email, cpfCnpj }),
  });
  return customer.id;
}

export async function createSubscription(params: {
  customerId: string;
  plan: PlanKey;
  billing: BillingInterval;
  userId: string;
}): Promise<{ id: string; invoiceUrl: string }> {
  const value = getPlanValue(params.plan, params.billing);
  const cycle = params.billing === "annual" ? "YEARLY" : "MONTHLY";
  const nextDueDate = new Date().toISOString().split("T")[0];

  const sub = await req<{ id: string }>("/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      customer: params.customerId,
      billingType: "UNDEFINED",
      value,
      nextDueDate,
      cycle,
      description: `PsicoRank ${params.plan === "pro" ? "Pro" : "Clínica"} ${params.billing === "annual" ? "Anual" : "Mensal"}`,
      externalReference: params.userId,
    }),
  });

  type PaymentList = { data: Array<{ invoiceUrl?: string; bankSlipUrl?: string }> };
  const payments = await req<PaymentList>(`/subscriptions/${sub.id}/payments?limit=1`);
  const first = payments.data?.[0];
  const invoiceUrl = first?.invoiceUrl ?? first?.bankSlipUrl ?? "";

  return { id: sub.id, invoiceUrl };
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  await req(`/subscriptions/${subscriptionId}`, { method: "DELETE" });
}
