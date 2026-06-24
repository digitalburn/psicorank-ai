"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Check, Loader2, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/cn";
import { CpfCheckoutModal } from "@/components/cpf-checkout-modal";

const plans = [
  {
    name: "Starter",
    description: "Para psicólogos que querem dar o primeiro passo no digital.",
    monthlyPrice: 0,
    annualPrice: 0,
    cta: "Começar grátis",
    ctaVariant: "secondary" as const,
    popular: false,
    features: [
      "5 posts IA por mês",
      "SEO básico — 1 cidade",
      "Diagnóstico de perfil Google",
      "Calendário editorial simples",
      "Suporte por email",
    ],
    missing: [
      "Posts ilimitados",
      "Relatórios avançados",
      "Múltiplas cidades",
    ],
  },
  {
    name: "Pro",
    description: "O plano ideal para psicólogos que querem crescimento real.",
    monthlyPrice: 147,
    annualPrice: 117,
    cta: "Assinar Pro",
    ctaVariant: "primary" as const,
    popular: true,
    features: [
      "Posts IA ilimitados",
      "SEO completo — até 3 cidades",
      "2 consultórios Google Meu Negócio",
      "Avaliações reais do GMB no painel",
      "Respostas automáticas a avaliações",
      "Calendário editorial avançado",
      "Relatórios de reputação mensais",
      "Prioridade no suporte",
    ],
    missing: [],
  },
  {
    name: "Clínica",
    description: "Para clínicas e grupos com múltiplos profissionais.",
    monthlyPrice: 347,
    annualPrice: 277,
    cta: "Falar com equipe",
    ctaVariant: "secondary" as const,
    popular: false,
    features: [
      "Tudo do plano Pro",
      "Até 5 psicólogos na conta",
      "Cidades ilimitadas",
      "Branding personalizado",
      "Gerente de conta dedicado",
      "API e integrações custom",
      "Treinamento exclusivo",
    ],
    missing: [],
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.85, 0.2, 1] as const } },
};

export function LandingPricing() {
  const [annual, setAnnual] = useState(false);
  const [modal, setModal] = useState<{ plan: "pro" | "clinic"; billing: "monthly" | "annual" } | null>(null);

  function handlePro() {
    setModal({ plan: "pro", billing: annual ? "annual" : "monthly" });
  }

  function handleClinic() {
    window.open("https://wa.me/5511982113231?text=Quero+conhecer+o+plano+Cl%C3%ADnica+do+PsicoRank", "_blank");
  }

  return (
    <section id="planos" className="relative py-24 sm:py-32">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(24,184,143,0.08),transparent)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(24,184,143,0.05),transparent)]"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-mint">
            <Zap className="size-3.5" aria-hidden />
            Planos e preços
          </span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Investimento que se paga em um mês.
          </h2>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
            Sem contrato de fidelidade. Cancele quando quiser.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "rounded-xl px-5 py-2 text-sm font-semibold transition",
                !annual
                  ? "bg-slate-950 text-white shadow dark:bg-white dark:text-slate-950"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
              )}
            >
              Mensal
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition",
                annual
                  ? "bg-slate-950 text-white shadow dark:bg-white dark:text-slate-950"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
              )}
            >
              Anual
              <span className="rounded-full bg-mint/15 px-2 py-0.5 text-xs font-bold text-mint">
                -20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plans grid */}
        <motion.div
          className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              className={cn(
                "relative flex flex-col rounded-3xl p-7 transition-all duration-300",
                plan.popular
                  ? "border-2 border-mint bg-gradient-to-b from-white to-slate-50/80 shadow-[0_24px_80px_rgba(24,184,143,0.18)] dark:from-[#0d1a14] dark:to-[#0a1510]"
                  : "border border-slate-200/80 bg-white/80 shadow-panel backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/60",
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-[0_8px_20px_rgba(24,184,143,0.4)]">
                    <Sparkles className="size-3" aria-hidden />
                    Mais popular
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">{plan.name}</h3>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>
              </div>

              <div className="mt-6">
                {plan.monthlyPrice === 0 ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold text-slate-950 dark:text-white">
                      Grátis
                    </span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-500">R$</span>
                    <span className="text-5xl font-extrabold text-slate-950 dark:text-white">
                      {annual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-sm font-medium text-slate-400">/mês</span>
                  </div>
                )}
                {annual && plan.monthlyPrice > 0 && (
                  <p className="mt-1 text-xs font-medium text-mint">
                    Cobrado anualmente — economize R${(plan.monthlyPrice - plan.annualPrice) * 12}/ano
                  </p>
                )}
              </div>

              {plan.name === "Pro" ? (
                <button
                  onClick={handlePro}
                  className={cn(
                    "mt-7 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition hover:-translate-y-0.5",
                    "bg-mint text-white shadow-[0_12px_32px_rgba(24,184,143,0.35)] hover:shadow-[0_18px_40px_rgba(24,184,143,0.45)]",
                  )}
                >
                  {plan.cta}
                </button>
              ) : plan.name === "Clínica" ? (
                <button
                  onClick={handleClinic}
                  className={cn(
                    "mt-7 flex w-full items-center justify-center rounded-2xl py-3.5 text-sm font-bold transition hover:-translate-y-0.5",
                    "border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700",
                  )}
                >
                  {plan.cta}
                </button>
              ) : (
                <Link
                  href="/login"
                  className={cn(
                    "mt-7 flex w-full items-center justify-center rounded-2xl py-3.5 text-sm font-bold transition hover:-translate-y-0.5",
                    "border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700",
                  )}
                >
                  {plan.cta}
                </Link>
              )}

              <div className="mt-7 space-y-3.5">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-mint/15">
                      <Check className="size-3 text-mint" aria-hidden />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {feature}
                    </span>
                  </div>
                ))}
                {plan.missing.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 opacity-40">
                    <div className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="size-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                    </div>
                    <span className="text-sm font-medium text-slate-500 line-through dark:text-slate-400">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Guarantee badge */}
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-6 py-3.5 shadow-sm backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/60">
            <div className="grid size-8 place-items-center rounded-full bg-mint/10">
              <Check className="size-4 text-mint" aria-hidden />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Garantia de 14 dias — cancele sem perguntas, sem burocracia.
            </p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {modal && (
          <CpfCheckoutModal
            plan={modal.plan}
            billing={modal.billing}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
