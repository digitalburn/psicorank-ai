import Link from "next/link";
import { BrainCircuit, Home, Search } from "lucide-react";

export const metadata = { title: "Página não encontrada" };

export default function NotFound() {
  return (
    <main className="login-surface relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 text-center">
      <div className="login-sheen" aria-hidden />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="grid size-16 place-items-center rounded-3xl bg-slate-950 text-white shadow-[0_20px_48px_rgba(15,23,42,0.22)] dark:bg-white dark:text-slate-950">
          <BrainCircuit className="size-8" aria-hidden />
        </div>

        {/* 404 */}
        <div>
          <p className="text-7xl font-extrabold tracking-tight text-slate-950/10 dark:text-white/10">
            404
          </p>
          <h1 className="-mt-2 text-2xl font-bold text-slate-950 dark:text-white">
            Página não encontrada
          </h1>
          <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            A página que você procura não existe ou foi movida.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_32px_rgba(15,23,42,0.2)] transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
          >
            <Home className="size-4" aria-hidden />
            Página inicial
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <Search className="size-4" aria-hidden />
            Ir para o dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
