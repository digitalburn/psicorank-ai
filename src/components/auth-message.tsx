"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

type Props = {
  error?: string;
  message?: string;
};

export function AuthMessage({ error: initialError, message: initialMessage }: Props) {
  const [error, setError] = useState(initialError ?? null);
  const [message] = useState(initialMessage ?? null);

  if (!error && !message) return null;

  if (error) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-rose-700">
        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
        <p className="flex-1 font-medium leading-6">{error}</p>
        <button onClick={() => setError(null)} aria-label="Fechar">
          <X className="size-4 text-rose-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-mint/30 bg-mint/5 px-4 py-3.5 text-sm text-mint">
      <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p className="font-medium leading-6">{message}</p>
    </div>
  );
}
