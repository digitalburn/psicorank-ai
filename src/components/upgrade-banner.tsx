"use client";

import { useState } from "react";
import { Loader2, Sparkles, X } from "lucide-react";

export function UpgradeBanner() {
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    const res = await fetch("/api/asaas/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: "pro", billing: "monthly" }),
    });
    const data = (await res.json()) as { url?: string; error?: string };
    if (data.url) window.location.href = data.url;
    else setLoading(false);
  }

  if (dismissed) return null;

  return (
    <div className="relative flex items-center gap-4 rounded-2xl border border-mint/30 bg-gradient-to-r from-mint/10 via-emerald-500/8 to-cyan-500/8 px-5 py-4 shadow-sm">
      <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-mint/15">
        <Sparkles className="size-4 text-mint" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          Você está no plano Starter — 5 posts e 1 SEO por mês.
        </p>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Faça upgrade para o Pro e tenha posts ilimitados + SEO para múltiplas cidades.
        </p>
      </div>
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-mint px-4 py-2 text-sm font-bold text-white shadow-[0_8px_20px_rgba(24,184,143,0.3)] transition hover:-translate-y-0.5 disabled:opacity-70"
      >
        {loading && <Loader2 className="size-3.5 animate-spin" aria-hidden />}
        Assinar Pro — R$147/mês
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300"
        aria-label="Fechar"
      >
        <X className="size-4" aria-hidden />
      </button>
    </div>
  );
}
