import { BrainCircuit } from "lucide-react";

export function AppLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-11 place-items-center rounded-2xl bg-slate-950 text-white shadow-[0_14px_28px_rgba(15,23,42,0.22)] dark:bg-white dark:text-slate-950">
        <BrainCircuit className="size-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-base font-bold leading-tight text-slate-950 dark:text-white">
          PsicoRank AI
        </p>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Growth para psicologos
        </p>
      </div>
    </div>
  );
}
