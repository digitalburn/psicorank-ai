"use client";

import { useEffect, useState } from "react";
import { Loader2, Crown, Zap } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type Plan = "starter" | "pro" | "clinic";

async function openPortal() {
  const res = await fetch("/api/asaas/portal", { method: "POST" });
  const data = (await res.json()) as { url?: string };
  if (data.url) window.open(data.url, "_blank");
}

async function openCheckout() {
  const res = await fetch("/api/asaas/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan: "pro", billing: "monthly" }),
  });
  const data = (await res.json()) as { url?: string };
  if (data.url) window.location.href = data.url;
}

export function PlanStatus() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    void supabase
      .from("profiles")
      .select("plan")
      .single()
      .then(({ data }) => setPlan((data?.plan as Plan) ?? "starter"),
            () => setPlan("starter"));
  }, []);

  if (plan === null) return null;

  const isPaid = plan === "pro" || plan === "clinic";
  const label = plan === "clinic" ? "Clínica" : plan === "pro" ? "Pro" : "Starter";

  return (
    <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          Plano atual
        </p>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold
          ${isPaid
            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          }`}>
          {isPaid ? <Crown className="size-3" aria-hidden /> : <Zap className="size-3" aria-hidden />}
          {label}
        </span>
      </div>

      {isPaid ? (
        <button
          onClick={async () => { setLoading(true); await openPortal(); setLoading(false); }}
          disabled={loading}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-white disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
        >
          {loading && <Loader2 className="size-3.5 animate-spin" aria-hidden />}
          Gerenciar assinatura
        </button>
      ) : (
        <button
          onClick={async () => { setLoading(true); await openCheckout(); setLoading(false); }}
          disabled={loading}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-mint py-2 text-xs font-bold text-white shadow-[0_6px_16px_rgba(24,184,143,.3)] transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {loading && <Loader2 className="size-3.5 animate-spin" aria-hidden />}
          Fazer upgrade → Pro
        </button>
      )}
    </div>
  );
}
