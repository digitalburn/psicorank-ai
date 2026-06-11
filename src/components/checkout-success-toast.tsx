"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

export function CheckoutSuccessToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      setVisible(true);
      // Remove o param da URL sem reload
      const url = new URL(window.location.href);
      url.searchParams.delete("checkout");
      router.replace(url.pathname + url.search, { scroll: false });
      const t = setTimeout(() => setVisible(false), 6000);
      return () => clearTimeout(t);
    }
  }, [searchParams, router]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="fixed right-5 top-5 z-50 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.14)] dark:border-emerald-800 dark:bg-slate-900"
        >
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-500/10">
            <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-950 dark:text-white">Assinatura ativada!</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Seu plano Pro está ativo agora.</p>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="ml-2 rounded-lg p-1.5 text-slate-400 transition hover:text-slate-600"
            aria-label="Fechar"
          >
            <X className="size-4" aria-hidden />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
