"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Clock3,
  Eye,
  Layers3,
  SearchCheck,
  Star,
  TrendingUp,
  UserPlus,
  Zap,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { GeneratorWorkspace } from "@/components/generator-workspace";
import { GoogleSeoGenerator } from "@/components/google-seo-generator";
import { ContentHistory } from "@/components/content-history";
import { cn } from "@/lib/cn";

const metrics = [
  {
    label: "Visualizacoes",
    value: "24.8k",
    detail: "+18% nos ultimos 30 dias",
    progress: 78,
    icon: Eye,
  },
  {
    label: "Leads",
    value: "312",
    detail: "Contatos vindos de busca e Instagram",
    progress: 62,
    icon: UserPlus,
  },
  {
    label: "Avaliacoes",
    value: "4.9",
    detail: "Media publica monitorada",
    progress: 92,
    icon: Star,
  },
  {
    label: "Crescimento",
    value: "+34%",
    detail: "Evolucao de descoberta local",
    progress: 70,
    icon: TrendingUp,
  },
  {
    label: "Score SEO",
    value: "86",
    detail: "Pontuacao estimada do perfil local",
    progress: 86,
    icon: SearchCheck,
  },
];

const trendSeries = [42, 48, 53, 49, 62, 68, 74, 69, 82, 88, 84, 96];

const channelBars = [
  { label: "Instagram", value: 74 },
  { label: "Google", value: 86 },
  { label: "Indicação", value: 54 },
  { label: "Direct", value: 68 },
];

