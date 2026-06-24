"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Lock, X } from "lucide-react";

type Plan = "pro" | "clinic";
type Billing = "monthly" | "annual";

interface Props {
  plan: Plan;
  billing: Billing;
  onClose: () => void;
}

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export function CpfCheckoutModal({ plan, billing, onClose }: Props) {
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const digits = cpf.replace(/\D/g, "");
    if (digits.length !== 11 && digits.length !== 14) {
      setError("Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/asaas/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billing, cpfCnpj: digits }),
      });
      const data = (await res.json()) as { url?: string; error?: string };

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Erro ao gerar link de pagamento.");
        setLoading(false);
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  const planLabel = plan === "clinic" ? "Clínica" : "Pro";
  const billingLabel = billing === "annual" ? "Anual" : "Mensal";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_32px_80px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: [0.2, 0.85, 0.2, 1] }}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-lg p-1.5 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300"
          aria-label="Fechar"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-2xl bg-mint/10">
            <Lock className="size-4 text-mint" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-950 dark:text-white">
              Plano {planLabel} — {billingLabel}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pagamento seguro via Asaas</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
              CPF ou CNPJ
            </span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(formatCpf(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-mint/60 focus:ring-2 focus:ring-mint/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
              required
              autoFocus
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Exigido pelo Asaas para emissão do boleto/PIX
            </p>
          </label>

          {error && (
            <p className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-mint py-3.5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(24,184,143,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(24,184,143,0.45)] disabled:translate-y-0 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Gerando link...
              </>
            ) : (
              "Ir para pagamento →"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
