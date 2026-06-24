"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
};

export function ComingSoon({ icon: Icon, title, description, features }: Props) {
  return (
    <DashboardShell>
      <div className="flex min-h-[70vh] items-center justify-center">
        <motion.div
          className="w-full max-w-lg text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.85, 0.2, 1] }}
        >
          {/* Icon */}
          <div className="mx-auto mb-6 grid size-20 place-items-center rounded-3xl bg-mint/10 ring-1 ring-mint/25">
            <Icon className="size-9 text-mint" aria-hidden />
          </div>

          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-mint">
            <Sparkles className="size-3" aria-hidden />
            Em breve
          </span>

          {/* Headline */}
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-500 dark:text-slate-400">
            {description}
          </p>

          {/* Feature list */}
          <ul className="mt-8 space-y-3 text-left">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-3.5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900"
              >
                <div className="grid size-5 shrink-0 place-items-center rounded-full bg-mint/15">
                  <div className="size-2 rounded-full bg-mint" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{f}</span>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm text-slate-400 dark:text-slate-500">
            Estamos construindo isso para você. Fique ligado nas atualizações.
          </p>
        </motion.div>
      </div>
    </DashboardShell>
  );
}