const activity = [
  {
    title: "Post sobre ansiedade finalizado",
    time: "agora",
    tag: "Instagram",
    accent: "emerald",
  },
  {
    title: "SEO local atualizado para Sao Paulo",
    time: "12 min",
    tag: "Google Meu Negocio",
    accent: "blue",
  },
  {
    title: "Resposta de avaliacao pronta",
    time: "48 min",
    tag: "Reputacao",
    accent: "violet",
  },
];

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  return (
    <DashboardShell>
      <motion.div className="space-y-6" variants={stagger} initial="hidden" animate="show">
        <motion.section
          className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]"
          variants={item}
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/72 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.1),_transparent_28%)]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <Zap className="size-3.5" aria-hidden="true" />
                Dashboard premium
              </div>
              <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                Um painel limpo para operar conteudo, SEO e reputacao local.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                Acompanhe metricas, produza posts com IA e ajuste a presenca digital da clinica
                com uma interface rapida, editorial e responsiva.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-900 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100">
                  Abrir gerador
                  <ArrowUpRight className="size-4" />
                </button>
                <button className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:hover:bg-slate-800">
                  Ver relatorios
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <motion.div
              className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/72"
              variants={item}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Tendencia 30 dias
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">
                    Crescimento geral
                  </p>
                </div>
                <div className="grid size-11 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                  <Clock3 className="size-5" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-6">
                <MiniLineChart values={trendSeries} />
              </div>
            </motion.div>

            <motion.div
              className="rounded-[2rem] border border-slate-200/80 bg-slate-950 p-5 text-white shadow-[0_20px_60px_rgba(15,23,42,0.14)] dark:border-slate-800/80 dark:bg-white dark:text-slate-950"
              variants={item}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white/56 dark:text-slate-500">
                    Saude do perfil
                  </p>
                  <p className="mt-1 text-lg font-semibold">Score consolidado</p>
                </div>
                <div className="grid size-11 place-items-center rounded-2xl bg-white/10 dark:bg-slate-950/10">
                  <Layers3 className="size-5" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-6 flex items-end gap-4">
                <div className="relative grid size-32 place-items-center">
                  <svg className="size-32 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
                    <circle
                      cx="60"
                      cy="60"
                      r="46"
                      fill="none"
                      className="stroke-white/10 dark:stroke-slate-200"
                      strokeWidth="12"
                    />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="46"
                      fill="none"
                      className="stroke-emerald-400 dark:stroke-emerald-500"
                      strokeLinecap="round"
                      strokeWidth="12"
                      strokeDasharray={289}
                      strokeDashoffset={289 - (289 * 86) / 100}
                      initial={{ strokeDashoffset: 289 }}
                      animate={{ strokeDashoffset: 289 - (289 * 86) / 100 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-3xl font-semibold">86</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/55 dark:text-slate-500">
                      SEO
                    </p>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  {[
                    ["Completeness", 82],
                    ["Keywords locais", 91],
                    ["Autoridade", 74],
                  ].map(([label, value]) => (
                    <div key={label as string}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-white/68 dark:text-slate-600">{label as string}</span>
                        <span className="font-semibold">{value as number}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 dark:bg-slate-200">
                        <div
                          className="h-full rounded-full bg-emerald-400 dark:bg-slate-950"
                          style={{ width: `${value as number}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5" variants={item}>
          {metrics.map((metric, index) => {
            const Icon = metric.icon;

            return (
              <motion.div
                key={metric.label}
                className={cn(
                  "group rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.06)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)] dark:border-slate-800/80 dark:bg-slate-950/72",
                )}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.45 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {metric.label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                      {metric.value}
                    </p>
                  </div>
                  <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white transition group-hover:scale-105 dark:bg-white dark:text-slate-950">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                </div>
                <p className="mt-4 min-h-10 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {metric.detail}
                </p>
                <div className="mt-4 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.progress}%` }}
                    transition={{ duration: 0.7, delay: 0.15 + index * 0.04 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.section>

        <motion.section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]" variants={item}>
          <div className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/72 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Canais
                </p>
                <h3 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">
                  Distribuicao por origem
                </h3>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                atualizado ha 5 min
              </div>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[1.5rem] bg-slate-950 p-4 text-white dark:bg-slate-100 dark:text-slate-950">
                <p className="text-sm font-semibold text-white/60 dark:text-slate-500">
                  Volume por canal
                </p>
                <div className="mt-5 space-y-4">
                  {channelBars.map((bar) => (
                    <div key={bar.label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-white/74 dark:text-slate-600">{bar.label}</span>
                        <span className="font-semibold">{bar.value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/12 dark:bg-slate-200">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 dark:from-slate-950 dark:via-slate-900 dark:to-slate-700"
                          initial={{ width: 0 }}
                          animate={{ width: `${bar.value}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-4">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Indicadores chave
                  </p>
                  <div className="mt-4 grid gap-3">
                    {[
                      ["Tempo de resposta", "8 min"],
                      ["Novas conversoes", "42"],
                      ["Taxa de clique", "6.8%"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-slate-950"
                      >
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          {label}
                        </span>
                        <span className="text-sm font-semibold text-slate-950 dark:text-white">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-blue-500/10 p-4 dark:border-slate-800 dark:from-emerald-500/15 dark:via-cyan-500/15 dark:to-blue-500/15">
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">
                    Visual premium
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Cards limpos, contraste forte e foco no dado, com acabamento de produto SaaS.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/72 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Feed operacional
                </p>
                <h3 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">
                  Atividade recente
                </h3>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {activity.map((entry) => (
                <div
                  key={entry.title}
                  className="flex items-start gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div
                    className={cn(
                      "mt-1 size-2.5 rounded-full",
                      entry.accent === "emerald" && "bg-emerald-500",
                      entry.accent === "blue" && "bg-blue-500",
                      entry.accent === "violet" && "bg-violet-500",
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-950 dark:text-white">{entry.title}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {entry.tag}
                    </p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    {entry.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section className="space-y-5" variants={item}>
          <GeneratorWorkspace />
          <GoogleSeoGenerator />
        </motion.section>

        <motion.section variants={item}>
          <ContentHistory />
        </motion.section>
      </motion.div>
    </DashboardShell>
  );
}

function MiniLineChart({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(max - min, 1);

  return (
    <div className="relative h-44 overflow-hidden rounded-[1.5rem] bg-[linear-gradient(180deg,rgba(15,23,42,0.03),transparent)] p-4 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]">
      <div className="absolute inset-0 grid grid-rows-4 opacity-60">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="border-b border-slate-200/70 last:border-b-0 dark:border-slate-800" />
        ))}
      </div>
      <svg className="relative h-full w-full" viewBox="0 0 600 180" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="chartStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="48%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={buildLinePath(values, range, min)}
          fill="none"
          stroke="url(#chartStroke)"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0.4 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <motion.path
          d={`${buildLinePath(values, range, min)} L 600 180 L 0 180 Z`}
          fill="url(#chartFill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.12 }}
        />
      </svg>
    </div>
  );
}

function buildLinePath(values: number[], range: number, min: number) {
  const step = 600 / Math.max(values.length - 1, 1);

  return values
    .map((value, index) => {
      const x = index * step;
      const y = 150 - ((value - min) / range) * 110;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}
