"use client";

import { motion } from "framer-motion";
import { BarChart3, CalendarDays, CheckCircle2, MapPin, Sparkles, Star, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Conecte seu Google Business",
    description:
      "Em 2 minutos, integre sua conta do Google Meu Negócio. Sem necessidade de conhecimento técnico.",
    icon: MapPin,
  },
  {
    number: "02",
    title: "A IA analisa sua presença",
    description:
      "Nossa IA audita seu perfil, avaliações, posicionamento local e gera um diagnóstico completo.",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "Conteúdo e SEO no piloto automático",
    description:
      "Posts, respostas a avaliações e otimizações de SEO prontos para publicar — você só aprova.",
    icon: CheckCircle2,
  },
];

export function LandingMockup() {
  return (
    <section id="plataforma" className="relative overflow-hidden py-24 sm:py-32">
      {/* Background */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#0b1120] dark:via-[#060816] dark:to-[#0b1120]"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/8 blur-[130px] dark:bg-indigo-500/5"
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
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            <BarChart3 className="size-3.5" aria-hidden />
            Como funciona
          </span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Simples como deve ser.
          </h2>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
            Três passos para transformar sua presença digital e atrair mais pacientes na sua região.
          </p>
        </motion.div>

        {/* Steps + Mockup grid */}
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Steps */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.2, 0.85, 0.2, 1] }}
          >
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex gap-5">
                  <div className="flex flex-col items-center gap-2">
                    <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-slate-950 to-slate-800 text-white shadow-[0_12px_32px_rgba(15,23,42,0.22)] dark:from-white dark:to-slate-200 dark:text-slate-950">
                      <Icon className="size-5" aria-hidden />
                    </div>
                    {i < steps.length - 1 && (
                      <div className="w-px flex-1 bg-gradient-to-b from-slate-300 to-transparent dark:from-slate-700" />
                    )}
                  </div>
                  <div className="pb-8">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold tabular-nums text-slate-400 dark:text-slate-500">
                        {step.number}
                      </span>
                      <h3 className="text-lg font-bold text-slate-950 dark:text-white">{step.title}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Mockup panels */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.2, 0.85, 0.2, 1] }}
          >
            <div
              aria-hidden
              className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-mint/20 to-indigo-500/20 blur-3xl dark:from-mint/10 dark:to-indigo-500/10"
            />

            {/* Main panel */}
            <div className="relative space-y-4">
              {/* Analytics card */}
              <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-panel backdrop-blur dark:border-slate-800/80 dark:bg-[#0d1424]/90">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Descoberta no Google
                    </p>
                    <p className="mt-1 text-3xl font-extrabold text-slate-950 dark:text-white">
                      +34%
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-mint/10 px-3 py-1.5 text-sm font-bold text-mint">
                    <TrendingUp className="size-4" aria-hidden />
                    Crescendo
                  </div>
                </div>

                {/* Mini bar chart */}
                <div className="mt-4 flex items-end gap-1.5 h-14">
                  {[40, 55, 45, 65, 58, 72, 68, 82, 75, 90, 85, 100].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-mint/80 to-mint/30 dark:from-mint/60 dark:to-mint/20 transition-all"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-xs text-slate-400">
                  <span>Jan</span>
                  <span>Jun</span>
                  <span>Dez</span>
                </div>
              </div>

              {/* Reviews + Post cards side by side */}
              <div className="grid grid-cols-2 gap-4">
                {/* Reviews card */}
                <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-panel backdrop-blur dark:border-slate-800/80 dark:bg-[#0d1424]/90">
                  <div className="flex items-center gap-2">
                    <Star className="size-4 text-amber-400 fill-amber-400" aria-hidden />
                    <p className="text-xs font-bold text-slate-950 dark:text-white">Avaliações</p>
                  </div>
                  <p className="mt-3 text-3xl font-extrabold text-slate-950 dark:text-white">4.9</p>
                  <div className="mt-2 space-y-1">
                    {[100, 85, 20].map((w, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className="h-full rounded-full bg-amber-400"
                            style={{ width: `${w}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">{5 - i}★</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calendar card */}
                <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-panel backdrop-blur dark:border-slate-800/80 dark:bg-[#0d1424]/90">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-indigo-500" aria-hidden />
                    <p className="text-xs font-bold text-slate-950 dark:text-white">Calendário</p>
                  </div>
                  <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Próximos posts
                  </p>
                  <div className="mt-2 space-y-2">
                    {["Terça — TCC", "Quinta — SEL", "Sábado — CFP"].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded-xl bg-slate-50 px-2.5 py-2 dark:bg-slate-800"
                      >
                        <div className="size-1.5 rounded-full bg-mint" />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI post generation card */}
              <div className="rounded-3xl border border-mint/30 bg-gradient-to-r from-mint/10 to-cyan-400/10 p-5 shadow-panel backdrop-blur dark:border-mint/20 dark:bg-gradient-to-r dark:from-mint/5 dark:to-cyan-400/5">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-mint" aria-hidden />
                  <p className="text-xs font-bold text-slate-950 dark:text-white">Post gerado pela IA</p>
                  <span className="ml-auto rounded-full bg-mint/15 px-2 py-0.5 text-xs font-semibold text-mint">
                    Pronto
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                  &ldquo;A ansiedade é o sinal do seu corpo pedindo atenção. Na terapia, aprendemos a
                  ouvi-lo com mais compaixão...&rdquo;
                </p>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 rounded-xl bg-slate-950 py-2 text-xs font-bold text-white dark:bg-white dark:text-slate-950">
                    Publicar
                  </button>
                  <button className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-400">
                    Editar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
