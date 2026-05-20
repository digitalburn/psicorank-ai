"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Play,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.2, 0.85, 0.2, 1] as const },
});

const avatarColors = ["#18B88F", "#6246EA", "#F56B5F", "#38bdf8", "#f59e0b"];

export function LandingHero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-20">
      {/* Ambient gradient orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-20 h-[700px] w-[700px] rounded-full bg-emerald-400/25 blur-[130px] dark:bg-emerald-500/12" />
        <div className="absolute -right-40 top-10 h-[600px] w-[600px] rounded-full bg-indigo-500/20 blur-[130px] dark:bg-indigo-500/10" />
        <div className="absolute bottom-0 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-400/15 blur-[120px] dark:bg-violet-500/8" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pt-20 lg:pt-28">
        {/* Badge */}
        <motion.div className="flex justify-center" {...fadeUp(0)}>
          <span className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-mint backdrop-blur">
            <Sparkles className="size-3.5" aria-hidden />
            IA para presença local de psicólogos
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="mx-auto mt-6 max-w-4xl text-center text-5xl font-extrabold leading-[1.1] tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl"
          {...fadeUp(0.1)}
        >
          Presença digital
          <span className="block bg-gradient-to-r from-mint via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            premium para psicólogos
          </span>
          com inteligência artificial.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-slate-500 dark:text-slate-400"
          {...fadeUp(0.2)}
        >
          Posts para Instagram, respostas no Google, SEO local e relatórios de reputação — tudo em
          uma plataforma construída para profissionais de saúde mental.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          {...fadeUp(0.3)}
        >
          <Link
            href="/login"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-slate-950 px-8 py-4 text-base font-bold text-white shadow-[0_14px_32px_rgba(15,23,42,0.22)] transition hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(15,23,42,0.3)] dark:bg-white dark:text-slate-950"
          >
            Começar grátis
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <button className="inline-flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/70 px-8 py-4 text-base font-semibold text-slate-700 backdrop-blur transition hover:border-slate-300 hover:bg-white dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-900">
            <div className="grid size-7 place-items-center rounded-full bg-slate-950 shadow-sm dark:bg-white">
              <Play className="size-3 fill-white dark:fill-slate-950" aria-hidden />
            </div>
            Ver como funciona
          </button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10"
          {...fadeUp(0.42)}
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {avatarColors.map((color, i) => (
                <div
                  key={i}
                  className="size-8 rounded-full border-2 border-white shadow dark:border-[#060816]"
                  style={{ background: color }}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              +500 psicólogos usando
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

          <div className="flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className="size-4 fill-amber-400" viewBox="0 0 20 20" aria-hidden>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1 text-sm font-semibold text-slate-600 dark:text-slate-400">
              4.9 — excelente
            </span>
          </div>
        </motion.div>

        {/* Platform mockup */}
        <motion.div
          className="relative mx-auto mt-16 max-w-5xl"
          initial={{ opacity: 0, y: 48, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.2, 0.85, 0.2, 1] }}
        >
          {/* Glow behind mockup */}
          <div
            aria-hidden
            className="absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-mint/30 via-indigo-500/20 to-violet-500/20 blur-3xl dark:from-mint/15 dark:via-indigo-500/10 dark:to-violet-500/10"
          />

          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_40px_100px_rgba(15,23,42,0.12)] dark:border-slate-700/60 dark:bg-[#0d1424]">
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-5 py-3.5 dark:border-slate-800 dark:bg-[#0b1120]">
              <div className="size-3 rounded-full bg-rose-400" />
              <div className="size-3 rounded-full bg-amber-400" />
              <div className="size-3 rounded-full bg-emerald-400" />
              <div className="ml-4 flex-1 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-400 dark:border-slate-700 dark:bg-slate-800">
                app.psicorank.com/dashboard
              </div>
            </div>

            {/* Dashboard */}
            <div className="flex h-[400px] sm:h-[440px]">
              {/* Sidebar */}
              <div className="hidden w-52 shrink-0 flex-col gap-1 border-r border-slate-100 p-4 dark:border-slate-800 sm:flex">
                <div className="flex items-center gap-2.5 rounded-xl bg-slate-950 px-3 py-2.5 text-white dark:bg-white dark:text-slate-950">
                  <BrainCircuit className="size-4 shrink-0" aria-hidden />
                  <span className="text-xs font-bold">PsicoRank AI</span>
                </div>
                <div className="mt-3 space-y-0.5">
                  {[
                    { label: "Overview", active: true },
                    { label: "Posts IA" },
                    { label: "SEO local" },
                    { label: "Avaliações" },
                    { label: "Calendário" },
                    { label: "Relatórios" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                        item.active
                          ? "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white"
                          : "text-slate-500 dark:text-slate-500"
                      }`}
                    >
                      <div
                        className={`size-1.5 rounded-full ${item.active ? "bg-mint" : "bg-slate-300 dark:bg-slate-600"}`}
                      />
                      {item.label}
                    </div>
                  ))}
                </div>
                <div className="mt-auto rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 p-3 text-white dark:from-mint/20 dark:to-indigo-500/20">
                  <p className="text-xs font-semibold">Sinal do dia</p>
                  <p className="mt-1 text-2xl font-bold text-mint">+34%</p>
                  <p className="text-xs text-white/60 dark:text-white/50">descoberta local</p>
                </div>
              </div>

              {/* Main content */}
              <div className="flex flex-1 flex-col gap-4 overflow-hidden p-5">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Descoberta local", value: "+34%", icon: TrendingUp, accent: "text-mint" },
                    { label: "Posts publicados", value: "28", icon: Sparkles, accent: "text-indigo-500" },
                    { label: "Pacientes novos", value: "12", icon: Users, accent: "text-violet-500" },
                  ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={stat.label}
                        className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/40"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {stat.label}
                          </p>
                          <Icon className={`size-3.5 ${stat.accent}`} aria-hidden />
                        </div>
                        <p className="mt-1.5 text-xl font-bold text-slate-950 dark:text-white">
                          {stat.value}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Posts list */}
                <div className="flex-1 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Posts IA — Instagram
                    </p>
                    <span className="flex items-center gap-1.5 rounded-full bg-mint/10 px-2.5 py-1 text-xs font-bold text-mint">
                      <Sparkles className="size-3" aria-hidden />
                      Gerar novo
                    </span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {[
                      { text: "Como a TCC pode ajudar com ansiedade social...", status: "Publicado", statusColor: "text-mint bg-mint/10" },
                      { text: "5 sinais de que você pode se beneficiar de apoio psicológico...", status: "Agendado", statusColor: "text-indigo-600 bg-indigo-500/10 dark:text-indigo-400" },
                      { text: "Setembro Amarelo: entenda a importância do cuidado...", status: "Rascunho", statusColor: "text-slate-500 bg-slate-100 dark:bg-slate-700 dark:text-slate-400" },
                    ].map((post, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2.5 dark:border-slate-700/50 dark:bg-[#0d1424]"
                      >
                        <div className="h-7 w-7 shrink-0 rounded-lg bg-gradient-to-br from-mint to-cyan-400" />
                        <p className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {post.text}
                        </p>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${post.statusColor}`}>
                          {post.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
