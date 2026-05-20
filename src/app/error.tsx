"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log para monitoramento (Sentry, etc.)
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-5 dark:bg-[#060816]">
      <div className="grid size-16 place-items-center rounded-3xl bg-rose-500/10">
        <AlertTriangle className="size-7 text-rose-500" aria-hidden />
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Algo deu errado
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Ocorreu um erro inesperado. Tente novamente ou volte para a página inicial.
        </p>
        {error.digest && (
          <p className="mt-1 font-mono text-xs text-slate-400">
            Código: {error.digest}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RotateCcw className="size-4" aria-hidden />
          Tentar novamente
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
        >
          <Home className="size-4" aria-hidden />
          Página inicial
        </Link>
      </div>
    </div>
  );
}
