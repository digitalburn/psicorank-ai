"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  CalendarDays,
  FileText,
  MapPin,
  MessageSquareText,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Posts IA para Instagram",
    description:
      "Gere conteúdo educativo, ético e alinhado às normas do CFP em segundos. Captions, hashtags e frequência ideal — tudo automatizado.",
    gradient: "from-mint to-cyan-400",
    glow: "group-hover:shadow-[0_20px_60px_rgba(24,184,143,0.18)]",
  },
  {
    icon: MapPin,
    title: "SEO local otimizado",
    description:
      "Apareça no top do Google quando pacientes pesquisam psicólogos na sua cidade. Otimize seu Google Business com IA em minutos.",
    gradient: "from-indigo-500 to-violet-500",
    glow: "group-hover:shadow-[0_20px_60px_rgba(99,102,241,0.18)]",
  },
  {
    icon: Star,
    title: "Respostas éticas",
    description:
      "Responda avaliações no Google com linguagem profissional, empática e dentro dos princípios deontológicos da psicologia.",
    gradient: "from-amber-400 to-orange-400",
    glow: "group-hover:shadow-[0_20px_60px_rgba(251,191,36,0.18)]",
  },
  {
    icon: CalendarDays,
    title: "Calendário editorial",
    description:
      "Planejamento de conteúdo inteligente para semanas ou meses inteiros. Datas comemorativas da saúde mental incluídas automaticamente.",
    gradient: "from-rose-400 to-pink-500",
    glow: "group-hover:shadow-[0_20px_60px_rgba(244,114,182,0.18)]",
  },
  {
    icon: BarChart3,
    title: "Relatórios de reputação",
    description:
      "Acompanhe sua pontuação no Google, evolução das buscas locais e comparativo com períodos anteriores em um dashboard limpo.",
    gradient: "from-sky-400 to-blue-500",
    glow: "group-hover:shadow-[0_20px_60px_rgba(56,189,248,0.18)]",
  },
  {
    icon: FileText,
    title: "Múltiplas especialidades",
    description:
      "Funciona para psicólogos clínicos, terapeutas, neuropsicólogos e qualquer especialidade. Adapta a linguagem automaticamente.",
    gradient: "from-violet-500 to-plum",
    glow: "group-hover:shadow-[0_20px_60px_rgba(98,70,234,0.18)]",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.85, 0.2, 1] as const } },
};

const stats = [
  { value: "+500", label: "psicólogos ativos" },
  { value: "4.9★", label: "avaliação média" },
  { value: "+34%", label: "crescimento local médio" },
  { value: "< 5min", label: "para criar um post" },
];

export function LandingFeatures() {
  return (
    <section id="beneficios" className="relative py-24 sm:py-32">
      {/* Subtle background grid */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(24,184,143,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(24,184,143,0.05),transparent)]"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section header */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-mint">
            <TrendingUp className="size-3.5" aria-hidden />
            Por que o PsicoRank AI
          </span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Tudo que você precisa para crescer no digital.
          </h2>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
            Ferramentas de IA criadas especialmente para profissionais de saúde mental, com respeito
            às normas éticas da psicologia.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200/70 bg-white/80 py-5 text-center backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/60"
            >
              <p className="text-3xl font-extrabold text-slate-950 dark:text-white">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Feature cards */}
        <motion.div
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className={`group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1 dark:border-slate-800/70 dark:bg-slate-900/60 ${feature.glow}`}
              >
                {/* Icon */}
                <div
                  className={`inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg`}
                >
                  <Icon className="size-5 text-white" aria-hidden />
                </div>

                {/* Gradient shine on hover */}
                <div
                  aria-hidden
                  className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to))`,
                  }}
                />

                <h3 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA row */}
        <motion.div
          className="mt-16 flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <MessageSquareText className="size-4 text-mint" aria-hidden />
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Conteúdo 100% em conformidade com o CFP
            </span>
          </div>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-mint" aria-hidden />
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              SEO para todas as regiões do Brasil
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
